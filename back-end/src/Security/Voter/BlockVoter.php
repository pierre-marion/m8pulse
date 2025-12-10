<?php

namespace App\Security\Voter;

use App\Entity\Block;
use App\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class BlockVoter extends Voter
{
    const CREATE = 'BLOCK_CREATE';
    const EDIT = 'BLOCK_EDIT';
    const DELETE = 'BLOCK_DELETE';
    const REORDER = 'BLOCK_REORDER';

    protected function supports(string $attribute, mixed $subject): bool
    {
        if ($attribute === self::CREATE) {
            return true;
        }

        return in_array($attribute, [self::EDIT, self::DELETE, self::REORDER])
            && $subject instanceof Block;
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();

        if (!$user instanceof User) {
            return false;
        }

        // Admins peuvent tout faire
        if (in_array('ROLE_ADMIN', $user->getRoles())) {
            return true;
        }

        /** @var Block $block */
        $block = $subject;

        return match($attribute) {
            self::CREATE => $this->canCreate($user),
            self::EDIT => $this->canEdit($block, $user),
            self::DELETE => $this->canDelete($block, $user),
            self::REORDER => $this->canReorder($block, $user),
            default => false,
        };
    }

    private function canCreate(User $user): bool
    {
        // Auteurs et éditeurs peuvent créer des blocs
        return in_array('ROLE_AUTHOR', $user->getRoles()) 
            || in_array('ROLE_EDITOR', $user->getRoles());
    }

    private function canEdit(Block $block, User $user): bool
    {
        // Éditeurs peuvent modifier tous les blocs
        if (in_array('ROLE_EDITOR', $user->getRoles())) {
            return true;
        }

        // Auteurs peuvent modifier les blocs de leurs propres articles
        if (in_array('ROLE_AUTHOR', $user->getRoles())) {
            return $block->getArticle()?->getAuthor() === $user;
        }

        return false;
    }

    private function canDelete(Block $block, User $user): bool
    {
        // Éditeurs peuvent supprimer tous les blocs
        if (in_array('ROLE_EDITOR', $user->getRoles())) {
            return true;
        }

        // Auteurs peuvent supprimer les blocs de leurs propres articles
        if (in_array('ROLE_AUTHOR', $user->getRoles())) {
            return $block->getArticle()?->getAuthor() === $user;
        }

        return false;
    }

    private function canReorder(Block $block, User $user): bool
    {
        // Même logique que pour l'édition
        return $this->canEdit($block, $user);
    }
}
