<?php

namespace App\Repository;

use App\Entity\Rating;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class RatingRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Rating::class);
    }

    public function calculateAverageForBlock(int $blockId): ?float
    {
        $result = $this->createQueryBuilder('r')
            ->select('AVG(r.stars) as average')
            ->where('r.block = :blockId')
            ->setParameter('blockId', $blockId)
            ->getQuery()
            ->getSingleScalarResult();

        return $result ? (float) $result : null;
    }

    public function countForBlock(int $blockId): int
    {
        return $this->count(['block' => $blockId]);
    }
}
