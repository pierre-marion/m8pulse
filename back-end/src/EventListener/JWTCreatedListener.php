<?php

namespace App\EventListener;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use Symfony\Component\Security\Core\User\UserInterface;

class JWTCreatedListener
{
    public function onJWTCreated(JWTCreatedEvent $event): void
    {
        $user = $event->getUser();
        
        if (!$user instanceof UserInterface) {
            return;
        }

        $payload = $event->getData();
        
        // Add email to payload
        if (method_exists($user, 'getEmail')) {
            $payload['email'] = $user->getEmail();
        }
        
        // Ensure username matches the user identifier (email)
        $payload['username'] = $user->getUserIdentifier();
        
        $event->setData($payload);
    }
}
