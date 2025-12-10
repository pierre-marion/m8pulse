<?php
require_once '../src/Database.php';

try {
    $database = new Database();
    $pdo = $database->getConnection();
    
    echo "=== Test de connexion à la base de données ===\n";
    
    // Vérifier la connexion
    $stmt = $pdo->query("SELECT 1");
    echo "✅ Connexion réussie\n";
    
    // Lister les tables
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo "📋 Tables disponibles: " . implode(', ', $tables) . "\n";
    
    // Compter les utilisateurs
    $stmt = $pdo->query("SELECT COUNT(*) FROM users");
    $userCount = $stmt->fetchColumn();
    echo "👥 Nombre d'utilisateurs: $userCount\n";
    
    // Lister les utilisateurs
    $stmt = $pdo->query("SELECT id, email, username, roles FROM users");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "\n=== Utilisateurs existants ===\n";
    foreach ($users as $user) {
        echo "ID: {$user['id']}, Email: {$user['email']}, Username: {$user['username']}, Roles: {$user['roles']}\n";
    }
    
    // Créer/mettre à jour un admin avec un mot de passe simple
    $adminEmail = 'admin@m8pulse.fr';
    $adminPassword = 'admin123';
    $hashedPassword = password_hash($adminPassword, PASSWORD_DEFAULT);
    
    // Vérifier si l'admin existe
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$adminEmail]);
    $existingAdmin = $stmt->fetch();
    
    if ($existingAdmin) {
        // Mettre à jour le mot de passe
        $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE email = ?");
        $stmt->execute([$hashedPassword, $adminEmail]);
        echo "\n✅ Mot de passe admin mis à jour\n";
    } else {
        // Créer l'admin
        $stmt = $pdo->prepare("INSERT INTO users (email, username, password, roles, subscription_level) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([
            $adminEmail,
            'Administrateur',
            $hashedPassword,
            json_encode(['admin']),
            'gold'
        ]);
        echo "\n✅ Admin créé\n";
    }
    
    echo "\n=== Identifiants de test ===\n";
    echo "Email: $adminEmail\n";
    echo "Mot de passe: $adminPassword\n";
    
} catch (Exception $e) {
    echo "❌ Erreur: " . $e->getMessage() . "\n";
}
?>