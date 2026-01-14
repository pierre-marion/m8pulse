<?php

namespace App\Controller;

use App\Entity\Media;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;
use OpenApi\Attributes as OA;

#[Route('/api/media', name: 'api_media_')]
#[OA\Tag(name: 'Médias')]
class MediaController extends AbstractController
{
    private string $uploadDirectory;

    public function __construct(
        private EntityManagerInterface $entityManager,
        private SerializerInterface $serializer
    ) {
        $this->uploadDirectory = __DIR__ . '/../../public/uploads/media';
    }

    #[Route('', name: 'list', methods: ['GET'])]
    #[OA\Get(
        path: '/api/media',
        summary: 'Liste tous les médias',
        description: 'Récupère la liste des fichiers média avec filtres optionnels (nom, type, tag)',
        tags: ['Médias']
    )]
    #[OA\Parameter(
        name: 'search',
        in: 'query',
        description: 'Rechercher par nom de fichier',
        required: false,
        schema: new OA\Schema(type: 'string', example: 'logo')
    )]
    #[OA\Parameter(
        name: 'type',
        in: 'query',
        description: 'Filtrer par type (image, video, audio)',
        required: false,
        schema: new OA\Schema(type: 'string', example: 'image')
    )]
    #[OA\Parameter(
        name: 'tag',
        in: 'query',
        description: 'Filtrer par tag',
        required: false,
        schema: new OA\Schema(type: 'string', example: 'esport')
    )]
    #[OA\Response(
        response: 200,
        description: 'Liste des médias',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(
                properties: [
                    new OA\Property(property: 'id', type: 'integer', example: 1),
                    new OA\Property(property: 'name', type: 'string', example: 'logo-vitality.png'),
                    new OA\Property(property: 'type', type: 'string', example: 'image'),
                    new OA\Property(property: 'url', type: 'string', example: '/uploads/media/logo-vitality.png'),
                    new OA\Property(property: 'size', type: 'integer', example: 45632)
                ]
            )
        )
    )]
    public function list(Request $request): JsonResponse
    {
        $search = $request->query->get('search');
        $type = $request->query->get('type');
        $tag = $request->query->get('tag');
        
        $qb = $this->entityManager->getRepository(Media::class)->createQueryBuilder('m');
        
        if ($search) {
            $qb->andWhere('m.name LIKE :search')
               ->setParameter('search', '%' . $search . '%');
        }
        
        if ($type) {
            $qb->andWhere('m.type = :type')
               ->setParameter('type', $type);
        }
        
        if ($tag) {
            $qb->andWhere('JSON_CONTAINS(m.tags, :tag) = 1')
               ->setParameter('tag', json_encode($tag));
        }
        
        $qb->orderBy('m.uploadedAt', 'DESC');
        
        $media = $qb->getQuery()->getResult();
        
        $data = $this->serializer->serialize($media, 'json', ['groups' => 'media:read']);
        
        return new JsonResponse($data, Response::HTTP_OK, [], true);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $media = $this->entityManager->getRepository(Media::class)->find($id);
        
        if (!$media) {
            return $this->json(['error' => 'Media not found'], Response::HTTP_NOT_FOUND);
        }
        
        $data = $this->serializer->serialize($media, 'json', ['groups' => 'media:read']);
        
        return new JsonResponse($data, Response::HTTP_OK, [], true);
    }

    #[Route('/upload', name: 'upload', methods: ['POST'])]
    #[OA\Post(
        path: '/api/media/upload',
        summary: 'Upload un fichier média',
        description: 'Permet d\'uploader une image, vidéo ou autre fichier. Nécessite le rôle EDITOR ou ADMIN.',
        security: [['bearerAuth' => []]],
        tags: ['Médias']
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\MediaType(
            mediaType: 'multipart/form-data',
            schema: new OA\Schema(
                required: ['file'],
                properties: [
                    new OA\Property(
                        property: 'file',
                        type: 'string',
                        format: 'binary',
                        description: 'Le fichier à uploader'
                    ),
                    new OA\Property(
                        property: 'name',
                        type: 'string',
                        description: 'Nom personnalisé (optionnel)',
                        example: 'Logo Team Vitality'
                    ),
                    new OA\Property(
                        property: 'tags',
                        type: 'string',
                        description: 'Tags séparés par des virgules',
                        example: 'esport,vitality,logo'
                    )
                ]
            )
        )
    )]
    #[OA\Response(
        response: 201,
        description: 'Fichier uploadé avec succès',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'id', type: 'integer', example: 1),
                new OA\Property(property: 'name', type: 'string', example: 'logo-vitality.png'),
                new OA\Property(property: 'url', type: 'string', example: '/uploads/media/logo-vitality.png'),
                new OA\Property(property: 'type', type: 'string', example: 'image'),
                new OA\Property(property: 'size', type: 'integer', example: 45632)
            ]
        )
    )]
    #[OA\Response(response: 400, description: 'Fichier manquant ou invalide')]
    #[OA\Response(response: 401, description: 'Non authentifié')]
    #[OA\Response(response: 403, description: 'Accès refusé')]
    public function upload(Request $request): JsonResponse
    {
        // Vérifier les permissions via le Voter
        $this->denyAccessUnlessGranted('MEDIA_UPLOAD');
        
        /** @var UploadedFile $file */
        $file = $request->files->get('file');
        
        if (!$file) {
            return $this->json(['error' => 'No file uploaded'], Response::HTTP_BAD_REQUEST);
        }
        
        // Récupérer les infos AVANT le move
        $originalName = $file->getClientOriginalName();
        $mimeType = $file->getMimeType();
        $fileSize = $file->getSize();
        
        // Créer le répertoire s'il n'existe pas
        if (!is_dir($this->uploadDirectory)) {
            mkdir($this->uploadDirectory, 0777, true);
        }
        
        // Générer un nom de fichier unique
        $filename = uniqid() . '.' . $file->guessExtension();
        
        // Déplacer le fichier
        try {
            $file->move($this->uploadDirectory, $filename);
        } catch (\Exception $e) {
            return $this->json(['error' => 'File upload failed: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
        
        // Déterminer le type
        $type = 'document';
        if (str_starts_with($mimeType, 'image/')) {
            $type = 'image';
        } elseif (str_starts_with($mimeType, 'video/')) {
            $type = 'video';
        }
        
        $media = new Media();
        $media->setName($request->request->get('name') ?? $originalName);
        $media->setFilename($filename);
        $media->setPath('/uploads/media/' . $filename);
        $media->setMimeType($mimeType);
        $media->setSize($fileSize);
        $media->setType($type);
        $media->setUploadedBy($this->getUser());
        
        // Gérer les tags
        $tags = $request->request->get('tags');
        if ($tags) {
            $media->setTags(is_array($tags) ? $tags : json_decode($tags, true));
        }
        
        $this->entityManager->persist($media);
        $this->entityManager->flush();
        
        return $this->json([
            'message' => 'Media uploaded successfully',
            'id' => $media->getId(),
            'path' => $media->getPath(),
            'url' => 'http://localhost:8000' . $media->getPath()
        ], Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'update', methods: ['PATCH'])]
    public function update(int $id, Request $request): JsonResponse
    {
        $media = $this->entityManager->getRepository(Media::class)->find($id);
        
        if (!$media) {
            return $this->json(['error' => 'Media not found'], Response::HTTP_NOT_FOUND);
        }
        
        // Vérifier les permissions via le Voter
        $this->denyAccessUnlessGranted('MEDIA_DELETE', $media);
        
        $data = json_decode($request->getContent(), true);
        
        if (isset($data['name'])) {
            $media->setName($data['name']);
        }
        
        if (isset($data['tags'])) {
            $media->setTags($data['tags']);
        }
        
        $this->entityManager->flush();
        
        return $this->json(['message' => 'Media updated successfully']);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $media = $this->entityManager->getRepository(Media::class)->find($id);
        
        if (!$media) {
            return $this->json(['error' => 'Media not found'], Response::HTTP_NOT_FOUND);
        }
        
        // Vérifier les permissions via le Voter
        $this->denyAccessUnlessGranted('MEDIA_DELETE', $media);
        
        // Supprimer le fichier physique
        $filePath = $this->uploadDirectory . '/' . $media->getFilename();
        if (file_exists($filePath)) {
            unlink($filePath);
        }
        
        $this->entityManager->remove($media);
        $this->entityManager->flush();
        
        return $this->json(['message' => 'Media deleted successfully']);
    }
}
