<?php

namespace App\Security\Voter;

use App\Entity\Media;
use App\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class MediaVoter extends Voter
{
    const UPLOAD = 'MEDIA_UPLOAD';
    const DELETE = 'MEDIA_DELETE';
    const VIEW = 'MEDIA_VIEW';

    protected function supports(string $attribute, mixed $subject): bool
    {
        if ($attribute === self::UPLOAD) {
            return true;
        }

        return in_array($attribute, [self::DELETE, self::VIEW])
            && $subject instanceof Media;
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

        // Pour UPLOAD, pas besoin de Media
        if ($attribute === self::UPLOAD) {
            return $this->canUpload($user);
        }

        // Pour DELETE et VIEW, on a besoin d'un Media
        /** @var Media $media */
        $media = $subject;

        return match($attribute) {
            self::DELETE => $this->canDelete($media, $user),
            self::VIEW => $this->canView($media, $user),
            default => false,
        };
    }

    private function canUpload(User $user): bool
    {
        // Auteurs, éditeurs et designers peuvent uploader des médias
        return in_array('ROLE_AUTHOR', $user->getRoles()) 
            || in_array('ROLE_EDITOR', $user->getRoles())
            || in_array('ROLE_DESIGNER', $user->getRoles());
    }

    private function canDelete(Media $media, User $user): bool
    {
        // Éditeurs peuvent supprimer tous les médias
        if (in_array('ROLE_EDITOR', $user->getRoles())) {
            return true;
        }

        // Auteurs peuvent supprimer leurs propres médias
        if (in_array('ROLE_AUTHOR', $user->getRoles())) {
            return $media->getUploadedBy() === $user;
        }

        return false;
    }

    private function canView(Media $media, User $user): bool
    {
        // Tous les utilisateurs authentifiés peuvent voir les médias
        return true;
    }
}
