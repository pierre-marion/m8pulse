<?php

namespace App\Security\Voter;

use App\Entity\Theme;
use App\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class ThemeVoter extends Voter
{
    const CREATE = 'THEME_CREATE';
    const EDIT = 'THEME_EDIT';
    const DELETE = 'THEME_DELETE';
    const ACTIVATE = 'THEME_ACTIVATE';

    protected function supports(string $attribute, mixed $subject): bool
    {
        if ($attribute === self::CREATE) {
            return true;
        }

        return in_array($attribute, [self::EDIT, self::DELETE, self::ACTIVATE])
            && $subject instanceof Theme;
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

        // Seuls les designers peuvent gérer les thèmes
        if (!in_array('ROLE_DESIGNER', $user->getRoles())) {
            return false;
        }

        return match($attribute) {
            self::CREATE, self::EDIT, self::DELETE, self::ACTIVATE => true,
            default => false,
        };
    }
}
