<?php

namespace App\Controller;

use App\Entity\Article;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;
use OpenApi\Attributes as OA;

#[Route('/api/articles', name: 'api_articles_')]
#[OA\Tag(name: 'Articles')]
class ArticleController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private SerializerInterface $serializer
    ) {}

    #[Route('', name: 'list', methods: ['GET'])]
    #[OA\Get(
        path: '/api/articles',
        summary: 'Liste tous les articles',
        description: 'Récupère la liste des articles avec filtres optionnels (type, statut, auteur, recherche). Les visiteurs ne voient que les articles publiés.',
        tags: ['Articles']
    )]
    #[OA\Parameter(
        name: 'type',
        in: 'query',
        description: 'Filtrer par type d\'article',
        required: false,
        schema: new OA\Schema(type: 'string', example: 'blog')
    )]
    #[OA\Parameter(
        name: 'status',
        in: 'query',
        description: 'Filtrer par statut (published, draft)',
        required: false,
        schema: new OA\Schema(type: 'string', example: 'published')
    )]
    #[OA\Parameter(
        name: 'author',
        in: 'query',
        description: 'Filtrer par ID de l\'auteur',
        required: false,
        schema: new OA\Schema(type: 'integer', example: 1)
    )]
    #[OA\Parameter(
        name: 'search',
        in: 'query',
        description: 'Recherche dans le titre et le résumé',
        required: false,
        schema: new OA\Schema(type: 'string', example: 'esport')
    )]
    #[OA\Parameter(
        name: 'limit',
        in: 'query',
        description: 'Nombre d\'articles à retourner',
        required: false,
        schema: new OA\Schema(type: 'integer', example: 10)
    )]
    #[OA\Parameter(
        name: 'offset',
        in: 'query',
        description: 'Décalage pour la pagination',
        required: false,
        schema: new OA\Schema(type: 'integer', example: 0)
    )]
    #[OA\Response(
        response: 200,
        description: 'Liste des articles',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(
                properties: [
                    new OA\Property(property: 'id', type: 'integer', example: 1),
                    new OA\Property(property: 'title', type: 'string', example: 'Analyse du match Vitality vs NAVI'),
                    new OA\Property(property: 'summary', type: 'string', example: 'Retour sur la performance...'),
                    new OA\Property(property: 'status', type: 'string', example: 'published'),
                    new OA\Property(property: 'viewCount', type: 'integer', example: 342)
                ]
            )
        )
    )]
    public function list(Request $request): JsonResponse
    {
        $type = $request->query->get('type');
        $status = $request->query->get('status', 'published');
        $author = $request->query->get('author');
        $search = $request->query->get('search');
        $limit = $request->query->get('limit', 10);
        $offset = $request->query->get('offset', 0);
        
        $qb = $this->entityManager->getRepository(Article::class)->createQueryBuilder('a');
        
        // Les visiteurs ne voient que les articles publiés
        $user = $this->getUser();
        if (!$user || !in_array('ROLE_EDITOR', $user->getRoles()) && !in_array('ROLE_ADMIN', $user->getRoles())) {
            $qb->where('a.status = :status')
               ->setParameter('status', 'published');
        } elseif ($status) {
            $qb->where('a.status = :status')
               ->setParameter('status', $status);
        }
        
        if ($type) {
            $qb->andWhere('a.type = :type')
               ->setParameter('type', $type);
        }
        
        if ($author) {
            $qb->andWhere('a.author = :author')
               ->setParameter('author', $author);
        }
        
        if ($search) {
            $qb->andWhere('a.title LIKE :search OR a.summary LIKE :search')
               ->setParameter('search', '%' . $search . '%');
        }
        
        $qb->orderBy('a.publishedAt', 'DESC')
           ->setMaxResults($limit)
           ->setFirstResult($offset);
        
        $articles = $qb->getQuery()->getResult();
        
        $data = $this->serializer->serialize($articles, 'json', ['groups' => 'article:read']);
        
        return new JsonResponse($data, Response::HTTP_OK, [], true);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    #[OA\Get(
        path: '/api/articles/{id}',
        summary: 'Affiche un article spécifique',
        description: 'Récupère les détails complets d\'un article et incrémente automatiquement le compteur de vues',
        tags: ['Articles']
    )]
    #[OA\Parameter(
        name: 'id',
        in: 'path',
        description: 'ID de l\'article',
        required: true,
        schema: new OA\Schema(type: 'integer')
    )]
    #[OA\Response(
        response: 200,
        description: 'Détails de l\'article',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'id', type: 'integer', example: 1),
                new OA\Property(property: 'title', type: 'string', example: 'Mon article'),
                new OA\Property(property: 'content', type: 'string'),
                new OA\Property(property: 'viewCount', type: 'integer', example: 343),
                new OA\Property(property: 'blocks', type: 'array', items: new OA\Items(type: 'object'))
            ]
        )
    )]
    #[OA\Response(response: 404, description: 'Article non trouvé')]
    public function show(int $id): JsonResponse
    {
        $article = $this->entityManager->getRepository(Article::class)->find($id);
        
        if (!$article) {
            return $this->json(['error' => 'Article not found'], Response::HTTP_NOT_FOUND);
        }
        
        // Incrémenter le compteur de vues
        $article->incrementViewCount();
        $this->entityManager->flush();
        
        $data = $this->serializer->serialize($article, 'json', ['groups' => 'article:read']);
        
        return new JsonResponse($data, Response::HTTP_OK, [], true);
    }

    #[Route('', name: 'create', methods: ['POST'])]
    #[OA\Post(
        path: '/api/articles',
        summary: 'Crée un nouvel article',
        description: 'Permet de créer un article. Nécessite le rôle EDITOR ou ADMIN. L\'article est en brouillon par défaut.',
        security: [['bearerAuth' => []]],
        tags: ['Articles']
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['title'],
            properties: [
                new OA\Property(property: 'title', type: 'string', example: 'Nouveau match analysis'),
                new OA\Property(property: 'summary', type: 'string', example: 'Résumé de l\'article'),
                new OA\Property(property: 'content', type: 'string', example: 'Contenu complet...'),
                new OA\Property(property: 'type', type: 'string', example: 'blog'),
                new OA\Property(property: 'coverImage', type: 'string', example: 'https://...'),
                new OA\Property(property: 'tags', type: 'array', items: new OA\Items(type: 'string'))
            ]
        )
    )]
    #[OA\Response(
        response: 201,
        description: 'Article créé avec succès',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'id', type: 'integer', example: 42),
                new OA\Property(property: 'title', type: 'string'),
                new OA\Property(property: 'status', type: 'string', example: 'draft')
            ]
        )
    )]
    #[OA\Response(response: 401, description: 'Non authentifié')]
    #[OA\Response(response: 403, description: 'Accès refusé')]
    public function create(Request $request): JsonResponse
    {
        // DEBUG: Vérifier si le token arrive
        $authHeader = $request->headers->get('Authorization');
        error_log('🔑 Authorization header: ' . ($authHeader ?? 'NULL'));
        error_log('👤 User: ' . ($this->getUser() ? get_class($this->getUser()) : 'NULL'));
        
        // Vérifier la permission via le Voter
        $this->denyAccessUnlessGranted('ARTICLE_CREATE');
        
        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['title'])) {
            return $this->json(['error' => 'Title is required'], Response::HTTP_BAD_REQUEST);
        }
        
        $article = new Article();
        $article->setTitle($data['title']);
        $article->setSummary($data['summary'] ?? null);
        $article->setType($data['type'] ?? 'standard');
        $article->setGame($data['game'] ?? 'general');
        $article->setStatus($data['status'] ?? 'draft');
        $article->setAuthor($this->getUser());
        
        // Sauvegarder les blocs en JSON
        if (isset($data['blocks']) && is_array($data['blocks'])) {
            $article->setBlocks($data['blocks']);
        }
        
        $this->entityManager->persist($article);
        $this->entityManager->flush();
        
        return $this->json([
            'message' => 'Article created successfully',
            'id' => $article->getId()
        ], Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'update', methods: ['PUT', 'PATCH'])]
    public function update(int $id, Request $request): JsonResponse
    {
        $article = $this->entityManager->getRepository(Article::class)->find($id);
        
        if (!$article) {
            return $this->json(['error' => 'Article not found'], Response::HTTP_NOT_FOUND);
        }
        
        // Vérifier les permissions via le Voter
        $this->denyAccessUnlessGranted('ARTICLE_EDIT', $article);
        
        $data = json_decode($request->getContent(), true);
        
        if (isset($data['title'])) {
            $article->setTitle($data['title']);
        }
        
        if (isset($data['summary'])) {
            $article->setSummary($data['summary']);
        }
        
        if (isset($data['type'])) {
            $article->setType($data['type']);
        }
        
        // Mettre à jour les blocs si présents
        if (isset($data['blocks']) && is_array($data['blocks'])) {
            $article->setBlocks($data['blocks']);
        }
        
        // Seuls les éditeurs et admins peuvent changer le statut
        if (isset($data['status']) && ($this->isGranted('ROLE_EDITOR') || $this->isGranted('ROLE_ADMIN'))) {
            $article->setStatus($data['status']);
        }
        
        $this->entityManager->flush();
        
        return $this->json(['message' => 'Article updated successfully']);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    #[IsGranted('ROLE_AUTHOR')]
    public function delete(int $id): JsonResponse
    {
        $article = $this->entityManager->getRepository(Article::class)->find($id);
        
        if (!$article) {
            return $this->json(['error' => 'Article not found'], Response::HTTP_NOT_FOUND);
        }
        
        // Vérifier les permissions via le Voter
        $this->denyAccessUnlessGranted('ARTICLE_DELETE', $article);
        
        $this->entityManager->remove($article);
        $this->entityManager->flush();
        
        return $this->json(['message' => 'Article deleted successfully']);
    }

    #[Route('/{id}/publish', name: 'publish', methods: ['POST'])]
    public function publish(int $id): JsonResponse
    {
        $article = $this->entityManager->getRepository(Article::class)->find($id);
        
        if (!$article) {
            return $this->json(['error' => 'Article not found'], Response::HTTP_NOT_FOUND);
        }
        
        // Vérifier les permissions via le Voter
        $this->denyAccessUnlessGranted('ARTICLE_PUBLISH', $article);
        
        $article->setStatus('published');
        $article->setPublishedAt(new \DateTime());
        
        $this->entityManager->flush();
        
        return $this->json(['message' => 'Article published successfully']);
    }

    #[Route('/stats', name: 'stats', methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN')]
    public function stats(): JsonResponse
    {
        $qb = $this->entityManager->getRepository(Article::class)->createQueryBuilder('a');
        
        $totalArticles = $qb->select('COUNT(a.id)')->getQuery()->getSingleScalarResult();
        
        $publishedCount = $qb->resetDQLParts()
            ->select('COUNT(a.id)')
            ->where('a.status = :status')
            ->setParameter('status', 'published')
            ->getQuery()
            ->getSingleScalarResult();
        
        $draftCount = $qb->resetDQLParts()
            ->select('COUNT(a.id)')
            ->where('a.status = :status')
            ->setParameter('status', 'draft')
            ->getQuery()
            ->getSingleScalarResult();
        
        $totalViews = $qb->resetDQLParts()
            ->select('SUM(a.viewCount)')
            ->getQuery()
            ->getSingleScalarResult();
        
        return $this->json([
            'total_articles' => $totalArticles,
            'published_count' => $publishedCount,
            'draft_count' => $draftCount,
            'total_views' => $totalViews ?? 0
        ]);
    }
}
