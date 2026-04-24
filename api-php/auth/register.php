<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://dev3.icreative.es'); // Específico
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

// Manejar preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../shared/Database.php';
require_once __DIR__ . '/../shared/Mailer.php';

$db = new Database();
$mailer = new Mailer();

try {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['email']) || !isset($data['password'])) {
        throw new Exception('Email and password required');
    }
    
    $email = trim($data['email']);
    $password = $data['password'];

    $password_hash = password_hash($password, PASSWORD_BCRYPT);

    $query = "SELECT id FROM users WHERE email = :email";

    $exist = $db->fetchSingle($query, [':email' => $email]);

    if ($exist) {
        throw new Exception('El email ya existe.');
    }

    $queryRole = "SELECT name FROM roles WHERE id = :id";

    $role = $db->fetchSingle($queryRole, [':id' => 1]);

    if (!$role) {
        throw new Exception('No se encuentra el rol');
    }

    $params = array();
    $params['email'] = trim($data['email']);
    $params['password_hash'] = $password_hash;

    $queryNew = "INSERT INTO users (email, password_hash, role_id, is_active, created_at, updated_at)
                VALUES (:email, :password_hash, 1, 1, NOW(), NOW())";

    $new = $db->execute($queryNew, $params);

    $lastId = $db->lastId();

    $mailer->send(
        $email,
        $email,
        'Bienvenido/a - EscapeBooking',
        "Hola,\n\nTu cuenta ha sido creada correctamente.\n\nYa puedes acceder con tu email: $email"
    );

    $token = base64_encode(json_encode([
        'user_id' => $lastId,
        'email' => $email,
        'role_name' => $role['name'],
        'exp' => time() + (24 * 60 * 60) 
    ]));

    echo json_encode([
        'success' => true,
        'message' => 'Registration successful',
        'data' => [
            'user' => ['id' => $lastId, 'email' => $email, 'role_name' => $role['name']],
            'token' => $token
        ]
    ]);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}


