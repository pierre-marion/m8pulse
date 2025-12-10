<?php

namespace App\Security\Voter;

use App\Entity\Dataset;
use App\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class DatasetVoter extends Voter
{
    const CREATE = 'DATASET_CREATE';
    const EDIT = 'DATASET_EDIT';
    const DELETE = 'DATASET_DELETE';
    const VIEW = 'DATASET_VIEW';

    protected function supports(string $attribute, mixed $subject): bool
    {
        if ($attribute === self::CREATE) {
            return true;
        }

        return in_array($attribute, [self::EDIT, self::DELETE, self::VIEW])
            && $subject instanceof Dataset;
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

        /** @var Dataset $dataset */
        $dataset = $subject;

        return match($attribute) {
            self::CREATE => $this->canCreate($user),
            self::EDIT => $this->canEdit($dataset, $user),
            self::DELETE => $this->canDelete($dataset, $user),
            self::VIEW => $this->canView($dataset, $user),
            default => false,
        };
    }

    private function canCreate(User $user): bool
    {
        // Seuls les fournisseurs et admins peuvent uploader des datasets
        return in_array('ROLE_PROVIDER', $user->getRoles());
    }

    private function canEdit(Dataset $dataset, User $user): bool
    {
        // Fournisseurs peuvent modifier leurs propres datasets
        if (in_array('ROLE_PROVIDER', $user->getRoles())) {
            return $dataset->getUploadedBy() === $user;
        }

        return false;
    }

    private function canDelete(Dataset $dataset, User $user): bool
    {
        // Fournisseurs peuvent supprimer leurs propres datasets
        if (in_array('ROLE_PROVIDER', $user->getRoles())) {
            return $dataset->getUploadedBy() === $user;
        }

        return false;
    }

    private function canView(Dataset $dataset, User $user): bool
    {
        // Tous les utilisateurs authentifiés peuvent voir les datasets
        return true;
    }
}
