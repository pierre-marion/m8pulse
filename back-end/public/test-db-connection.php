<?php
require_once '../src/Database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    echo "✅ Connexion à la base de données réussie!\n\n";
    
    // Tester les utilisateurs
    $stmt = $db->prepare("SELECT id, email, username, roles FROM users LIMIT 3");
    $stmt->execute();
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "👥 Utilisateurs en base:\n";
    foreach ($users as $user) {
        $roles = json_decode($user['roles'], true);
        echo "- {$user['id']}: {$user['email']} ({$user['username']}) - Rôles: " . implode(', ', $roles) . "\n";
    }
    
    // Tester password_verify avec le hash existant
    $stmt = $db->prepare("SELECT password FROM users WHERE email = 'admin@m8pulse.fr'");
    $stmt->execute();
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($admin) {
        echo "\n🔐 Test des mots de passe pour admin@m8pulse.fr:\n";
        echo "Hash en base: " . substr($admin['password'], 0, 30) . "...\n";
        
        $passwords = ['password', 'secret', 'admin', 'm8pulse', '123456'];
        foreach ($passwords as $pwd) {
            $result = password_verify($pwd, $admin['password']);
            echo "- '$pwd': " . ($result ? "✅ VALIDE" : "❌ Invalide") . "\n";
        }
    }
    
    // Tester les nouvelles tables
    echo "\n📊 Tables CMS:\n";
    $tables = ['articles', 'datasets', 'media', 'visualizations'];
    foreach ($tables as $table) {
        try {
            $stmt = $db->prepare("SELECT COUNT(*) as count FROM $table");
            $stmt->execute();
            $count = $stmt->fetch(PDO::FETCH_ASSOC);
            echo "- $table: {$count['count']} entrées\n";
        } catch (Exception $e) {
            echo "- $table: ❌ Erreur - " . $e->getMessage() . "\n";
        }
    }
    
} catch (Exception $e) {
    echo "❌ Erreur: " . $e->getMessage() . "\n";
}
?>