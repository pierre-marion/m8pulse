<?php

namespace App\Repository;

use App\Entity\Theme;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class ThemeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Theme::class);
    }

    public function findActiveTheme(string $scope, ?int $targetId = null): ?Theme
    {
        $qb = $this->createQueryBuilder('t')
            ->where('t.scope = :scope')
            ->andWhere('t.isActive = :active')
            ->setParameter('scope', $scope)
            ->setParameter('active', true)
            ->setMaxResults(1);

        if ($targetId !== null) {
            $qb->andWhere('t.targetId = :targetId')
               ->setParameter('targetId', $targetId);
        }

        return $qb->getQuery()->getOneOrNullResult();
    }
}
