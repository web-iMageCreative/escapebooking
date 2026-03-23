<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://dev2.icreative.es');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

require_once __DIR__ . '/../shared/Database.php';

$clientId     = 'AcVoDh51dfGFZRauylq59NZYdjJAJZRHES2-v9eYgTck08AHeBMDgCc5myqz9QDYsD3aZUjOB4hCbdKb';
$clientSecret = 'EIa9Tbf9QeHNWvLM04gFJ32FoReKk02bRMZJ0iLhf54EPPpXl5oIVSeAtZLxnUtidPyRPVs7b98wDqyW';
$base         = 'https://api-m.sandbox.paypal.com';

$db = new Database();

try {
    $data    = json_decode(file_get_contents('php://input'), true);
    $orderID = $data['orderID'];
    $email   = trim($data['email']);
    $password = $data['password'];

    $auth     = base64_encode("$clientId:$clientSecret");
    $tokenRes = json_decode(file_get_contents("$base/v1/oauth2/token", false, stream_context_create([
        'http' => [
            'method'  => 'POST',
            'header'  => "Authorization: Basic $auth\r\nContent-Type: application/x-www-form-urlencoded",
            'content' => 'grant_type=client_credentials',
        ]
    ])), true);

    $capture = json_decode(file_get_contents("$base/v2/checkout/orders/$orderID/capture", false, stream_context_create([
        'http' => [
            'method'  => 'POST',
            'header'  => "Content-Type: application/json\r\nAuthorization: Bearer {$tokenRes['access_token']}",
            'content' => '{}',
        ]
    ])), true);

    if ($capture['status'] !== 'COMPLETED') {
        throw new Exception('El pago no se completó correctamente');
    }

    $query = "INSERT INTO users (email, password_hash, role_id, is_active, created_at, updated_at)
              VALUES (:email, :password_hash, 1, 1, NOW(), NOW())";

    $result = $db->execute($query, [
        ':email'         => $email,
        ':password_hash' => password_hash($password, PASSWORD_BCRYPT),
    ]);

    if (!$result) {
        throw new Exception('No se pudo registrar el usuario');
    }

    $userId = $db->lastId();

    $token = base64_encode(json_encode([
        'user_id' => $userId,
        'email'   => $email,
        'role'    => 'owner',
        'exp'     => time() + (24 * 60 * 60)
    ]));

    echo json_encode([
        'success' => true,
        'message' => 'Cuenta creada correctamente',
        'data'    => [
            'token' => $token,
            'user'  => ['id' => $userId, 'email' => $email, 'role_name' => 'owner']
        ]
    ]);

} catch (Exception $e) {
    http_response_code(200);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}