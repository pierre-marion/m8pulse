<?php

namespace App\Controller;

use App\Entity\Article;
use App\Entity\Comment;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use OpenApi\Attributes as OA;

#[Route('/api/comments', name: 'api_comments_')]
#[OA\Tag(name: 'Comments')]
class CommentController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private SerializerInterface $serializer
    ) {}

    #[Route('/article/{articleId}', name: 'list', methods: ['GET'])]
    #[OA\Get(
        path: '/api/comments/article/{articleId}',
        summary: 'Récupérer tous les commentaires d\'un article',
        parameters: [
            new OA\Parameter(name: 'articleId', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))
        ],
        responses: [
            new OA\Response(response: 200, description: 'Liste des commentaires'),
            new OA\Response(response: 404, description: 'Article non trouvé')
        ]
    )]
    public function list(int $articleId): JsonResponse
    {
        $article = $this->entityManager->getRepository(Article::class)->find($articleId);
        
        if (!$article) {
            return $this->json(['error' => 'Article not found'], Response::HTTP_NOT_FOUND);
        }

        $comments = $this->entityManager->getRepository(Comment::class)
            ->createQueryBuilder('c')
            ->where('c.article = :article')
            ->setParameter('article', $article)
            ->orderBy('c.createdAt', 'DESC')
            ->getQuery()
            ->getResult();

        $data = $this->serializer->serialize($comments, 'json', ['groups' => 'comment:read']);
        
        return new JsonResponse($data, Response::HTTP_OK, [], true);
    }

    #[Route('', name: 'create', methods: ['POST'])]
    #[OA\Post(
        path: '/api/comments',
        summary: 'Créer un nouveau commentaire',
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['articleId', 'content'],
                properties: [
                    new OA\Property(property: 'articleId', type: 'integer'),
                    new OA\Property(property: 'content', type: 'string')
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: 'Commentaire créé'),
            new OA\Response(response: 400, description: 'Données invalides'),
            new OA\Response(response: 401, description: 'Non authentifié')
        ]
    )]
    public function create(Request $request): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['error' => 'Vous devez être connecté pour commenter'], Response::HTTP_UNAUTHORIZED);
        }

        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['articleId']) || !isset($data['content'])) {
            return $this->json(['error' => 'articleId et content sont requis'], Response::HTTP_BAD_REQUEST);
        }

        $article = $this->entityManager->getRepository(Article::class)->find($data['articleId']);
        
        if (!$article) {
            return $this->json(['error' => 'Article not found'], Response::HTTP_NOT_FOUND);
        }

        $comment = new Comment();
        $comment->setArticle($article);
        $comment->setAuthor($user);
        $comment->setContent($data['content']);

        $this->entityManager->persist($comment);
        $this->entityManager->flush();

        $responseData = $this->serializer->serialize($comment, 'json', ['groups' => 'comment:read']);
        
        return new JsonResponse($responseData, Response::HTTP_CREATED, [], true);
    }

    #[Route('/{id}', name: 'update', methods: ['PUT'])]
    #[OA\Put(
        path: '/api/comments/{id}',
        summary: 'Modifier un commentaire',
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['content'],
                properties: [
                    new OA\Property(property: 'content', type: 'string')
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Commentaire modifié'),
            new OA\Response(response: 403, description: 'Non autorisé'),
            new OA\Response(response: 404, description: 'Commentaire non trouvé')
        ]
    )]
    public function update(int $id, Request $request): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['error' => 'Non authentifié'], Response::HTTP_UNAUTHORIZED);
        }

        $comment = $this->entityManager->getRepository(Comment::class)->find($id);
        
        if (!$comment) {
            return $this->json(['error' => 'Comment not found'], Response::HTTP_NOT_FOUND);
        }

        // Vérifier que l'utilisateur est l'auteur ou admin
        if ($comment->getAuthor()->getId() !== $user->getId() && !in_array('ROLE_ADMIN', $user->getRoles())) {
            return $this->json(['error' => 'Vous ne pouvez modifier que vos propres commentaires'], Response::HTTP_FORBIDDEN);
        }

        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['content'])) {
            return $this->json(['error' => 'content est requis'], Response::HTTP_BAD_REQUEST);
        }

        $comment->setContent($data['content']);
        $this->entityManager->flush();

        $responseData = $this->serializer->serialize($comment, 'json', ['groups' => 'comment:read']);
        
        return new JsonResponse($responseData, Response::HTTP_OK, [], true);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    #[OA\Delete(
        path: '/api/comments/{id}',
        summary: 'Supprimer un commentaire',
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))
        ],
        responses: [
            new OA\Response(response: 204, description: 'Commentaire supprimé'),
            new OA\Response(response: 403, description: 'Non autorisé'),
            new OA\Response(response: 404, description: 'Commentaire non trouvé')
        ]
    )]
    public function delete(int $id): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['error' => 'Non authentifié'], Response::HTTP_UNAUTHORIZED);
        }

        $comment = $this->entityManager->getRepository(Comment::class)->find($id);
        
        if (!$comment) {
            return $this->json(['error' => 'Comment not found'], Response::HTTP_NOT_FOUND);
        }

        // Vérifier que l'utilisateur est l'auteur ou admin
        if ($comment->getAuthor()->getId() !== $user->getId() && !in_array('ROLE_ADMIN', $user->getRoles())) {
            return $this->json(['error' => 'Vous ne pouvez supprimer que vos propres commentaires'], Response::HTTP_FORBIDDEN);
        }

        $this->entityManager->remove($comment);
        $this->entityManager->flush();

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }
}
