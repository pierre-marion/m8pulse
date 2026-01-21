-- Migration pour ajouter la colonne source à la table datasets
-- Date: 2026-01-21

USE m8pulse;

-- Vérifier si la colonne existe déjà
SET @dbname = DATABASE();
SET @tablename = "datasets";
SET @columnname = "source";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  "SELECT 'La colonne source existe déjà' AS message;",
  "ALTER TABLE datasets ADD COLUMN source VARCHAR(500) NULL AFTER description;"
));

PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Vérifier que la colonne a bien été ajoutée
SELECT 
    COLUMN_NAME, 
    COLUMN_TYPE, 
    IS_NULLABLE, 
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'm8pulse'
  AND TABLE_NAME = 'datasets'
  AND COLUMN_NAME = 'source';
