<?php

namespace App\Command;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Question\Question;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(
    name: 'app:create-admin',
    description: 'Crée un utilisateur administrateur',
)]
class CreateAdminCommand extends Command
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
        
        $io->title('Création d\'un utilisateur administrateur');
        
        $helper = $this->getHelper('question');
        
        // Email
        $emailQuestion = new Question('Email: ');
        $emailQuestion->setValidator(function ($answer) {
            if (!filter_var($answer, FILTER_VALIDATE_EMAIL)) {
                throw new \RuntimeException('Email invalide');
            }
            return $answer;
        });
        $email = $helper->ask($input, $output, $emailQuestion);
        
        // Vérifier si l'email existe déjà
        $existingUser = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $email]);
        if ($existingUser) {
            $io->error('Un utilisateur avec cet email existe déjà !');
            return Command::FAILURE;
        }
        
        // Username
        $usernameQuestion = new Question('Nom d\'utilisateur: ');
        $username = $helper->ask($input, $output, $usernameQuestion);
        
        // Password
        $passwordQuestion = new Question('Mot de passe: ');
        $passwordQuestion->setHidden(true);
        $passwordQuestion->setValidator(function ($answer) {
            if (strlen($answer) < 6) {
                throw new \RuntimeException('Le mot de passe doit contenir au moins 6 caractères');
            }
            return $answer;
        });
        $password = $helper->ask($input, $output, $passwordQuestion);
        
        // Créer l'utilisateur
        $user = new User();
        $user->setEmail($email);
        $user->setUsername($username);
        $user->setRoles(['ROLE_ADMIN']);
        $user->setSubscriptionLevel('gold');
        
        // Hasher le mot de passe
        $hashedPassword = $this->passwordHasher->hashPassword($user, $password);
        $user->setPassword($hashedPassword);
        
        $this->entityManager->persist($user);
        $this->entityManager->flush();
        
        $io->success('Utilisateur administrateur créé avec succès !');
        $io->table(
            ['Propriété', 'Valeur'],
            [
                ['ID', $user->getId()],
                ['Email', $user->getEmail()],
                ['Username', $user->getUsername()],
                ['Rôles', implode(', ', $user->getRoles())],
                ['Abonnement', $user->getSubscriptionLevel()],
            ]
        );
        
        return Command::SUCCESS;
    }
}
