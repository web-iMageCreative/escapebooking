<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000'); // Específico
header('Access-Control-Allow-Methods: POST');
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
    
    if (!isset($data['email'])) {
        throw new Exception('El email es obligatorio');
    }
    
    $email = trim($data['email']);
    
    // Check if user exists and is active
    $query = "SELECT * FROM users WHERE email = :email AND is_active = 1";
    $user = $db->fetchSingle($query, [':email' => $email]);
    
    if (!$user) {
        throw new Exception('Usuario no encontrado o inactivo');
    }

    $token = bin2hex(random_bytes(16)); // Generar un token seguro

    $params = [
        'token' => $token,
        'user_id' => $user['id'],
        'expires_at' => date('Y-m-d H:i:s', strtotime('+1 hour')) // Token válido por 1 hora
    ];
    $query = "UPDATE users SET reset_token = :token, reset_token_expires_at = :expires_at WHERE id = :user_id";
    $db->execute($query, $params);

    $res = $mailer->send(
      $user['email'],
      'cliente',
      'Confirmación de Reserva - EscapeBooking',
      "Estimado cliente.\n\nHas solicitado un cambio de contraseña de acceso a EscapeBooking.\n\nPor favor, haz clic en el siguiente enlace para restablecer tu contraseña:\n\nhttp://localhost:3000/reset-password/{$token}\n\nEste enlace expirará en 1 hora."
    );

    echo json_encode([
        'success' => true,
        'message' => 'Link para restablecer contraseña ha sido enviado a su correo electrónico.'
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
