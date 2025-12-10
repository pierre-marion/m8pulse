<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');

require_once '../src/Database.php';

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    if ($conn) {
        // Tester la requête
        $query = "SELECT COUNT(*) as count FROM users";
        $stmt = $conn->prepare($query);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'status' => 'success',
            'message' => 'Base de données connectée',
            'users_count' => $result['count']
        ]);
    } else {
        echo json_encode([
            'status' => 'error', 
            'message' => 'Impossible de se connecter à la base de données'
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Erreur : ' . $e->getMessage()
    ]);
}
?>