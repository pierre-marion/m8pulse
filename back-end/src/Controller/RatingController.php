<?php

namespace App\Controller;

use App\Entity\Rating;
use App\Entity\Article;
use App\Entity\Block;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;
use OpenApi\Attributes as OA;

#[Route('/api/ratings', name: 'api_ratings_')]
#[OA\Tag(name: 'Notations')]
class RatingController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private SerializerInterface $serializer
    ) {}

    #[Route('/article/{articleId}', name: 'article_ratings', methods: ['GET'])]
    public function getArticleRatings(int $articleId): JsonResponse
    {
        $article = $this->entityManager->getRepository(Article::class)->find($articleId);
        
        if (!$article) {
            return $this->json(['error' => 'Article not found'], Response::HTTP_NOT_FOUND);
        }
        
        $ratings = $article->getRatings();
        
        $data = $this->serializer->serialize($ratings, 'json', ['groups' => 'rating:read']);
        
        return new JsonResponse($data, Response::HTTP_OK, [], true);
    }

    #[Route('/block/{blockId}', name: 'block_ratings', methods: ['GET'])]
    public function getBlockRatings(int $blockId): JsonResponse
    {
        $block = $this->entityManager->getRepository(Block::class)->find($blockId);
        
        if (!$block) {
            return $this->json(['error' => 'Block not found'], Response::HTTP_NOT_FOUND);
        }
        
        $ratings = $block->getRatings();
        
        $data = $this->serializer->serialize($ratings, 'json', ['groups' => 'rating:read']);
        
        return new JsonResponse($data, Response::HTTP_OK, [], true);
    }

    #[Route('/article/{articleId}', name: 'rate_article', methods: ['POST'])]
    #[IsGranted('ROLE_SUBSCRIBER')]
    public function rateArticle(int $articleId, Request $request): JsonResponse
    {
        $article = $this->entityManager->getRepository(Article::class)->find($articleId);
        
        if (!$article) {
            return $this->json(['error' => 'Article not found'], Response::HTTP_NOT_FOUND);
        }
        
        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['stars']) || $data['stars'] < 0 || $data['stars'] > 5) {
            return $this->json(['error' => 'Stars must be between 0 and 5'], Response::HTTP_BAD_REQUEST);
        }
        
        // Vérifier si l'utilisateur a déjà noté cet article
        $existingRating = $this->entityManager->getRepository(Rating::class)->findOneBy([
            'user' => $this->getUser(),
            'article' => $article
        ]);
        
        if ($existingRating) {
            // Mettre à jour la note existante
            $existingRating->setStars($data['stars']);
            if (isset($data['comment'])) {
                $existingRating->setComment($data['comment']);
            }
            $rating = $existingRating;
        } else {
            // Créer une nouvelle note
            $rating = new Rating();
            $rating->setStars($data['stars']);
            $rating->setComment($data['comment'] ?? null);
            $rating->setUser($this->getUser());
            $rating->setArticle($article);
            
            $this->entityManager->persist($rating);
        }
        
        $this->entityManager->flush();
        
        return $this->json([
            'message' => 'Rating saved successfully',
            'id' => $rating->getId(),
            'average_rating' => $article->getAverageRating()
        ], $existingRating ? Response::HTTP_OK : Response::HTTP_CREATED);
    }

    #[Route('/block/{blockId}', name: 'rate_block', methods: ['POST'])]
    #[IsGranted('ROLE_SUBSCRIBER')]
    public function rateBlock(int $blockId, Request $request): JsonResponse
    {
        $block = $this->entityManager->getRepository(Block::class)->find($blockId);
        
        if (!$block) {
            return $this->json(['error' => 'Block not found'], Response::HTTP_NOT_FOUND);
        }
        
        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['stars']) || $data['stars'] < 0 || $data['stars'] > 5) {
            return $this->json(['error' => 'Stars must be between 0 and 5'], Response::HTTP_BAD_REQUEST);
        }
        
        // Vérifier si l'utilisateur a déjà noté ce bloc
        $existingRating = $this->entityManager->getRepository(Rating::class)->findOneBy([
            'user' => $this->getUser(),
            'block' => $block
        ]);
        
        if ($existingRating) {
            // Mettre à jour la note existante
            $existingRating->setStars($data['stars']);
            if (isset($data['comment'])) {
                $existingRating->setComment($data['comment']);
            }
            $rating = $existingRating;
        } else {
            // Créer une nouvelle note
            $rating = new Rating();
            $rating->setStars($data['stars']);
            $rating->setComment($data['comment'] ?? null);
            $rating->setUser($this->getUser());
            $rating->setBlock($block);
            
            $this->entityManager->persist($rating);
        }
        
        $this->entityManager->flush();
        
        return $this->json([
            'message' => 'Rating saved successfully',
            'id' => $rating->getId(),
            'average_rating' => $block->getAverageRating()
        ], $existingRating ? Response::HTTP_OK : Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    #[IsGranted('ROLE_SUBSCRIBER')]
    public function delete(int $id): JsonResponse
    {
        $rating = $this->entityManager->getRepository(Rating::class)->find($id);
        
        if (!$rating) {
            return $this->json(['error' => 'Rating not found'], Response::HTTP_NOT_FOUND);
        }
        
        // Vérifier que l'utilisateur est bien l'auteur de la note ou un admin
        if ($rating->getUser()->getId() !== $this->getUser()->getId() && !$this->isGranted('ROLE_ADMIN')) {
            return $this->json(['error' => 'Access denied'], Response::HTTP_FORBIDDEN);
        }
        
        $this->entityManager->remove($rating);
        $this->entityManager->flush();
        
        return $this->json(['message' => 'Rating deleted successfully']);
    }

    #[Route('/user/me', name: 'my_ratings', methods: ['GET'])]
    #[IsGranted('ROLE_SUBSCRIBER')]
    public function myRatings(): JsonResponse
    {
        $ratings = $this->entityManager->getRepository(Rating::class)->findBy([
            'user' => $this->getUser()
        ], ['createdAt' => 'DESC']);
        
        $data = $this->serializer->serialize($ratings, 'json', ['groups' => 'rating:read']);
        
        return new JsonResponse($data, Response::HTTP_OK, [], true);
    }
}
