<?php

namespace App\Command;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(
    name: 'app:create-user',
    description: 'Crée un utilisateur avec des rôles personnalisés',
)]
class CreateUserCommand extends Command
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private UserPasswordHasherInterface $passwordHasher
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addArgument('email', InputArgument::REQUIRED, 'Email de l\'utilisateur')
            ->addArgument('username', InputArgument::REQUIRED, 'Nom d\'utilisateur')
            ->addArgument('password', InputArgument::REQUIRED, 'Mot de passe')
            ->addArgument('roles', InputArgument::OPTIONAL, 'Rôles séparés par des virgules (ex: ROLE_ADMIN,ROLE_EDITOR)', 'ROLE_USER')
            ->addArgument('subscription', InputArgument::OPTIONAL, 'Niveau d\'abonnement (bronze, silver, gold)', 'bronze');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        
        $email = $input->getArgument('email');
        $username = $input->getArgument('username');
        $password = $input->getArgument('password');
        $rolesString = $input->getArgument('roles');
        $subscription = $input->getArgument('subscription');

        // Vérifier si l'email existe déjà
        $existingUser = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $email]);
        if ($existingUser) {
            $io->warning("Un utilisateur avec l'email {$email} existe déjà !");
            return Command::FAILURE;
        }

        // Parser les rôles
        $roles = array_map('trim', explode(',', $rolesString));
        
        // S'assurer que ROLE_USER est toujours présent
        if (!in_array('ROLE_USER', $roles)) {
            $roles[] = 'ROLE_USER';
        }

        // Créer l'utilisateur
        $user = new User();
        $user->setEmail($email);
        $user->setUsername($username);
        $user->setRoles($roles);
        $user->setSubscriptionLevel($subscription);
        
        // Hasher le mot de passe
        $hashedPassword = $this->passwordHasher->hashPassword($user, $password);
        $user->setPassword($hashedPassword);
        
        $this->entityManager->persist($user);
        $this->entityManager->flush();
        
        $io->success("Utilisateur {$username} créé avec succès !");
        $io->table(
            ['Propriété', 'Valeur'],
            [
                ['Email', $user->getEmail()],
                ['Username', $user->getUsername()],
                ['Rôles', implode(', ', $user->getRoles())],
                ['Abonnement', $user->getSubscriptionLevel()],
            ]
        );
        
        return Command::SUCCESS;
    }
}
