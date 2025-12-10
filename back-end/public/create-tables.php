<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');

require_once '../src/Database.php';

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    // Créer les tables manquantes
    $sql = "
    CREATE TABLE IF NOT EXISTS matches (
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

    CREATE TABLE IF NOT EXISTS user_sessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        login_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        logout_at DATETIME NULL,
        ip_address VARCHAR(45),
        user_agent TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ";
    
    $conn->exec($sql);
    
    // Ajouter des données de test pour les matchs
    $matchesData = "
    INSERT IGNORE INTO matches (user_id, game, result, kills, deaths, assists) VALUES
    (2, 'valorant', 'win', 24, 12, 8),
    (2, 'valorant', 'loss', 16, 18, 5),
    (2, 'cs2', 'win', 28, 14, 12),
    (2, 'r6', 'loss', 12, 15, 3),
    (3, 'valorant', 'win', 32, 8, 15),
    (3, 'cs2', 'win', 26, 11, 9);
    ";
    
    $conn->exec($matchesData);
    
    echo json_encode([
        'status' => 'success',
        'message' => 'Tables créées avec succès'
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Erreur : ' . $e->getMessage()
    ]);
}
?>