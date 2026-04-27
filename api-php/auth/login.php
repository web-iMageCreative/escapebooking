<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000'); // Específico
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

// Manejar preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../shared/Database.php';

$db = new Database();

try {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['email']) || !isset($data['password'])) {
        throw new Exception('Email and password required');
    }
    
    $email = trim($data['email']);
    $password = $data['password'];
    
    // Get user with role
    $query = "SELECT u.*, r.name as role_name 
              FROM users u 
              JOIN roles r ON u.role_id = r.id 
              WHERE u.email = :email AND u.is_active = 1";
    
    $user = $db->fetchSingle($query, [':email' => $email]);
    
    if (!$user) {
        throw new Exception('Invalid credentials');
    }
    
    // Verify password (using the known hash for 'password')
    if (!password_verify($password, $user['password_hash'])) {
        throw new Exception('Invalid credentials');
    }
    
    // Remove password hash from response
    unset($user['password_hash']);
    
    // Generate simple token (in production use JWT)
    $token = base64_encode(json_encode([
        'user_id' => $user['id'],
        'email' => $user['email'],
        'role' => $user['role_name'],
        'exp' => time() + (24 * 60 * 60) // 24 hours
    ]));
    
    echo json_encode([
        'success' => true,
        'message' => 'Login successful',
        'data' => [
            'user' => $user,
            'token' => $token
        ]
    ]);
    
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>