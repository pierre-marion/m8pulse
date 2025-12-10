<?php

namespace App\Controller;

use App\Entity\Article;
use App\Entity\Block;
use App\Entity\Media;
use App\Entity\Visualization;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;
use OpenApi\Attributes as OA;

#[Route('/api/blocks', name: 'api_blocks_')]
#[OA\Tag(name: 'Blocs')]
class BlockController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private SerializerInterface $serializer
    ) {}

    #[Route('/article/{articleId}', name: 'list_by_article', methods: ['GET'])]
    public function listByArticle(int $articleId): JsonResponse
    {
        $article = $this->entityManager->getRepository(Article::class)->find($articleId);
        
        if (!$article) {
            return $this->json(['error' => 'Article not found'], Response::HTTP_NOT_FOUND);
        }
        
        $blocks = $article->getBlocks();
        
        $data = $this->serializer->serialize($blocks, 'json', ['groups' => 'block:read']);
        
        return new JsonResponse($data, Response::HTTP_OK, [], true);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $block = $this->entityManager->getRepository(Block::class)->find($id);
        
        if (!$block) {
            return $this->json(['error' => 'Block not found'], Response::HTTP_NOT_FOUND);
        }
        
        $data = $this->serializer->serialize($block, 'json', ['groups' => 'block:read']);
        
        return new JsonResponse($data, Response::HTTP_OK, [], true);
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        // Vérifier la permission via le Voter
        $this->denyAccessUnlessGranted('BLOCK_CREATE');
        
        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['article_id']) || !isset($data['type'])) {
            return $this->json(['error' => 'article_id and type are required'], Response::HTTP_BAD_REQUEST);
        }
        
        $article = $this->entityManager->getRepository(Article::class)->find($data['article_id']);
        
        if (!$article) {
            return $this->json(['error' => 'Article not found'], Response::HTTP_NOT_FOUND);
        }
        
        // Vérifier que l'utilisateur peut éditer cet article
        $this->denyAccessUnlessGranted('ARTICLE_EDIT', $article);
        
        $block = new Block();
        $block->setType($data['type']);
        $block->setContent($data['content'] ?? null);
        $block->setConfig($data['config'] ?? []);
        $block->setPosition($data['position'] ?? 0);
        $block->setArticle($article);
        
        // Gérer les relations
        if (isset($data['media_id'])) {
            $media = $this->entityManager->getRepository(Media::class)->find($data['media_id']);
            if ($media) {
                $block->setMedia($media);
            }
        }
        
        if (isset($data['visualization_id'])) {
            $visualization = $this->entityManager->getRepository(Visualization::class)->find($data['visualization_id']);
            if ($visualization) {
                $block->setVisualization($visualization);
            }
        }
        
        $this->entityManager->persist($block);
        $this->entityManager->flush();
        
        return $this->json([
            'message' => 'Block created successfully',
            'id' => $block->getId()
        ], Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'update', methods: ['PUT', 'PATCH'])]
    public function update(int $id, Request $request): JsonResponse
    {
        $block = $this->entityManager->getRepository(Block::class)->find($id);
        
        if (!$block) {
            return $this->json(['error' => 'Block not found'], Response::HTTP_NOT_FOUND);
        }
        
        // Vérifier les permissions via le Voter
        $this->denyAccessUnlessGranted('BLOCK_EDIT', $block);
        
        $data = json_decode($request->getContent(), true);
        
        if (isset($data['type'])) {
            $block->setType($data['type']);
        }
        
        if (isset($data['content'])) {
            $block->setContent($data['content']);
        }
        
        if (isset($data['config'])) {
            $block->setConfig($data['config']);
        }
        
        if (isset($data['position'])) {
            $block->setPosition($data['position']);
        }
        
        if (isset($data['media_id'])) {
            $media = $this->entityManager->getRepository(Media::class)->find($data['media_id']);
            $block->setMedia($media);
        }
        
        if (isset($data['visualization_id'])) {
            $visualization = $this->entityManager->getRepository(Visualization::class)->find($data['visualization_id']);
            $block->setVisualization($visualization);
        }
        
        $this->entityManager->flush();
        
        return $this->json(['message' => 'Block updated successfully']);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    #[IsGranted('ROLE_AUTHOR')]
    public function delete(int $id): JsonResponse
    {
        $block = $this->entityManager->getRepository(Block::class)->find($id);
        
        if (!$block) {
            return $this->json(['error' => 'Block not found'], Response::HTTP_NOT_FOUND);
        }
        
        // Vérifier les permissions via le Voter
        $this->denyAccessUnlessGranted('BLOCK_DELETE', $block);
        
        $this->entityManager->remove($block);
        $this->entityManager->flush();
        
        return $this->json(['message' => 'Block deleted successfully']);
    }

    #[Route('/reorder', name: 'reorder', methods: ['POST'])]
    public function reorder(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['blocks']) || !is_array($data['blocks'])) {
            return $this->json(['error' => 'Invalid blocks data'], Response::HTTP_BAD_REQUEST);
        }
        
        foreach ($data['blocks'] as $blockData) {
            if (!isset($blockData['id']) || !isset($blockData['position'])) {
                continue;
            }
            
            $block = $this->entityManager->getRepository(Block::class)->find($blockData['id']);
            if ($block) {
                // Vérifier les permissions via le Voter
                $this->denyAccessUnlessGranted('BLOCK_REORDER', $block);
                $block->setPosition($blockData['position']);
            }
        }
        
        $this->entityManager->flush();
        
        return $this->json(['message' => 'Blocks reordered successfully']);
    }
}
