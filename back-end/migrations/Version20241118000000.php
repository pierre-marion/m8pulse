<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20241118000000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Création de toutes les tables pour M8Pulse CMS';
    }

    public function up(Schema $schema): void
    {
        // Users table
        $this->addSql('CREATE TABLE users (
            id INT AUTO_INCREMENT NOT NULL,
            email VARCHAR(180) NOT NULL,
            username VARCHAR(100) NOT NULL,
            roles JSON NOT NULL,
            password VARCHAR(255) NOT NULL,
            subscription_level VARCHAR(50) DEFAULT "bronze",
            created_at DATETIME NOT NULL,
            updated_at DATETIME DEFAULT NULL,
            UNIQUE INDEX UNIQ_1483A5E9E7927C74 (email),
            PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');

        // Themes table
        $this->addSql('CREATE TABLE themes (
            id INT AUTO_INCREMENT NOT NULL,
            created_by_id INT NOT NULL,
            name VARCHAR(255) NOT NULL,
            description LONGTEXT DEFAULT NULL,
            styles JSON NOT NULL,
            scope VARCHAR(50) NOT NULL,
            is_default TINYINT(1) NOT NULL,
            is_active TINYINT(1) NOT NULL,
            created_at DATETIME NOT NULL,
            updated_at DATETIME NOT NULL,
            INDEX IDX_9F3954F8B03A8386 (created_by_id),
            PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');

        // Articles table
        $this->addSql('CREATE TABLE articles (
            id INT AUTO_INCREMENT NOT NULL,
            author_id INT NOT NULL,
            theme_id INT DEFAULT NULL,
            title VARCHAR(255) NOT NULL,
            summary LONGTEXT DEFAULT NULL,
            type VARCHAR(50) NOT NULL,
            status VARCHAR(50) NOT NULL,
            view_count INT DEFAULT 0 NOT NULL,
            created_at DATETIME NOT NULL,
            updated_at DATETIME NOT NULL,
            published_at DATETIME DEFAULT NULL,
            INDEX IDX_BFDD3168F675F31B (author_id),
            INDEX IDX_BFDD316859027487 (theme_id),
            PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');

        // Media table
        $this->addSql('CREATE TABLE media (
            id INT AUTO_INCREMENT NOT NULL,
            uploaded_by_id INT NOT NULL,
            name VARCHAR(255) NOT NULL,
            filename VARCHAR(255) NOT NULL,
            path VARCHAR(255) NOT NULL,
            mime_type VARCHAR(100) NOT NULL,
            size INT NOT NULL,
            tags JSON DEFAULT NULL,
            type VARCHAR(50) NOT NULL,
            uploaded_at DATETIME NOT NULL,
            INDEX IDX_6A2CA10CA2B28FE8 (uploaded_by_id),
            PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');

        // Datasets table
        $this->addSql('CREATE TABLE datasets (
            id INT AUTO_INCREMENT NOT NULL,
            uploader_id INT NOT NULL,
            name VARCHAR(255) NOT NULL,
            description LONGTEXT DEFAULT NULL,
            source VARCHAR(500) DEFAULT NULL,
            filename VARCHAR(255) DEFAULT NULL,
            filepath VARCHAR(255) DEFAULT NULL,
            variables JSON NOT NULL,
            data JSON DEFAULT NULL,
            row_count INT DEFAULT NULL,
            status VARCHAR(50) NOT NULL,
            uploaded_at DATETIME NOT NULL,
            validated_at DATETIME DEFAULT NULL,
            INDEX IDX_2A848A1416678C77 (uploader_id),
            PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');

        // Visualizations table
        $this->addSql('CREATE TABLE visualizations (
            id INT AUTO_INCREMENT NOT NULL,
            dataset_id INT NOT NULL,
            created_by_id INT NOT NULL,
            name VARCHAR(255) NOT NULL,
            description LONGTEXT DEFAULT NULL,
            type VARCHAR(50) NOT NULL,
            config JSON NOT NULL,
            selected_variables JSON DEFAULT NULL,
            colors JSON DEFAULT NULL,
            options JSON DEFAULT NULL,
            created_at DATETIME NOT NULL,
            updated_at DATETIME NOT NULL,
            INDEX IDX_1FD369D9D47C2D1B (dataset_id),
            INDEX IDX_1FD369D9B03A8386 (created_by_id),
            PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');

        // Blocks table
        $this->addSql('CREATE TABLE blocks (
            id INT AUTO_INCREMENT NOT NULL,
            article_id INT NOT NULL,
            media_id INT DEFAULT NULL,
            visualization_id INT DEFAULT NULL,
            type VARCHAR(50) NOT NULL,
            content LONGTEXT DEFAULT NULL,
            config JSON DEFAULT NULL,
            position INT NOT NULL,
            created_at DATETIME NOT NULL,
            updated_at DATETIME NOT NULL,
            INDEX IDX_CEED95737294869C (article_id),
            INDEX IDX_CEED9573EA9FDD75 (media_id),
            INDEX IDX_CEED95739BD4F405 (visualization_id),
            PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');

        // Ratings table
        $this->addSql('CREATE TABLE ratings (
            id INT AUTO_INCREMENT NOT NULL,
            user_id INT NOT NULL,
            article_id INT DEFAULT NULL,
            block_id INT DEFAULT NULL,
            stars INT NOT NULL,
            comment LONGTEXT DEFAULT NULL,
            created_at DATETIME NOT NULL,
            INDEX IDX_CEB607C9A76ED395 (user_id),
            INDEX IDX_CEB607C97294869C (article_id),
            INDEX IDX_CEB607C9E9ED820C (block_id),
            PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');

        // Welcome config table
        $this->addSql('CREATE TABLE welcome_config (
            id INT AUTO_INCREMENT NOT NULL,
            welcome_text LONGTEXT NOT NULL,
            visualization_config JSON NOT NULL,
            is_active TINYINT(1) NOT NULL,
            updated_at DATETIME NOT NULL,
            PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');

        // Foreign keys
        $this->addSql('ALTER TABLE themes ADD CONSTRAINT FK_9F3954F8B03A8386 FOREIGN KEY (created_by_id) REFERENCES users (id)');
        $this->addSql('ALTER TABLE articles ADD CONSTRAINT FK_BFDD3168F675F31B FOREIGN KEY (author_id) REFERENCES users (id)');
        $this->addSql('ALTER TABLE articles ADD CONSTRAINT FK_BFDD316859027487 FOREIGN KEY (theme_id) REFERENCES themes (id)');
        $this->addSql('ALTER TABLE media ADD CONSTRAINT FK_6A2CA10CA2B28FE8 FOREIGN KEY (uploaded_by_id) REFERENCES users (id)');
        $this->addSql('ALTER TABLE datasets ADD CONSTRAINT FK_2A848A1416678C77 FOREIGN KEY (uploader_id) REFERENCES users (id)');
        $this->addSql('ALTER TABLE visualizations ADD CONSTRAINT FK_1FD369D9D47C2D1B FOREIGN KEY (dataset_id) REFERENCES datasets (id)');
        $this->addSql('ALTER TABLE visualizations ADD CONSTRAINT FK_1FD369D9B03A8386 FOREIGN KEY (created_by_id) REFERENCES users (id)');
        $this->addSql('ALTER TABLE blocks ADD CONSTRAINT FK_CEED95737294869C FOREIGN KEY (article_id) REFERENCES articles (id)');
        $this->addSql('ALTER TABLE blocks ADD CONSTRAINT FK_CEED9573EA9FDD75 FOREIGN KEY (media_id) REFERENCES media (id)');
        $this->addSql('ALTER TABLE blocks ADD CONSTRAINT FK_CEED95739BD4F405 FOREIGN KEY (visualization_id) REFERENCES visualizations (id)');
        $this->addSql('ALTER TABLE ratings ADD CONSTRAINT FK_CEB607C9A76ED395 FOREIGN KEY (user_id) REFERENCES users (id)');
        $this->addSql('ALTER TABLE ratings ADD CONSTRAINT FK_CEB607C97294869C FOREIGN KEY (article_id) REFERENCES articles (id)');
        $this->addSql('ALTER TABLE ratings ADD CONSTRAINT FK_CEB607C9E9ED820C FOREIGN KEY (block_id) REFERENCES blocks (id)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE themes DROP FOREIGN KEY FK_9F3954F8B03A8386');
        $this->addSql('ALTER TABLE articles DROP FOREIGN KEY FK_BFDD3168F675F31B');
        $this->addSql('ALTER TABLE articles DROP FOREIGN KEY FK_BFDD316859027487');
        $this->addSql('ALTER TABLE media DROP FOREIGN KEY FK_6A2CA10CA2B28FE8');
        $this->addSql('ALTER TABLE datasets DROP FOREIGN KEY FK_2A848A1416678C77');
        $this->addSql('ALTER TABLE visualizations DROP FOREIGN KEY FK_1FD369D9D47C2D1B');
        $this->addSql('ALTER TABLE visualizations DROP FOREIGN KEY FK_1FD369D9B03A8386');
        $this->addSql('ALTER TABLE blocks DROP FOREIGN KEY FK_CEED95737294869C');
        $this->addSql('ALTER TABLE blocks DROP FOREIGN KEY FK_CEED9573EA9FDD75');
        $this->addSql('ALTER TABLE blocks DROP FOREIGN KEY FK_CEED95739BD4F405');
        $this->addSql('ALTER TABLE ratings DROP FOREIGN KEY FK_CEB607C9A76ED395');
        $this->addSql('ALTER TABLE ratings DROP FOREIGN KEY FK_CEB607C97294869C');
        $this->addSql('ALTER TABLE ratings DROP FOREIGN KEY FK_CEB607C9E9ED820C');
        
        $this->addSql('DROP TABLE welcome_config');
        $this->addSql('DROP TABLE ratings');
        $this->addSql('DROP TABLE blocks');
        $this->addSql('DROP TABLE visualizations');
        $this->addSql('DROP TABLE datasets');
        $this->addSql('DROP TABLE media');
        $this->addSql('DROP TABLE articles');
        $this->addSql('DROP TABLE themes');
        $this->addSql('DROP TABLE users');
    }
}
