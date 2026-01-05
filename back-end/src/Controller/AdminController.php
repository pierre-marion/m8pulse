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
use OpenApi\Attributes as OA;

#[Route('/api/admin', name: 'api_admin_')]
#[IsGranted('ROLE_ADMIN')]
#[OA\Tag(name: 'Administration')]
class AdminController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private UserPasswordHasherInterface $passwordHasher
    ) {}

    #[Route('/users', name: 'users_list', methods: ['GET'])]
    public function getUsersList(): JsonResponse
    {
        $users = $this->entityManager->getRepository(User::class)->findAll();
        
        $userData = array_map(function(User $user) {
            return [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'username' => $user->getUsername(),
                'roles' => $user->getRoles(),
                'subscriptionLevel' => $user->getSubscriptionLevel(),
                'createdAt' => $user->getCreatedAt()?->format('Y-m-d H:i:s'),
                'updatedAt' => $user->getUpdatedAt()?->format('Y-m-d H:i:s')
            ];
        }, $users);
        
        return $this->json($userData);
    }

    #[Route('/users', name: 'users_create', methods: ['POST'])]
    public function createUser(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['email']) || !isset($data['password']) || !isset($data['username'])) {
            return $this->json(['error' => 'Missing required fields: email, username, password'], Response::HTTP_BAD_REQUEST);
        }
        
        // Check if user already exists
        $existingUser = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $data['email']]);
        if ($existingUser) {
            return $this->json(['error' => 'A user with this email already exists'], Response::HTTP_CONFLICT);
        }
        
        $existingUsername = $this->entityManager->getRepository(User::class)->findOneBy(['username' => $data['username']]);
        if ($existingUsername) {
            return $this->json(['error' => 'A user with this username already exists'], Response::HTTP_CONFLICT);
        }
        
        $user = new User();
        $user->setEmail($data['email']);
        $user->setUsername($data['username']);
        
        // Hash password
        $hashedPassword = $this->passwordHasher->hashPassword($user, $data['password']);
        $user->setPassword($hashedPassword);
        
        // Set roles (default to ROLE_USER if not provided)
        $roles = $data['roles'] ?? ['ROLE_USER'];
        if (!is_array($roles)) {
            $roles = [$roles];
        }
        // Always ensure ROLE_USER is included
        if (!in_array('ROLE_USER', $roles)) {
            $roles[] = 'ROLE_USER';
        }
        $user->setRoles($roles);
        
        // Set subscription level (default to free if not provided)
        $subscriptionLevel = $data['subscriptionLevel'] ?? 'free';
        $user->setSubscriptionLevel($subscriptionLevel);
        
        $user->setCreatedAt(new \DateTime());
        $user->setUpdatedAt(new \DateTime());
        
        $this->entityManager->persist($user);
        $this->entityManager->flush();
        
        return $this->json([
            'message' => 'User created successfully',
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'username' => $user->getUsername(),
                'roles' => $user->getRoles(),
                'subscriptionLevel' => $user->getSubscriptionLevel()
            ]
        ], Response::HTTP_CREATED);
    }

    #[Route('/users/{id}', name: 'users_update', methods: ['PUT'])]
    public function updateUser(int $id, Request $request): JsonResponse
    {
        $user = $this->entityManager->getRepository(User::class)->find($id);
        
        if (!$user) {
            return $this->json(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }
        
        $data = json_decode($request->getContent(), true);
        
        // Update email if provided
        if (isset($data['email'])) {
            $existingUser = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $data['email']]);
            if ($existingUser && $existingUser->getId() !== $user->getId()) {
                return $this->json(['error' => 'Email already in use'], Response::HTTP_CONFLICT);
            }
            $user->setEmail($data['email']);
        }
        
        // Update username if provided
        if (isset($data['username'])) {
            $existingUsername = $this->entityManager->getRepository(User::class)->findOneBy(['username' => $data['username']]);
            if ($existingUsername && $existingUsername->getId() !== $user->getId()) {
                return $this->json(['error' => 'Username already in use'], Response::HTTP_CONFLICT);
            }
            $user->setUsername($data['username']);
        }
        
        // Update password if provided
        if (isset($data['password']) && !empty($data['password'])) {
            $hashedPassword = $this->passwordHasher->hashPassword($user, $data['password']);
            $user->setPassword($hashedPassword);
        }
        
        // Update roles if provided
        if (isset($data['roles'])) {
            $roles = is_array($data['roles']) ? $data['roles'] : [$data['roles']];
            // Always ensure ROLE_USER is included
            if (!in_array('ROLE_USER', $roles)) {
                $roles[] = 'ROLE_USER';
            }
            $user->setRoles($roles);
        }
        
        // Update subscription level if provided
        if (isset($data['subscriptionLevel'])) {
            $user->setSubscriptionLevel($data['subscriptionLevel']);
        }
        
        $user->setUpdatedAt(new \DateTime());
        
        $this->entityManager->flush();
        
        return $this->json([
            'message' => 'User updated successfully',
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'username' => $user->getUsername(),
                'roles' => $user->getRoles(),
                'subscriptionLevel' => $user->getSubscriptionLevel()
            ]
        ]);
    }

    #[Route('/users/{id}', name: 'users_delete', methods: ['DELETE'])]
    public function deleteUser(int $id): JsonResponse
    {
        $user = $this->entityManager->getRepository(User::class)->find($id);
        
        if (!$user) {
            return $this->json(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }
        
        // Prevent deleting yourself
        if ($user->getId() === $this->getUser()->getId()) {
            return $this->json(['error' => 'You cannot delete your own account'], Response::HTTP_FORBIDDEN);
        }
        
        $this->entityManager->remove($user);
        $this->entityManager->flush();
        
        return $this->json(['message' => 'User deleted successfully']);
    }

    #[Route('/stats', name: 'stats', methods: ['GET'])]
    public function getStats(): JsonResponse
    {
        $userRepo = $this->entityManager->getRepository(User::class);
        
        $totalUsers = $userRepo->count([]);
        
        // Count users with specific roles
        $qb = $this->entityManager->createQueryBuilder();
        $admins = $qb->select('COUNT(u.id)')
            ->from(User::class, 'u')
            ->where('u.roles LIKE :role')
            ->setParameter('role', '%ROLE_ADMIN%')
            ->getQuery()
            ->getSingleScalarResult();
            
        $qb = $this->entityManager->createQueryBuilder();
        $authors = $qb->select('COUNT(u.id)')
            ->from(User::class, 'u')
            ->where('u.roles LIKE :role')
            ->setParameter('role', '%ROLE_AUTHOR%')
            ->getQuery()
            ->getSingleScalarResult();
            
        // Count premium users (silver, gold, platinum)
        $qb = $this->entityManager->createQueryBuilder();
        $premium = $qb->select('COUNT(u.id)')
            ->from(User::class, 'u')
            ->where('u.subscriptionLevel IN (:levels)')
            ->setParameter('levels', ['silver', 'gold', 'platinum'])
            ->getQuery()
            ->getSingleScalarResult();
        
        return $this->json([
            'totalUsers' => $totalUsers,
            'admins' => $admins,
            'authors' => $authors,
            'premium' => $premium
        ]);
    }
}
