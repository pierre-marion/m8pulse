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
    name: 'app:create-admins',
    description: 'Crée les 3 comptes administrateurs : Hugo, Pierre et Nathan',
)]
class CreateAdminsCommand extends Command
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

        $admins = [
            [
                'username' => 'Hugo',
                'email' => 'hugo@m8pulse.com',
                'password' => 'Admin123!Hugo'
            ],
            [
                'username' => 'Pierre',
                'email' => 'pierre@m8pulse.com',
                'password' => 'Admin123!Pierre'
            ],
            [
                'username' => 'Nathan',
                'email' => 'nathan@m8pulse.com',
                'password' => 'Admin123!Nathan'
            ]
        ];

        $io->title('Création des comptes administrateurs');

        foreach ($admins as $adminData) {
            // Vérifier si l'admin existe déjà
            $existingUser = $this->entityManager
                ->getRepository(User::class)
                ->findOneBy(['email' => $adminData['email']]);

            if ($existingUser) {
                $io->warning("L'utilisateur {$adminData['username']} ({$adminData['email']}) existe déjà.");
                continue;
            }

            $user = new User();
            $user->setUsername($adminData['username']);
            $user->setEmail($adminData['email']);
            
            // Hash du mot de passe
            $hashedPassword = $this->passwordHasher->hashPassword($user, $adminData['password']);
            $user->setPassword($hashedPassword);
            
            // Définir les rôles admin
            $user->setRoles(['ROLE_ADMIN', 'ROLE_EDITOR', 'ROLE_AUTHOR']);
            
            // Niveau d'abonnement gold pour les admins
            $user->setSubscriptionLevel('gold');

            $this->entityManager->persist($user);

            $io->success("✓ Compte administrateur créé : {$adminData['username']} ({$adminData['email']})");
            $io->text("  Mot de passe : {$adminData['password']}");
        }

        $this->entityManager->flush();

        $io->newLine();
        $io->success('Tous les comptes administrateurs ont été créés avec succès !');
        $io->note('Les administrateurs peuvent maintenant se connecter avec leurs identifiants.');
        $io->warning('IMPORTANT : Changez ces mots de passe en production !');

        return Command::SUCCESS;
    }
}
