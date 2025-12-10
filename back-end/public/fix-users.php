<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');

require_once '../src/Database.php';

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    // Supprimer les anciens utilisateurs
    $conn->exec("DELETE FROM users");
    
    // Créer les nouveaux utilisateurs avec les bons emails et mots de passe
    $adminPassword = password_hash('admin123', PASSWORD_DEFAULT);
    $userPassword = password_hash('user123', PASSWORD_DEFAULT);
    
    $query = "INSERT INTO users (email, username, password, roles, subscription_level) VALUES
              ('admin@m8pulse.fr', 'Administrateur', :admin_password, JSON_ARRAY('admin'), 'gold'),
              ('user@m8pulse.fr', 'Utilisateur Test', :user_password, JSON_ARRAY('user'), 'silver'),
              ('pro@m8pulse.fr', 'Pro Player', :user_password, JSON_ARRAY('user'), 'gold')";
    
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':admin_password', $adminPassword);
    $stmt->bindParam(':user_password', $userPassword);
    
    if ($stmt->execute()) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Utilisateurs mis à jour avec succès',
            'passwords' => [
                'admin@m8pulse.fr' => 'admin123',
                'user@m8pulse.fr' => 'user123',
                'pro@m8pulse.fr' => 'user123'
            ]
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Erreur lors de la mise à jour'
        ]);
    }
    
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Erreur : ' . $e->getMessage()
    ]);
}
?>