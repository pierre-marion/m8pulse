<?php

namespace App\Command;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(
    name: 'app:create-test-users',
    description: 'Crée tous les utilisateurs de test avec leurs rôles',
)]
class CreateTestUsersCommand extends Command
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private UserPasswordHasherInterface $passwordHasher
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $users = [
            [
                'username' => 'admin',
                'email' => 'admin@m8pulse.com',
                'password' => 'password',
                'roles' => ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_EDITOR', 'ROLE_DESIGNER', 'ROLE_DATA_PROVIDER'],
                'subscription' => 'platinum'
            ],
            [
                'username' => 'superadmin',
                'email' => 'superadmin@m8pulse.com',
                'password' => 'super123',
                'roles' => ['ROLE_USER', 'ROLE_ADMIN'],
                'subscription' => 'platinum'
            ],
            [
                'username' => 'editor',
                'email' => 'editor@m8pulse.com',
                'password' => 'editor123',
                'roles' => ['ROLE_USER', 'ROLE_SUBSCRIBER', 'ROLE_AUTHOR', 'ROLE_EDITOR'],
                'subscription' => 'gold'
            ],
            [
                'username' => 'author1',
                'email' => 'author1@m8pulse.com',
                'password' => 'author123',
                'roles' => ['ROLE_USER', 'ROLE_SUBSCRIBER', 'ROLE_AUTHOR'],
                'subscription' => 'silver'
            ],
            [
                'username' => 'author2',
                'email' => 'author2@m8pulse.com',
                'password' => 'author123',
                'roles' => ['ROLE_USER', 'ROLE_SUBSCRIBER', 'ROLE_AUTHOR'],
                'subscription' => 'silver'
            ],
            [
                'username' => 'designer',
                'email' => 'designer@m8pulse.com',
                'password' => 'design123',
                'roles' => ['ROLE_USER', 'ROLE_SUBSCRIBER', 'ROLE_DESIGNER'],
                'subscription' => 'gold'
            ],
            [
                'username' => 'provider',
                'email' => 'provider@m8pulse.com',
                'password' => 'provider123',
                'roles' => ['ROLE_USER', 'ROLE_SUBSCRIBER', 'ROLE_DATA_PROVIDER'],
                'subscription' => 'silver'
            ],
            [
                'username' => 'subscriber1',
                'email' => 'subscriber1@m8pulse.com',
                'password' => 'sub123',
                'roles' => ['ROLE_USER', 'ROLE_SUBSCRIBER'],
                'subscription' => 'free'
            ],
            [
                'username' => 'subscriber2',
                'email' => 'subscriber2@m8pulse.com',
                'password' => 'sub123',
                'roles' => ['ROLE_USER', 'ROLE_SUBSCRIBER'],
                'subscription' => 'free'
            ],
            [
                'username' => 'testuser',
                'email' => 'test@m8pulse.com',
                'password' => 'test123',
                'roles' => ['ROLE_USER'],
                'subscription' => 'free'
            ]
        ];

        $io->title('Création des utilisateurs de test M8 Pulse');

        $created = 0;
        $skipped = 0;

        foreach ($users as $userData) {
            // Vérifier si l'utilisateur existe déjà
            $existingUser = $this->entityManager
                ->getRepository(User::class)
                ->findOneBy(['email' => $userData['email']]);

            if ($existingUser) {
                $io->warning("L'utilisateur {$userData['username']} ({$userData['email']}) existe déjà.");
                $skipped++;
                continue;
            }

            // Créer l'utilisateur
            $user = new User();
            $user->setEmail($userData['email']);
            $user->setUsername($userData['username']);
            
            $hashedPassword = $this->passwordHasher->hashPassword($user, $userData['password']);
            $user->setPassword($hashedPassword);
            
            $user->setRoles($userData['roles']);
            $user->setSubscriptionLevel($userData['subscription']);

            $this->entityManager->persist($user);
            $created++;

            $io->success("✓ Créé: {$userData['username']} ({$userData['email']}) - Rôles: " . implode(', ', $userData['roles']));
        }

        $this->entityManager->flush();

        $io->section('Résumé');
        $io->text([
            "Utilisateurs créés: {$created}",
            "Utilisateurs déjà existants: {$skipped}",
            '',
            '📋 Liste des comptes de test:',
            '',
            '👑 ADMIN:',
            '  • admin@m8pulse.com / password',
            '  • superadmin@m8pulse.com / super123',
            '',
            '📝 ÉDITEURS:',
            '  • editor@m8pulse.com / editor123',
            '',
            '✍️ AUTEURS:',
            '  • author1@m8pulse.com / author123',
            '  • author2@m8pulse.com / author123',
            '',
            '🎨 DESIGNERS:',
            '  • designer@m8pulse.com / design123',
            '',
            '📊 DATA PROVIDERS:',
            '  • provider@m8pulse.com / provider123',
            '',
            '👤 ABONNÉS:',
            '  • subscriber1@m8pulse.com / sub123',
            '  • subscriber2@m8pulse.com / sub123',
            '  • test@m8pulse.com / test123',
        ]);

        $io->success('Tous les utilisateurs de test ont été créés avec succès !');
        $io->warning('IMPORTANT : Changez ces mots de passe en production !');

        return Command::SUCCESS;
    }
}
