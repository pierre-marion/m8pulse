-- M8Pulse - Base de données
-- Stats FPS Gentlemates

CREATE DATABASE IF NOT EXISTS m8pulse CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE m8pulse;

-- Table utilisateurs avec les nouveaux rôles
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(180) UNIQUE NOT NULL,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('visitor', 'subscriber', 'author', 'editor', 'designer', 'data_provider', 'admin') DEFAULT 'visitor',
    subscription_level ENUM('bronze', 'silver', 'gold') DEFAULT 'bronze',
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table datasets pour les données CSV/JSON
CREATE TABLE datasets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    size_bytes BIGINT NOT NULL,
    row_count INT DEFAULT 0,
    columns_info JSON NOT NULL, -- [{name: "column", type: "string|number|date", description: "..."}]
    provider_id INT NOT NULL,
    public BOOLEAN DEFAULT FALSE,
    status ENUM('processing', 'ready', 'error') DEFAULT 'processing',
    error_message TEXT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (provider_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_provider (provider_id),
    INDEX idx_public (public),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table articles de data storytelling
CREATE TABLE articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    type ENUM('classic', 'dashboard') DEFAULT 'classic',
    author_id INT NOT NULL,
    status ENUM('draft', 'review', 'published', 'archived') DEFAULT 'draft',
    blocks JSON NOT NULL, -- Structure: [{"type": "title|text|image|visualization", "content": {...}}]
    view_count INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
    published_at DATETIME NULL,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_type (type),
    INDEX idx_author (author_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table ratings (notes des abonnés)
CREATE TABLE ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    article_id INT NOT NULL,
    block_index INT NOT NULL,
    stars INT CHECK (stars >= 0 AND stars <= 5),
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Données de démonstration
-- ATTENTION: Changez ces mots de passe en production !
INSERT INTO users (email, username, password, roles, subscription_level) VALUES
('admin@m8pulse.fr', 'Administrateur', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', JSON_ARRAY('admin'), 'gold'),
('user@m8pulse.fr', 'Utilisateur Test', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', JSON_ARRAY('user'), 'silver'),
('pro@m8pulse.fr', 'Pro Player', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', JSON_ARRAY('user'), 'gold');

-- Table des matchs pour les statistiques
CREATE TABLE matches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    game ENUM('valorant', 'cs2', 'r6') NOT NULL,
    result ENUM('win', 'loss', 'draw') NOT NULL,
    kills INT DEFAULT 0,
    deaths INT DEFAULT 0,
    assists INT DEFAULT 0,
    played_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table des sessions utilisateur pour le dashboard
CREATE TABLE user_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    login_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    logout_at DATETIME NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Données de test pour les matchs
INSERT INTO matches (user_id, game, result, kills, deaths, assists) VALUES
(2, 'valorant', 'win', 24, 12, 8),
(2, 'valorant', 'loss', 16, 18, 5),
(2, 'cs2', 'win', 28, 14, 12),
(2, 'r6', 'loss', 12, 15, 3),
(3, 'valorant', 'win', 32, 8, 15),
(3, 'cs2', 'win', 26, 11, 9);

-- Données de test pour les sessions
INSERT INTO user_sessions (user_id, login_at, ip_address) VALUES
(1, '2025-10-24 16:30:00', '127.0.0.1'),
(2, '2025-10-24 15:45:00', '127.0.0.1'),
(3, '2025-10-24 16:25:00', '127.0.0.1');

-- Tables additionnelles pour le CMS de data storytelling

-- Table pour stocker les médias (images, videos)
CREATE TABLE media (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    size_bytes BIGINT NOT NULL,
    alt_text VARCHAR(255),
    uploaded_by INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_mime_type (mime_type),
    INDEX idx_uploaded_by (uploaded_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table pour les visualisations sauvegardées
CREATE TABLE visualizations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type ENUM('barchart', 'piechart', 'scatterplot', 'histogram') NOT NULL,
    dataset_id INT NOT NULL,
    config JSON NOT NULL, -- Configuration de la visualisation (colonnes, couleurs, options)
    created_by INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (dataset_id) REFERENCES datasets(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_type (type),
    INDEX idx_dataset (dataset_id),
    INDEX idx_created_by (created_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table pour les commentaires sur les articles
CREATE TABLE article_comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    article_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_article (article_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insérer des données d'exemple pour les datasets
INSERT INTO datasets (name, description, filename, original_filename, file_path, mime_type, size_bytes, row_count, columns_info, provider_id, public, status) VALUES
('Stats Match Gentlemates vs Vitality', 'Statistiques détaillées du match GM vs VIT sur Dust2', 'match1_stats.csv', 'GM_vs_VIT_dust2_stats.csv', '/data/match1_stats.csv', 'text/csv', 2048, 25,
 '[{"name":"player","type":"string","description":"Nom du joueur"},{"name":"team","type":"string","description":"Équipe"},{"name":"kills","type":"number","description":"Nombre de kills"},{"name":"deaths","type":"number","description":"Nombre de morts"},{"name":"assists","type":"number","description":"Nombre d\'assists"},{"name":"adr","type":"number","description":"Average Damage per Round"}]', 
 1, TRUE, 'ready'),
('Performance équipe Gentlemates S1 2024', 'Données de performance de l\'équipe GM sur la saison 1 2024', 'team_perf.json', 'gm_season1_2024.json', '/data/team_perf.json', 'application/json', 1024, 50,
 '[{"name":"match_date","type":"date","description":"Date du match"},{"name":"opponent","type":"string","description":"Équipe adverse"},{"name":"map","type":"string","description":"Carte jouée"},{"name":"result","type":"string","description":"Victoire ou défaite"},{"name":"team_score","type":"number","description":"Score de l\'équipe"},{"name":"opponent_score","type":"number","description":"Score de l\'adversaire"}]', 
 2, FALSE, 'ready');

-- Données d'exemple pour les articles
INSERT INTO articles (title, summary, type, author_id, status, blocks) VALUES
('Analyse de la performance Gentlemates vs Vitality', 'Analyse détaillée des statistiques du match GM vs VIT sur Dust2', 'dashboard', 1, 'published',
 '[{"type":"title","content":{"text":"Performance Gentlemates vs Vitality","level":1}},{"type":"text","content":{"text":"Ce match sur Dust2 a été particulièrement intense..."}},{"type":"visualization","content":{"visualization_id":1,"caption":"Répartition des kills par joueur"}}]'),
('Guide tactique : Contrôle de map sur Mirage', 'Stratégies avancées pour dominer la carte Mirage', 'classic', 2, 'published',
 '[{"type":"title","content":{"text":"Maîtriser Mirage","level":1}},{"type":"text","content":{"text":"Mirage est une carte équilibrée qui demande..."}}]');
