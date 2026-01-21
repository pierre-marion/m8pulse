<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Migration to align media table with Media entity schema
 */
final class Version20260105200000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Align media table schema with Media entity (add name column, rename columns)';
    }

    public function up(Schema $schema): void
    {
        // Transform init.sql schema to match Media entity schema
        // init.sql has: filename, original_filename, file_path, size_bytes, uploaded_by, created_at, alt_text
        // Entity needs: name, filename, path, mime_type, size, tags, type, uploaded_at, uploaded_by_id
        
        // Add 'name' column (init.sql doesn't have it)
        $this->addSql('ALTER TABLE media ADD name VARCHAR(255) NOT NULL DEFAULT ""');
        
        // Populate 'name' with original_filename values
        $this->addSql('UPDATE media SET name = original_filename WHERE name = ""');
        
        // Rename 'file_path' to 'path'
        $this->addSql('ALTER TABLE media CHANGE file_path path VARCHAR(255) NOT NULL');
        
        // Rename 'size_bytes' to 'size' and change type from BIGINT to INT
        $this->addSql('ALTER TABLE media CHANGE size_bytes size INT NOT NULL');
        
        // Add 'type' column (will default to 'image')
        $this->addSql('ALTER TABLE media ADD type VARCHAR(50) NOT NULL DEFAULT "image"');
        
        // Add 'tags' column (JSON)
        $this->addSql('ALTER TABLE media ADD tags JSON DEFAULT NULL');
        
        // Rename 'created_at' to 'uploaded_at'
        $this->addSql('ALTER TABLE media CHANGE created_at uploaded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP');
        
        // Rename 'uploaded_by' to 'uploaded_by_id'
        $this->addSql('ALTER TABLE media CHANGE uploaded_by uploaded_by_id INT NOT NULL');
        
        // Drop 'alt_text' (not used in entity)
        $this->addSql('ALTER TABLE media DROP COLUMN alt_text');
        
        // Keep 'filename' as is (already exists in init.sql)
        // Drop 'original_filename' as we've copied it to 'name'
        $this->addSql('ALTER TABLE media DROP COLUMN original_filename');
    }

    public function down(Schema $schema): void
    {
        // Revert changes back to init.sql schema
        $this->addSql('ALTER TABLE media ADD original_filename VARCHAR(255) NOT NULL DEFAULT ""');
        $this->addSql('UPDATE media SET original_filename = name');
        $this->addSql('ALTER TABLE media DROP COLUMN name');
        $this->addSql('ALTER TABLE media CHANGE path file_path VARCHAR(500) NOT NULL');
        $this->addSql('ALTER TABLE media CHANGE size size_bytes BIGINT NOT NULL');
        $this->addSql('ALTER TABLE media DROP COLUMN type');
        $this->addSql('ALTER TABLE media DROP COLUMN tags');
        $this->addSql('ALTER TABLE media CHANGE uploaded_at created_at DATETIME DEFAULT CURRENT_TIMESTAMP');
        $this->addSql('ALTER TABLE media CHANGE uploaded_by_id uploaded_by INT NOT NULL');
        $this->addSql('ALTER TABLE media ADD alt_text VARCHAR(255)');
    }
}
