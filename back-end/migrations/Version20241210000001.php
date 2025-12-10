<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20241210000001 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Création de la table comments pour les commentaires d\'articles';
    }

    public function up(Schema $schema): void
    {
        // Table comments
        $this->addSql('
            CREATE TABLE IF NOT EXISTS comments (
                id INT AUTO_INCREMENT NOT NULL,
                article_id INT NOT NULL,
                author_id INT NOT NULL,
                content TEXT NOT NULL,
                created_at DATETIME NOT NULL,
                updated_at DATETIME NOT NULL,
                is_edited TINYINT(1) DEFAULT 0 NOT NULL,
                PRIMARY KEY(id),
                INDEX IDX_5F9E962A7294869C (article_id),
                INDEX IDX_5F9E962AF675F31B (author_id),
                CONSTRAINT FK_5F9E962A7294869C FOREIGN KEY (article_id) REFERENCES articles (id) ON DELETE CASCADE,
                CONSTRAINT FK_5F9E962AF675F31B FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE CASCADE
            ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE IF EXISTS comments');
    }
}
