<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Migration pour ajouter la colonne cover_image à la table articles
 */
final class Version20260121120000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add cover_image column to articles table';
    }

    public function up(Schema $schema): void
    {
        // Ajouter la colonne cover_image (nullable car les articles existants n'ont pas d'image)
        $this->addSql('ALTER TABLE articles ADD COLUMN cover_image VARCHAR(500) NULL AFTER summary');
    }

    public function down(Schema $schema): void
    {
        // Supprimer la colonne cover_image en cas de rollback
        $this->addSql('ALTER TABLE articles DROP COLUMN cover_image');
    }
}
