<?php

namespace App\Repository;

use App\Entity\Dataset;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class DatasetRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Dataset::class);
    }

    public function findValidatedDatasets(): array
    {
        return $this->createQueryBuilder('d')
            ->where('d.isValidated = :validated')
            ->setParameter('validated', true)
            ->orderBy('d.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }
}
