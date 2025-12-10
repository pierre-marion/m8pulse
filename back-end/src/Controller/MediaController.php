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
#[OA\Tag(name: 'Media')]
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
    public function upload(Request $request): JsonResponse
    {
        // Vérifier les permissions via le Voter
        $this->denyAccessUnlessGranted('MEDIA_UPLOAD');
        
        /** @var UploadedFile $file */
        $file = $request->files->get('file');
        
        if (!$file) {
            return $this->json(['error' => 'No file uploaded'], Response::HTTP_BAD_REQUEST);
        }
        
        // Créer le répertoire s'il n'existe pas
        if (!is_dir($this->uploadDirectory)) {
            mkdir($this->uploadDirectory, 0777, true);
        }
        
        // Générer un nom de fichier unique
        $filename = uniqid() . '.' . $file->guessExtension();
        
        // Déplacer le fichier
        $file->move($this->uploadDirectory, $filename);
        
        // Déterminer le type
        $mimeType = $file->getMimeType();
        $type = 'document';
        if (str_starts_with($mimeType, 'image/')) {
            $type = 'image';
        } elseif (str_starts_with($mimeType, 'video/')) {
            $type = 'video';
        }
        
        $media = new Media();
        $media->setName($request->request->get('name') ?? $file->getClientOriginalName());
        $media->setFilename($filename);
        $media->setPath('/uploads/media/' . $filename);
        $media->setMimeType($mimeType);
        $media->setSize($file->getSize());
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
            'path' => $media->getPath()
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
