<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use OpenApi\Attributes as OA;

#[Route('/api/auth', name: 'api_auth_')]
#[OA\Tag(name: 'Authentification')]
class AuthController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private UserPasswordHasherInterface $passwordHasher
    ) {}

    #[Route('/register', name: 'register', methods: ['POST'])]
    #[OA\Post(
        path: '/api/auth/register',
        summary: 'Inscription d\'un nouvel utilisateur',
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['email', 'password', 'username'],
                properties: [
                    new OA\Property(property: 'email', type: 'string', format: 'email', example: 'user@example.com'),
                    new OA\Property(property: 'username', type: 'string', example: 'JohnDoe'),
                    new OA\Property(property: 'password', type: 'string', format: 'password', example: 'SecurePass123!')
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: 'Utilisateur créé avec succès',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'message', type: 'string', example: 'User registered successfully'),
                        new OA\Property(
                            property: 'user',
                            type: 'object',
                            properties: [
                                new OA\Property(property: 'id', type: 'integer', example: 1),
                                new OA\Property(property: 'email', type: 'string', example: 'user@example.com'),
                                new OA\Property(property: 'username', type: 'string', example: 'JohnDoe'),
                                new OA\Property(property: 'roles', type: 'array', items: new OA\Items(type: 'string'))
                            ]
                        )
                    ]
                )
            ),
            new OA\Response(response: 400, description: 'Données manquantes'),
            new OA\Response(response: 409, description: 'Utilisateur existe déjà')
        ]
    )]
    public function register(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        // Validation des champs requis
        if (!isset($data['email']) || !isset($data['password']) || !isset($data['username'])) {
            return $this->json([
                'error' => 'Champs requis manquants',
                'required' => ['email', 'password', 'username']
            ], Response::HTTP_BAD_REQUEST);
        }

        // Validation de l'email
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            return $this->json(['error' => 'Email invalide'], Response::HTTP_BAD_REQUEST);
        }

        // Validation du mot de passe (min 8 caractères)
        if (strlen($data['password']) < 8) {
            return $this->json([
                'error' => 'Le mot de passe doit contenir au moins 8 caractères'
            ], Response::HTTP_BAD_REQUEST);
        }

        // Vérifier si l'utilisateur existe déjà
        $existingUser = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $data['email']]);
        if ($existingUser) {
            return $this->json(['error' => 'Un utilisateur avec cet email existe déjà'], Response::HTTP_CONFLICT);
        }

        // Vérifier si le username existe déjà
        $existingUsername = $this->entityManager->getRepository(User::class)->findOneBy(['username' => $data['username']]);
        if ($existingUsername) {
            return $this->json(['error' => 'Ce nom d\'utilisateur est déjà pris'], Response::HTTP_CONFLICT);
        }

        $user = new User();
        $user->setEmail($data['email']);
        $user->setUsername($data['username']);
        
        // Hash du mot de passe
        $hashedPassword = $this->passwordHasher->hashPassword($user, $data['password']);
        $user->setPassword($hashedPassword);
        
        // Rôle par défaut : visiteur
        $user->setRoles(['ROLE_VISITOR']);
        
        // Niveau d'abonnement par défaut
        $user->setSubscriptionLevel('bronze');
        
        $this->entityManager->persist($user);
        $this->entityManager->flush();
        
        return $this->json([
            'message' => 'Inscription réussie',
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'username' => $user->getUsername(),
                'roles' => $user->getRoles(),
                'subscriptionLevel' => $user->getSubscriptionLevel()
            ]
        ], Response::HTTP_CREATED);
    }

    #[Route('/me', name: 'me', methods: ['GET'])]
    #[OA\Get(
        path: '/api/auth/me',
        summary: 'Récupérer les informations de l\'utilisateur connecté',
        security: [['bearerAuth' => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Informations utilisateur',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'id', type: 'integer', example: 1),
                        new OA\Property(property: 'email', type: 'string', example: 'user@example.com'),
                        new OA\Property(property: 'username', type: 'string', example: 'JohnDoe'),
                        new OA\Property(property: 'roles', type: 'array', items: new OA\Items(type: 'string')),
                        new OA\Property(property: 'subscriptionLevel', type: 'string', example: 'bronze')
                    ]
                )
            ),
            new OA\Response(response: 401, description: 'Non authentifié')
        ]
    )]
    public function me(): JsonResponse
    {
        $user = $this->getUser();
        
        if (!$user) {
            return $this->json(['error' => 'Non authentifié'], Response::HTTP_UNAUTHORIZED);
        }
        
        return $this->json([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'username' => $user->getUsername(),
            'roles' => $user->getRoles(),
            'subscriptionLevel' => $user->getSubscriptionLevel(),
            'createdAt' => $user->getCreatedAt()->format('Y-m-d H:i:s')
        ]);
    }

    #[Route('/check', name: 'check', methods: ['GET'])]
    #[OA\Get(
        path: '/api/auth/check',
        summary: 'Vérifier si l\'utilisateur est connecté',
        responses: [
            new OA\Response(
                response: 200,
                description: 'Statut de connexion',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'authenticated', type: 'boolean', example: true),
                        new OA\Property(property: 'user', type: 'object', nullable: true)
                    ]
                )
            )
        ]
    )]
    public function check(): JsonResponse
    {
        $user = $this->getUser();
        
        return $this->json([
            'authenticated' => $user !== null,
            'user' => $user ? [
                'id' => $user->getId(),
                'username' => $user->getUsername(),
                'email' => $user->getEmail(),
                'roles' => $user->getRoles()
            ] : null
        ]);
    }
}
