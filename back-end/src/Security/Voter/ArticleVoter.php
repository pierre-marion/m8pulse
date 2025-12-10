<?php

namespace App\Security\Voter;

use App\Entity\Article;
use App\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class ArticleVoter extends Voter
{
    const CREATE = 'ARTICLE_CREATE';
    const EDIT = 'ARTICLE_EDIT';
    const DELETE = 'ARTICLE_DELETE';
    const VIEW = 'ARTICLE_VIEW';
    const PUBLISH = 'ARTICLE_PUBLISH';

    protected function supports(string $attribute, mixed $subject): bool
    {
        // Si c'est CREATE, on n'a pas besoin de subject
        if ($attribute === self::CREATE) {
            return true;
        }

        // Pour les autres actions, on vérifie que le subject est un Article
        return in_array($attribute, [self::EDIT, self::DELETE, self::VIEW, self::PUBLISH])
            && $subject instanceof Article;
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();

        // Si l'utilisateur n'est pas connecté, refuser l'accès
        if (!$user instanceof User) {
            return false;
        }

        // Les admins peuvent tout faire
        if (in_array('ROLE_ADMIN', $user->getRoles())) {
            return true;
        }

        /** @var Article $article */
        $article = $subject;

        return match($attribute) {
            self::CREATE => $this->canCreate($user),
            self::EDIT => $this->canEdit($article, $user),
            self::DELETE => $this->canDelete($article, $user),
            self::VIEW => $this->canView($article, $user),
            self::PUBLISH => $this->canPublish($article, $user),
            default => false,
        };
    }

    private function canCreate(User $user): bool
    {
        // Auteurs et éditeurs peuvent créer des articles
        return in_array('ROLE_AUTHOR', $user->getRoles()) 
            || in_array('ROLE_EDITOR', $user->getRoles());
    }

    private function canEdit(Article $article, User $user): bool
    {
        // Éditeurs peuvent modifier tous les articles
        if (in_array('ROLE_EDITOR', $user->getRoles())) {
            return true;
        }

        // Auteurs peuvent modifier seulement leurs propres articles
        if (in_array('ROLE_AUTHOR', $user->getRoles())) {
            return $article->getAuthor() === $user;
        }

        return false;
    }

    private function canDelete(Article $article, User $user): bool
    {
        // Seuls les éditeurs et admins peuvent supprimer
        if (in_array('ROLE_EDITOR', $user->getRoles())) {
            return true;
        }

        // Les auteurs peuvent supprimer leurs propres articles non publiés
        if (in_array('ROLE_AUTHOR', $user->getRoles())) {
            return $article->getAuthor() === $user && !$article->isPublished();
        }

        return false;
    }

    private function canView(Article $article, User $user): bool
    {
        // Articles publiés : tout le monde peut voir
        if ($article->isPublished()) {
            return true;
        }

        // Articles non publiés : seulement l'auteur, les éditeurs et admins
        if (in_array('ROLE_EDITOR', $user->getRoles())) {
            return true;
        }

        return $article->getAuthor() === $user;
    }

    private function canPublish(Article $article, User $user): bool
    {
        // Seuls les éditeurs et admins peuvent publier
        return in_array('ROLE_EDITOR', $user->getRoles());
    }
}
