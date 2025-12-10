<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');

require_once '../src/Database.php';

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    $query = "SELECT id, email, username, roles, subscription_level FROM users";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'status' => 'success',
        'users' => $users
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Erreur : ' . $e->getMessage()
    ]);
}
?>