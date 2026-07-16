<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000'); // Específico
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, X-Auth-Token');
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
    
    if (!isset($data['password']) || !isset($data['token'])) {
        throw new Exception('el campo contraseña es obligatorio');
    }
    
    $password = trim($data['password']);
    $password_hash = password_hash($password, PASSWORD_BCRYPT);
    $token = trim($data['token']);
    
    // Check if user exists and is active
    $query = "SELECT * FROM users WHERE reset_token = :token AND reset_token_expires_at > NOW()";
    $user = $db->fetchSingle($query, [':token' => $token]);
    
    if (!$user) {
        throw new Exception('Usuario no encontrado o inactivo');
    }

    $params = [
        'user_id' => $user['id'],
        'password' => $password_hash
    ];
    $query = "UPDATE users SET reset_token = null, reset_token_expires_at = null, password_hash = :password WHERE id = :user_id";
    $db->execute($query, array_merge($params));

    $res = $mailer->send(
      $user['email'],
      'cliente',
      'Confirmación de cambio de contraseña - EscapeBooking',
      "Estimado cliente.\n\nHas cambiado correctamente la contraseña de acceso a EscapeBooking.\n\nUn saludo."
    );

    echo json_encode([
        'success' => true,
        'message' => 'Contraseña restablecida correctamente.'
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}