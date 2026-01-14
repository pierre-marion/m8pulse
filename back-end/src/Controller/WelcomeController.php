<?php

namespace App\Controller;

use App\Entity\WelcomeConfig;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;
use OpenApi\Attributes as OA;

#[Route('/api/welcome', name: 'api_welcome_')]
#[OA\Tag(name: "Page d'accueil")]
class WelcomeController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private SerializerInterface $serializer
    ) {}

    #[Route('', name: 'get', methods: ['GET'])]
    #[OA\Get(
        path: '/api/welcome',
        summary: 'Récupère la configuration de la page d\'accueil',
        description: 'Retourne la configuration active de la page d\'accueil incluant le texte de bienvenue et la configuration de visualisation 3D',
        tags: ['Page d\'accueil']
    )]
    #[OA\Response(
        response: 200,
        description: 'Configuration récupérée avec succès',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'id', type: 'integer', example: 1),
                new OA\Property(property: 'welcome_text', type: 'string', example: 'Bienvenue sur M8Pulse - Plateforme de Data Storytelling'),
                new OA\Property(property: 'visualization_config', type: 'object', example: ['type' => 'threejs', 'scene' => 'particles']),
                new OA\Property(property: 'is_active', type: 'boolean', example: true)
            ]
        )
    )]
    public function get(): JsonResponse
    {
        // Récupérer la config active
        $config = $this->entityManager->getRepository(WelcomeConfig::class)->findOneBy([
            'isActive' => true
        ]);
        
        if (!$config) {
            // Créer une config par défaut si aucune n'existe
            $config = new WelcomeConfig();
            $config->setWelcomeText('Bienvenue sur M8Pulse - Plateforme de Data Storytelling');
            $config->setVisualizationConfig([
                'type' => 'threejs',
                'scene' => 'particles',
                'camera' => ['position' => ['x' => 0, 'y' => 0, 'z' => 5]],
                'animation' => ['speed' => 1.0, 'particles' => 1000],
                'colors' => ['primary' => '#4F46E5', 'secondary' => '#06B6D4']
            ]);
            $config->setIsActive(true);
            
            $this->entityManager->persist($config);
            $this->entityManager->flush();
        }
        
        $data = $this->serializer->serialize($config, 'json', ['groups' => 'welcome:read']);
        
        return new JsonResponse($data, Response::HTTP_OK, [], true);
    }

    #[Route('', name: 'update', methods: ['PUT', 'PATCH'])]
    #[IsGranted('ROLE_ADMIN')]
    #[OA\Put(
        path: '/api/welcome',
        summary: 'Met à jour la configuration de la page d\'accueil',
        description: 'Permet de modifier le texte de bienvenue et la configuration de visualisation. Réservé aux administrateurs.',
        security: [['bearerAuth' => []]],
        tags: ['Page d\'accueil']
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'welcome_text', type: 'string', example: 'Nouveau texte de bienvenue'),
                new OA\Property(
                    property: 'visualization_config',
                    type: 'object',
                    example: ['type' => 'threejs', 'scene' => 'particles', 'colors' => ['primary' => '#4F46E5']]
                ),
                new OA\Property(property: 'is_active', type: 'boolean', example: true)
            ]
        )
    )]
    #[OA\Response(
        response: 200,
        description: 'Configuration mise à jour avec succès',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'message', type: 'string', example: 'Welcome configuration updated successfully')
            ]
        )
    )]
    #[OA\Response(response: 401, description: 'Non authentifié')]
    #[OA\Response(response: 403, description: 'Accès refusé - Admin requis')]
    public function update(Request $request): JsonResponse
    {
        $config = $this->entityManager->getRepository(WelcomeConfig::class)->findOneBy([
            'isActive' => true
        ]);
        
        if (!$config) {
            $config = new WelcomeConfig();
            $config->setIsActive(true);
            $this->entityManager->persist($config);
        }
        
        $data = json_decode($request->getContent(), true);
        
        if (isset($data['welcome_text'])) {
            $config->setWelcomeText($data['welcome_text']);
        }
        
        if (isset($data['visualization_config'])) {
            $config->setVisualizationConfig($data['visualization_config']);
        }
        
        if (isset($data['is_active'])) {
            $config->setIsActive($data['is_active']);
        }
        
        $this->entityManager->flush();
        
        return $this->json(['message' => 'Welcome configuration updated successfully']);
    }

    #[Route('/preview', name: 'preview', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    #[OA\Post(
        path: '/api/welcome/preview',
        summary: 'Prévisualise une configuration sans la sauvegarder',
        description: 'Permet de tester une configuration de page d\'accueil avant de la sauvegarder définitivement',
        security: [['bearerAuth' => []]],
        tags: ['Page d\'accueil']
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'welcome_text', type: 'string', example: 'Test de texte'),
                new OA\Property(property: 'visualization_config', type: 'object', example: ['type' => 'threejs'])
            ]
        )
    )]
    #[OA\Response(
        response: 200,
        description: 'Prévisualisation générée',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'welcome_text', type: 'string'),
                new OA\Property(property: 'visualization_config', type: 'object')
            ]
        )
    )]
    public function preview(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        // Retourner simplement les données pour prévisualisation
        // Sans les sauvegarder
        return $this->json([
            'welcome_text' => $data['welcome_text'] ?? '',
            'visualization_config' => $data['visualization_config'] ?? []
        ]);
    }

    #[Route('/templates', name: 'templates', methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN')]
    #[OA\Get(
        path: '/api/welcome/templates',
        summary: 'Liste les templates de visualisation disponibles',
        description: 'Retourne une liste de templates préconfigurés pour les visualisations 3D (Particles, Waves, VR, Globe)',
        security: [['bearerAuth' => []]],
        tags: ['Page d\'accueil']
    )]
    #[OA\Response(
        response: 200,
        description: 'Liste des templates',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(
                    property: 'templates',
                    type: 'array',
                    items: new OA\Items(
                        properties: [
                            new OA\Property(property: 'id', type: 'string', example: 'particles'),
                            new OA\Property(property: 'name', type: 'string', example: 'Particles 3D'),
                            new OA\Property(property: 'config', type: 'object')
                        ]
                    )
                )
            ]
        )
    )]
    public function templates(): JsonResponse
    {
        return $this->json([
            'templates' => [
                [
                    'id' => 'particles',
                    'name' => 'Particles 3D',
                    'config' => [
                        'type' => 'threejs',
                        'scene' => 'particles',
                        'camera' => ['position' => ['x' => 0, 'y' => 0, 'z' => 5]],
                        'animation' => ['speed' => 1.0, 'particles' => 1000],
                        'colors' => ['primary' => '#4F46E5', 'secondary' => '#06B6D4']
                    ]
                ],
                [
                    'id' => 'waves',
                    'name' => 'Waves Animation',
                    'config' => [
                        'type' => 'threejs',
                        'scene' => 'waves',
                        'camera' => ['position' => ['x' => 0, 'y' => 2, 'z' => 5]],
                        'animation' => ['speed' => 0.5, 'amplitude' => 1.5],
                        'colors' => ['primary' => '#10B981', 'secondary' => '#3B82F6']
                    ]
                ],
                [
                    'id' => 'vr',
                    'name' => 'VR Environment (A-Frame)',
                    'config' => [
                        'type' => 'aframe',
                        'scene' => 'vr-environment',
                        'environment' => ['preset' => 'forest'],
                        'objects' => [
                            ['type' => 'box', 'position' => '0 1 -3', 'color' => '#4CC3D9'],
                            ['type' => 'sphere', 'position' => '2 1.5 -4', 'color' => '#EF2D5E']
                        ]
                    ]
                ],
                [
                    'id' => 'data-globe',
                    'name' => 'Data Globe',
                    'config' => [
                        'type' => 'threejs',
                        'scene' => 'globe',
                        'camera' => ['position' => ['x' => 0, 'y' => 0, 'z' => 10]],
                        'animation' => ['speed' => 0.3, 'autoRotate' => true],
                        'colors' => ['globe' => '#1E293B', 'points' => '#F59E0B']
                    ]
                ]
            ]
        ]);
    }
}
