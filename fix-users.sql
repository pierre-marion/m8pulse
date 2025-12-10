-- Mettre à jour tous les utilisateurs existants pour avoir la colonne roles basée sur role
UPDATE users 
SET roles = CASE role
    WHEN 'admin' THEN JSON_ARRAY('ROLE_ADMIN')
    WHEN 'editor' THEN JSON_ARRAY('ROLE_EDITOR')
    WHEN 'author' THEN JSON_ARRAY('ROLE_AUTHOR')
    WHEN 'subscriber' THEN JSON_ARRAY('ROLE_SUBSCRIBER')
    WHEN 'visitor' THEN JSON_ARRAY('ROLE_VISITOR')
    ELSE JSON_ARRAY('ROLE_USER')
END
WHERE roles IS NULL;

-- Créer un utilisateur admin (password: admin123)
INSERT IGNORE INTO users (email, username, password, role, roles, subscription_level, created_at)
VALUES ('admin@m8pulse.com', 'Admin', '$2y$13$qX8vGxWHyKZm5rN9zL4CbO5Y3h4MdVJ8fQa.wVf4GKLxY1vF3F0pW', 'admin', JSON_ARRAY('ROLE_ADMIN'), 'gold', NOW());
