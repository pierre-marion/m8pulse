<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260105180320 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE blocks (id INT AUTO_INCREMENT NOT NULL, type VARCHAR(50) NOT NULL, content LONGTEXT DEFAULT NULL, config JSON DEFAULT NULL, position INT NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, article_id INT NOT NULL, media_id INT DEFAULT NULL, visualization_id INT DEFAULT NULL, INDEX IDX_CEED95787294869C (article_id), INDEX IDX_CEED9578EA9FDD75 (media_id), INDEX IDX_CEED9578B695AE45 (visualization_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE themes (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, description LONGTEXT DEFAULT NULL, styles JSON NOT NULL, scope VARCHAR(50) NOT NULL, is_default TINYINT(1) NOT NULL, is_active TINYINT(1) NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, created_by_id INT NOT NULL, INDEX IDX_154232DEB03A8386 (created_by_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE welcome_config (id INT AUTO_INCREMENT NOT NULL, welcome_text LONGTEXT NOT NULL, visualization_config JSON NOT NULL, is_active TINYINT(1) NOT NULL, updated_at DATETIME NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE blocks ADD CONSTRAINT FK_CEED95787294869C FOREIGN KEY (article_id) REFERENCES articles (id)');
        $this->addSql('ALTER TABLE blocks ADD CONSTRAINT FK_CEED9578EA9FDD75 FOREIGN KEY (media_id) REFERENCES media (id)');
        $this->addSql('ALTER TABLE blocks ADD CONSTRAINT FK_CEED9578B695AE45 FOREIGN KEY (visualization_id) REFERENCES visualizations (id)');
        $this->addSql('ALTER TABLE themes ADD CONSTRAINT FK_154232DEB03A8386 FOREIGN KEY (created_by_id) REFERENCES users (id)');
        $this->addSql('ALTER TABLE article_comments DROP FOREIGN KEY `article_comments_ibfk_1`');
        $this->addSql('ALTER TABLE article_comments DROP FOREIGN KEY `article_comments_ibfk_2`');
        $this->addSql('ALTER TABLE matches DROP FOREIGN KEY `matches_ibfk_1`');
        $this->addSql('ALTER TABLE user_sessions DROP FOREIGN KEY `user_sessions_ibfk_1`');
        $this->addSql('DROP TABLE article_comments');
        $this->addSql('DROP TABLE matches');
        $this->addSql('DROP TABLE user_sessions');
        $this->addSql('ALTER TABLE articles DROP FOREIGN KEY `articles_ibfk_1`');
        $this->addSql('DROP INDEX idx_status ON articles');
        $this->addSql('DROP INDEX idx_type ON articles');
        $this->addSql('DROP INDEX idx_game ON articles');
        $this->addSql('ALTER TABLE articles DROP blocks, CHANGE summary summary LONGTEXT DEFAULT NULL, CHANGE type type VARCHAR(50) NOT NULL, CHANGE game game VARCHAR(50) DEFAULT NULL, CHANGE status status VARCHAR(50) NOT NULL, CHANGE view_count view_count INT DEFAULT 0 NOT NULL, CHANGE created_at created_at DATETIME NOT NULL, CHANGE updated_at updated_at DATETIME NOT NULL');
        $this->addSql('ALTER TABLE articles ADD CONSTRAINT FK_BFDD3168F675F31B FOREIGN KEY (author_id) REFERENCES users (id)');
        $this->addSql('ALTER TABLE articles ADD CONSTRAINT FK_BFDD316859027487 FOREIGN KEY (theme_id) REFERENCES themes (id)');
        $this->addSql('CREATE INDEX IDX_BFDD316859027487 ON articles (theme_id)');
        $this->addSql('ALTER TABLE articles RENAME INDEX idx_author TO IDX_BFDD3168F675F31B');
        $this->addSql('ALTER TABLE comments DROP FOREIGN KEY `comments_ibfk_2`');
        $this->addSql('DROP INDEX idx_user ON comments');
        $this->addSql('ALTER TABLE comments CHANGE content content LONGTEXT NOT NULL, CHANGE is_edited is_edited TINYINT(1) DEFAULT 0 NOT NULL, CHANGE created_at created_at DATETIME NOT NULL, CHANGE updated_at updated_at DATETIME NOT NULL, CHANGE user_id author_id INT NOT NULL');
        $this->addSql('ALTER TABLE comments ADD CONSTRAINT FK_5F9E962AF675F31B FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE CASCADE');
        $this->addSql('CREATE INDEX IDX_5F9E962AF675F31B ON comments (author_id)');
        $this->addSql('ALTER TABLE comments RENAME INDEX idx_article TO IDX_5F9E962A7294869C');
        $this->addSql('ALTER TABLE datasets DROP FOREIGN KEY `datasets_ibfk_1`');
        $this->addSql('DROP INDEX idx_provider ON datasets');
        $this->addSql('DROP INDEX idx_public ON datasets');
        $this->addSql('DROP INDEX idx_status ON datasets');
        $this->addSql('ALTER TABLE datasets ADD source VARCHAR(500) DEFAULT NULL, ADD filepath VARCHAR(255) DEFAULT NULL, ADD data JSON DEFAULT NULL, ADD uploaded_at DATETIME NOT NULL, DROP original_filename, DROP file_path, DROP mime_type, DROP size_bytes, DROP public, DROP error_message, DROP created_at, CHANGE description description LONGTEXT DEFAULT NULL, CHANGE filename filename VARCHAR(255) DEFAULT NULL, CHANGE row_count row_count INT DEFAULT NULL, CHANGE status status VARCHAR(50) NOT NULL, CHANGE columns_info variables JSON NOT NULL, CHANGE updated_at validated_at DATETIME DEFAULT NULL, CHANGE provider_id uploader_id INT NOT NULL');
        $this->addSql('ALTER TABLE datasets ADD CONSTRAINT FK_9D6ABD9E16678C77 FOREIGN KEY (uploader_id) REFERENCES users (id)');
        $this->addSql('CREATE INDEX IDX_9D6ABD9E16678C77 ON datasets (uploader_id)');
        $this->addSql('ALTER TABLE media DROP FOREIGN KEY `media_ibfk_1`');
        $this->addSql('DROP INDEX idx_uploaded_by ON media');
        $this->addSql('DROP INDEX idx_mime_type ON media');
        $this->addSql('ALTER TABLE media ADD path VARCHAR(255) NOT NULL, ADD tags JSON DEFAULT NULL, ADD type VARCHAR(50) NOT NULL, ADD uploaded_at DATETIME NOT NULL, ADD uploaded_by_id INT NOT NULL, DROP file_path, DROP size_bytes, DROP alt_text, DROP created_at, CHANGE original_filename name VARCHAR(255) NOT NULL, CHANGE uploaded_by size INT NOT NULL');
        $this->addSql('ALTER TABLE media ADD CONSTRAINT FK_6A2CA10CA2B28FE8 FOREIGN KEY (uploaded_by_id) REFERENCES users (id)');
        $this->addSql('CREATE INDEX IDX_6A2CA10CA2B28FE8 ON media (uploaded_by_id)');
        $this->addSql('ALTER TABLE ratings DROP FOREIGN KEY `ratings_ibfk_1`');
        $this->addSql('ALTER TABLE ratings DROP FOREIGN KEY `ratings_ibfk_2`');
        $this->addSql('DROP INDEX unique_user_article ON ratings');
        $this->addSql('ALTER TABLE ratings ADD block_id INT DEFAULT NULL, CHANGE article_id article_id INT DEFAULT NULL, CHANGE stars stars INT NOT NULL, CHANGE comment comment LONGTEXT DEFAULT NULL, CHANGE created_at created_at DATETIME NOT NULL');
        $this->addSql('ALTER TABLE ratings ADD CONSTRAINT FK_CEB607C9A76ED395 FOREIGN KEY (user_id) REFERENCES users (id)');
        $this->addSql('ALTER TABLE ratings ADD CONSTRAINT FK_CEB607C97294869C FOREIGN KEY (article_id) REFERENCES articles (id)');
        $this->addSql('ALTER TABLE ratings ADD CONSTRAINT FK_CEB607C9E9ED820C FOREIGN KEY (block_id) REFERENCES blocks (id)');
        $this->addSql('CREATE INDEX IDX_CEB607C9E9ED820C ON ratings (block_id)');
        $this->addSql('ALTER TABLE ratings RENAME INDEX article_id TO IDX_CEB607C97294869C');
        $this->addSql('DROP INDEX idx_email ON users');
        $this->addSql('ALTER TABLE users DROP is_active, CHANGE subscription_level subscription_level VARCHAR(50) DEFAULT NULL, CHANGE created_at created_at DATETIME NOT NULL');
        $this->addSql('ALTER TABLE users RENAME INDEX email TO UNIQ_1483A5E9E7927C74');
        $this->addSql('ALTER TABLE visualizations DROP FOREIGN KEY `visualizations_ibfk_1`');
        $this->addSql('ALTER TABLE visualizations DROP FOREIGN KEY `visualizations_ibfk_2`');
        $this->addSql('DROP INDEX idx_type ON visualizations');
        $this->addSql('DROP INDEX idx_created_by ON visualizations');
        $this->addSql('ALTER TABLE visualizations ADD description LONGTEXT DEFAULT NULL, ADD selected_variables JSON DEFAULT NULL, ADD colors JSON DEFAULT NULL, ADD options JSON DEFAULT NULL, CHANGE type type VARCHAR(50) NOT NULL, CHANGE created_at created_at DATETIME NOT NULL, CHANGE updated_at updated_at DATETIME NOT NULL, CHANGE created_by created_by_id INT NOT NULL');
        $this->addSql('ALTER TABLE visualizations ADD CONSTRAINT FK_6D321DF7D47C2D1B FOREIGN KEY (dataset_id) REFERENCES datasets (id)');
        $this->addSql('ALTER TABLE visualizations ADD CONSTRAINT FK_6D321DF7B03A8386 FOREIGN KEY (created_by_id) REFERENCES users (id)');
        $this->addSql('CREATE INDEX IDX_6D321DF7B03A8386 ON visualizations (created_by_id)');
        $this->addSql('ALTER TABLE visualizations RENAME INDEX idx_dataset TO IDX_6D321DF7D47C2D1B');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE article_comments (id INT AUTO_INCREMENT NOT NULL, article_id INT NOT NULL, user_id INT NOT NULL, content TEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_0900_ai_ci`, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, INDEX idx_article (article_id), INDEX user_id (user_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_0900_ai_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE matches (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, game ENUM(\'valorant\', \'cs2\', \'r6\') CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_0900_ai_ci`, result ENUM(\'win\', \'loss\', \'draw\') CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_0900_ai_ci`, kills INT DEFAULT 0, deaths INT DEFAULT 0, assists INT DEFAULT 0, played_at DATETIME DEFAULT CURRENT_TIMESTAMP, INDEX user_id (user_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_0900_ai_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE user_sessions (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, login_at DATETIME DEFAULT CURRENT_TIMESTAMP, logout_at DATETIME DEFAULT NULL, ip_address VARCHAR(45) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_0900_ai_ci`, user_agent TEXT CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_0900_ai_ci`, INDEX user_id (user_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_0900_ai_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE article_comments ADD CONSTRAINT `article_comments_ibfk_1` FOREIGN KEY (article_id) REFERENCES articles (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE article_comments ADD CONSTRAINT `article_comments_ibfk_2` FOREIGN KEY (user_id) REFERENCES users (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE matches ADD CONSTRAINT `matches_ibfk_1` FOREIGN KEY (user_id) REFERENCES users (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_sessions ADD CONSTRAINT `user_sessions_ibfk_1` FOREIGN KEY (user_id) REFERENCES users (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE blocks DROP FOREIGN KEY FK_CEED95787294869C');
        $this->addSql('ALTER TABLE blocks DROP FOREIGN KEY FK_CEED9578EA9FDD75');
        $this->addSql('ALTER TABLE blocks DROP FOREIGN KEY FK_CEED9578B695AE45');
        $this->addSql('ALTER TABLE themes DROP FOREIGN KEY FK_154232DEB03A8386');
        $this->addSql('DROP TABLE blocks');
        $this->addSql('DROP TABLE themes');
        $this->addSql('DROP TABLE welcome_config');
        $this->addSql('ALTER TABLE articles DROP FOREIGN KEY FK_BFDD3168F675F31B');
        $this->addSql('ALTER TABLE articles DROP FOREIGN KEY FK_BFDD316859027487');
        $this->addSql('DROP INDEX IDX_BFDD316859027487 ON articles');
        $this->addSql('ALTER TABLE articles ADD blocks JSON DEFAULT NULL, CHANGE summary summary TEXT NOT NULL, CHANGE type type VARCHAR(50) DEFAULT \'standard\' NOT NULL, CHANGE game game VARCHAR(50) DEFAULT \'general\', CHANGE status status ENUM(\'draft\', \'review\', \'published\', \'archived\') DEFAULT \'draft\', CHANGE view_count view_count INT DEFAULT 0, CHANGE created_at created_at DATETIME DEFAULT CURRENT_TIMESTAMP, CHANGE updated_at updated_at DATETIME DEFAULT NULL');
        $this->addSql('ALTER TABLE articles ADD CONSTRAINT `articles_ibfk_1` FOREIGN KEY (author_id) REFERENCES users (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('CREATE INDEX idx_status ON articles (status)');
        $this->addSql('CREATE INDEX idx_type ON articles (type)');
        $this->addSql('CREATE INDEX idx_game ON articles (game)');
        $this->addSql('ALTER TABLE articles RENAME INDEX idx_bfdd3168f675f31b TO idx_author');
        $this->addSql('ALTER TABLE comments DROP FOREIGN KEY FK_5F9E962AF675F31B');
        $this->addSql('DROP INDEX IDX_5F9E962AF675F31B ON comments');
        $this->addSql('ALTER TABLE comments CHANGE content content TEXT NOT NULL, CHANGE created_at created_at DATETIME DEFAULT CURRENT_TIMESTAMP, CHANGE updated_at updated_at DATETIME DEFAULT NULL, CHANGE is_edited is_edited TINYINT(1) DEFAULT 0, CHANGE author_id user_id INT NOT NULL');
        $this->addSql('ALTER TABLE comments ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (user_id) REFERENCES users (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('CREATE INDEX idx_user ON comments (user_id)');
        $this->addSql('ALTER TABLE comments RENAME INDEX idx_5f9e962a7294869c TO idx_article');
        $this->addSql('ALTER TABLE datasets DROP FOREIGN KEY FK_9D6ABD9E16678C77');
        $this->addSql('DROP INDEX IDX_9D6ABD9E16678C77 ON datasets');
        $this->addSql('ALTER TABLE datasets ADD original_filename VARCHAR(255) NOT NULL, ADD file_path VARCHAR(500) NOT NULL, ADD mime_type VARCHAR(100) NOT NULL, ADD size_bytes BIGINT NOT NULL, ADD public TINYINT(1) DEFAULT 0, ADD error_message TEXT DEFAULT NULL, ADD created_at DATETIME DEFAULT CURRENT_TIMESTAMP, DROP source, DROP filepath, DROP data, DROP uploaded_at, CHANGE description description TEXT DEFAULT NULL, CHANGE filename filename VARCHAR(255) NOT NULL, CHANGE row_count row_count INT DEFAULT 0, CHANGE status status ENUM(\'processing\', \'ready\', \'error\') DEFAULT \'processing\', CHANGE variables columns_info JSON NOT NULL, CHANGE uploader_id provider_id INT NOT NULL, CHANGE validated_at updated_at DATETIME DEFAULT NULL');
        $this->addSql('ALTER TABLE datasets ADD CONSTRAINT `datasets_ibfk_1` FOREIGN KEY (provider_id) REFERENCES users (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('CREATE INDEX idx_provider ON datasets (provider_id)');
        $this->addSql('CREATE INDEX idx_public ON datasets (public)');
        $this->addSql('CREATE INDEX idx_status ON datasets (status)');
        $this->addSql('ALTER TABLE media DROP FOREIGN KEY FK_6A2CA10CA2B28FE8');
        $this->addSql('DROP INDEX IDX_6A2CA10CA2B28FE8 ON media');
        $this->addSql('ALTER TABLE media ADD original_filename VARCHAR(255) NOT NULL, ADD file_path VARCHAR(500) NOT NULL, ADD size_bytes BIGINT NOT NULL, ADD alt_text VARCHAR(255) DEFAULT NULL, ADD uploaded_by INT NOT NULL, ADD created_at DATETIME DEFAULT CURRENT_TIMESTAMP, DROP name, DROP path, DROP size, DROP tags, DROP type, DROP uploaded_at, DROP uploaded_by_id');
        $this->addSql('ALTER TABLE media ADD CONSTRAINT `media_ibfk_1` FOREIGN KEY (uploaded_by) REFERENCES users (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('CREATE INDEX idx_uploaded_by ON media (uploaded_by)');
        $this->addSql('CREATE INDEX idx_mime_type ON media (mime_type)');
        $this->addSql('ALTER TABLE ratings DROP FOREIGN KEY FK_CEB607C9A76ED395');
        $this->addSql('ALTER TABLE ratings DROP FOREIGN KEY FK_CEB607C97294869C');
        $this->addSql('ALTER TABLE ratings DROP FOREIGN KEY FK_CEB607C9E9ED820C');
        $this->addSql('DROP INDEX IDX_CEB607C9E9ED820C ON ratings');
        $this->addSql('ALTER TABLE ratings DROP block_id, CHANGE stars stars INT DEFAULT NULL, CHANGE comment comment TEXT DEFAULT NULL, CHANGE created_at created_at DATETIME DEFAULT CURRENT_TIMESTAMP, CHANGE article_id article_id INT NOT NULL');
        $this->addSql('ALTER TABLE ratings ADD CONSTRAINT `ratings_ibfk_1` FOREIGN KEY (user_id) REFERENCES users (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE ratings ADD CONSTRAINT `ratings_ibfk_2` FOREIGN KEY (article_id) REFERENCES articles (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('CREATE UNIQUE INDEX unique_user_article ON ratings (user_id, article_id)');
        $this->addSql('ALTER TABLE ratings RENAME INDEX idx_ceb607c97294869c TO article_id');
        $this->addSql('ALTER TABLE users ADD is_active TINYINT(1) DEFAULT 1, CHANGE subscription_level subscription_level ENUM(\'bronze\', \'silver\', \'gold\') DEFAULT \'bronze\', CHANGE created_at created_at DATETIME DEFAULT CURRENT_TIMESTAMP');
        $this->addSql('CREATE INDEX idx_email ON users (email)');
        $this->addSql('ALTER TABLE users RENAME INDEX uniq_1483a5e9e7927c74 TO email');
        $this->addSql('ALTER TABLE visualizations DROP FOREIGN KEY FK_6D321DF7D47C2D1B');
        $this->addSql('ALTER TABLE visualizations DROP FOREIGN KEY FK_6D321DF7B03A8386');
        $this->addSql('DROP INDEX IDX_6D321DF7B03A8386 ON visualizations');
        $this->addSql('ALTER TABLE visualizations DROP description, DROP selected_variables, DROP colors, DROP options, CHANGE type type ENUM(\'barchart\', \'piechart\', \'scatterplot\', \'histogram\') NOT NULL, CHANGE created_at created_at DATETIME DEFAULT CURRENT_TIMESTAMP, CHANGE updated_at updated_at DATETIME DEFAULT NULL, CHANGE created_by_id created_by INT NOT NULL');
        $this->addSql('ALTER TABLE visualizations ADD CONSTRAINT `visualizations_ibfk_1` FOREIGN KEY (dataset_id) REFERENCES datasets (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE visualizations ADD CONSTRAINT `visualizations_ibfk_2` FOREIGN KEY (created_by) REFERENCES users (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('CREATE INDEX idx_type ON visualizations (type)');
        $this->addSql('CREATE INDEX idx_created_by ON visualizations (created_by)');
        $this->addSql('ALTER TABLE visualizations RENAME INDEX idx_6d321df7d47c2d1b TO idx_dataset');
    }
}
