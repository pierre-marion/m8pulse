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
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;
use OpenApi\Attributes as OA;

#[Route('/api/users', name: 'api_users_')]
#[OA\Tag(name: 'Utilisateurs')]
class UserController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private SerializerInterface $serializer
    ) {}

    #[Route('', name: 'list', methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN')]
    public function list(): JsonResponse
    {
        $users = $this->entityManager->getRepository(User::class)->findAll();
        
        $data = $this->serializer->serialize($users, 'json', ['groups' => 'user:read']);
        
        return new JsonResponse($data, Response::HTTP_OK, [], true);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN')]
    public function show(int $id): JsonResponse
    {
        $user = $this->entityManager->getRepository(User::class)->find($id);
        
        if (!$user) {
            return $this->json(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }
        
        $data = $this->serializer->serialize($user, 'json', ['groups' => 'user:read']);
        
        return new JsonResponse($data, Response::HTTP_OK, [], true);
    }

    #[Route('/register', name: 'register', methods: ['POST'])]
    public function register(Request $request, UserPasswordHasherInterface $passwordHasher): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['email']) || !isset($data['password']) || !isset($data['username'])) {
            return $this->json(['error' => 'Missing required fields'], Response::HTTP_BAD_REQUEST);
        }
        
        // Vérifier si l'utilisateur existe déjà
        $existingUser = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $data['email']]);
        if ($existingUser) {
            return $this->json(['error' => 'User already exists'], Response::HTTP_CONFLICT);
        }
        
        $user = new User();
        $user->setEmail($data['email']);
        $user->setUsername($data['username']);
        
        // Hash du mot de passe
        $hashedPassword = $passwordHasher->hashPassword($user, $data['password']);
        $user->setPassword($hashedPassword);
        
        // Rôle par défaut : visiteur
        $user->setRoles(['ROLE_VISITOR']);
        
        // Niveau d'abonnement par défaut
        $user->setSubscriptionLevel($data['subscriptionLevel'] ?? 'bronze');
        
        $this->entityManager->persist($user);
        $this->entityManager->flush();
        
        return $this->json([
            'message' => 'User registered successfully',
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'username' => $user->getUsername(),
                'roles' => $user->getRoles()
            ]
        ], Response::HTTP_CREATED);
    }

    #[Route('/me', name: 'profile', methods: ['GET'])]
    public function profile(): JsonResponse
    {
        $user = $this->getUser();
        
        if (!$user) {
            return $this->json(['error' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
        }
        
        return $this->json([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'username' => $user->getUsername(),
            'roles' => $user->getRoles(),
            'subscriptionLevel' => $user->getSubscriptionLevel()
        ]);
    }

    #[Route('/{id}/roles', name: 'update_roles', methods: ['PATCH'])]
    #[IsGranted('ROLE_ADMIN')]
    public function updateRoles(int $id, Request $request): JsonResponse
    {
        $user = $this->entityManager->getRepository(User::class)->find($id);
        
        if (!$user) {
            return $this->json(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }
        
        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['roles']) || !is_array($data['roles'])) {
            return $this->json(['error' => 'Invalid roles data'], Response::HTTP_BAD_REQUEST);
        }
        
        $validRoles = [
            'ROLE_VISITOR', 
            'ROLE_SUBSCRIBER', 
            'ROLE_AUTHOR', 
            'ROLE_EDITOR', 
            'ROLE_DESIGNER', 
            'ROLE_PROVIDER', 
            'ROLE_ADMIN'
        ];
        
        foreach ($data['roles'] as $role) {
            if (!in_array($role, $validRoles)) {
                return $this->json(['error' => "Invalid role: $role"], Response::HTTP_BAD_REQUEST);
            }
        }
        
        $user->setRoles($data['roles']);
        $user->setUpdatedAt(new \DateTime());
        
        $this->entityManager->flush();
        
        return $this->json([
            'message' => 'User roles updated successfully',
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'roles' => $user->getRoles()
            ]
        ]);
    }

    #[Route('/{id}/subscription', name: 'update_subscription', methods: ['PATCH'])]
    #[IsGranted('ROLE_ADMIN')]
    public function updateSubscription(int $id, Request $request): JsonResponse
    {
        $user = $this->entityManager->getRepository(User::class)->find($id);
        
        if (!$user) {
            return $this->json(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }
        
        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['subscriptionLevel'])) {
            return $this->json(['error' => 'Missing subscriptionLevel'], Response::HTTP_BAD_REQUEST);
        }
        
        $validLevels = ['bronze', 'silver', 'gold'];
        if (!in_array($data['subscriptionLevel'], $validLevels)) {
            return $this->json(['error' => 'Invalid subscription level'], Response::HTTP_BAD_REQUEST);
        }
        
        $user->setSubscriptionLevel($data['subscriptionLevel']);
        $user->setUpdatedAt(new \DateTime());
        
        $this->entityManager->flush();
        
        return $this->json([
            'message' => 'Subscription updated successfully',
            'user' => [
                'id' => $user->getId(),
                'subscriptionLevel' => $user->getSubscriptionLevel()
            ]
        ]);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    #[IsGranted('ROLE_ADMIN')]
    public function delete(int $id): JsonResponse
    {
        $user = $this->entityManager->getRepository(User::class)->find($id);
        
        if (!$user) {
            return $this->json(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }
        
        $this->entityManager->remove($user);
        $this->entityManager->flush();
        
        return $this->json(['message' => 'User deleted successfully']);
    }
}
