<?php

namespace App\Controller;

use App\Entity\Theme;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/themes', name: 'api_themes_')]
class ThemeController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private SerializerInterface $serializer
    ) {}

    #[Route('', name: 'list', methods: ['GET'])]
    public function list(Request $request): JsonResponse
    {
        $scope = $request->query->get('scope');
        $activeOnly = $request->query->get('active_only', false);
        
        $criteria = [];
        
        if ($scope) {
            $criteria['scope'] = $scope;
        }
        
        if ($activeOnly) {
            $criteria['isActive'] = true;
        }
        
        $themes = $this->entityManager->getRepository(Theme::class)->findBy(
            $criteria,
            ['createdAt' => 'DESC']
        );
        
        $data = $this->serializer->serialize($themes, 'json', ['groups' => 'theme:read']);
        
        return new JsonResponse($data, Response::HTTP_OK, [], true);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $theme = $this->entityManager->getRepository(Theme::class)->find($id);
        
        if (!$theme) {
            return $this->json(['error' => 'Theme not found'], Response::HTTP_NOT_FOUND);
        }
        
        $data = $this->serializer->serialize($theme, 'json', ['groups' => 'theme:read']);
        
        return new JsonResponse($data, Response::HTTP_OK, [], true);
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        // Vérifier les permissions via le Voter
        $this->denyAccessUnlessGranted('THEME_CREATE');
        
        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['name']) || !isset($data['styles'])) {
            return $this->json(['error' => 'name and styles are required'], Response::HTTP_BAD_REQUEST);
        }
        
        $theme = new Theme();
        $theme->setName($data['name']);
        $theme->setDescription($data['description'] ?? null);
        $theme->setStyles($data['styles']);
        $theme->setScope($data['scope'] ?? 'global');
        $theme->setIsDefault($data['is_default'] ?? false);
        $theme->setIsActive($data['is_active'] ?? true);
        $theme->setCreatedBy($this->getUser());
        
        // Si c'est le nouveau thème par défaut, désactiver les autres thèmes par défaut
        if ($theme->isDefault()) {
            $this->resetDefaultThemes($theme->getScope());
        }
        
        $this->entityManager->persist($theme);
        $this->entityManager->flush();
        
        return $this->json([
            'message' => 'Theme created successfully',
            'id' => $theme->getId()
        ], Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'update', methods: ['PUT', 'PATCH'])]
    public function update(int $id, Request $request): JsonResponse
    {
        $theme = $this->entityManager->getRepository(Theme::class)->find($id);
        
        if (!$theme) {
            return $this->json(['error' => 'Theme not found'], Response::HTTP_NOT_FOUND);
        }
        
        // Vérifier les permissions via le Voter
        $this->denyAccessUnlessGranted('THEME_EDIT', $theme);
        
        $data = json_decode($request->getContent(), true);
        
        if (isset($data['name'])) {
            $theme->setName($data['name']);
        }
        
        if (isset($data['description'])) {
            $theme->setDescription($data['description']);
        }
        
        if (isset($data['styles'])) {
            $theme->setStyles($data['styles']);
        }
        
        if (isset($data['scope'])) {
            $theme->setScope($data['scope']);
        }
        
        if (isset($data['is_active'])) {
            $theme->setIsActive($data['is_active']);
        }
        
        if (isset($data['is_default']) && $data['is_default']) {
            $this->resetDefaultThemes($theme->getScope());
            $theme->setIsDefault(true);
        } elseif (isset($data['is_default']) && !$data['is_default']) {
            $theme->setIsDefault(false);
        }
        
        $this->entityManager->flush();
        
        return $this->json(['message' => 'Theme updated successfully']);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $theme = $this->entityManager->getRepository(Theme::class)->find($id);
        
        if (!$theme) {
            return $this->json(['error' => 'Theme not found'], Response::HTTP_NOT_FOUND);
        }
        
        // Vérifier les permissions via le Voter
        $this->denyAccessUnlessGranted('THEME_DELETE', $theme);
        
        if ($theme->isDefault()) {
            return $this->json(['error' => 'Cannot delete default theme'], Response::HTTP_BAD_REQUEST);
        }
        
        $this->entityManager->remove($theme);
        $this->entityManager->flush();
        
        return $this->json(['message' => 'Theme deleted successfully']);
    }

    #[Route('/{id}/activate', name: 'activate', methods: ['POST'])]
    public function activate(int $id): JsonResponse
    {
        $theme = $this->entityManager->getRepository(Theme::class)->find($id);
        
        if (!$theme) {
            return $this->json(['error' => 'Theme not found'], Response::HTTP_NOT_FOUND);
        }
        
        // Vérifier les permissions via le Voter
        $this->denyAccessUnlessGranted('THEME_ACTIVATE', $theme);
        
        $theme->setIsActive(true);
        $this->entityManager->flush();
        
        return $this->json(['message' => 'Theme activated successfully']);
    }

    #[Route('/{id}/set-default', name: 'set_default', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    public function setDefault(int $id): JsonResponse
    {
        $theme = $this->entityManager->getRepository(Theme::class)->find($id);
        
        if (!$theme) {
            return $this->json(['error' => 'Theme not found'], Response::HTTP_NOT_FOUND);
        }
        
        $this->resetDefaultThemes($theme->getScope());
        $theme->setIsDefault(true);
        $theme->setIsActive(true);
        
        $this->entityManager->flush();
        
        return $this->json(['message' => 'Default theme set successfully']);
    }

    #[Route('/default/{scope}', name: 'get_default', methods: ['GET'])]
    public function getDefault(string $scope = 'global'): JsonResponse
    {
        $theme = $this->entityManager->getRepository(Theme::class)->findOneBy([
            'scope' => $scope,
            'isDefault' => true,
            'isActive' => true
        ]);
        
        if (!$theme) {
            return $this->json(['error' => 'No default theme found'], Response::HTTP_NOT_FOUND);
        }
        
        $data = $this->serializer->serialize($theme, 'json', ['groups' => 'theme:read']);
        
        return new JsonResponse($data, Response::HTTP_OK, [], true);
    }

    /**
     * Désactive le flag "isDefault" pour tous les thèmes d'un scope donné
     */
    private function resetDefaultThemes(string $scope): void
    {
        $themes = $this->entityManager->getRepository(Theme::class)->findBy([
            'scope' => $scope,
            'isDefault' => true
        ]);
        
        foreach ($themes as $theme) {
            $theme->setIsDefault(false);
        }
    }
}
