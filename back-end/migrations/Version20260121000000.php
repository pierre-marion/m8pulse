<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Migration pour ajouter la colonne source à la table datasets
 */
final class Version20260121000000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add source column to datasets table';
    }

    public function up(Schema $schema): void
    {
        // Ajouter la colonne source (nullable car les datasets existants n'ont pas cette info)
        $this->addSql('ALTER TABLE datasets ADD COLUMN source VARCHAR(500) NULL AFTER description');
    }

    public function down(Schema $schema): void
    {
        // Supprimer la colonne source en cas de rollback
        $this->addSql('ALTER TABLE datasets DROP COLUMN source');
    }
}
