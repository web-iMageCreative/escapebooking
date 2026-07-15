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
require_once __DIR__ . '/../shared/Mailer.php';

$db = new Database();
$mailer = new Mailer();

try {
    // Recogida de datos de la solicitud
    $data = json_decode(file_get_contents('php://input'), true);

    $email           = isset($data['email'])           ? trim($data['email'])        : null;
    $password        = isset($data['password'])        ? $data['password']           : null;
    $confirmPassword = isset($data['confirmPassword']) ? $data['confirmPassword']    : null;
    $business_name   = isset($data['businessName'])    ? trim($data['businessName']) : null;
    $phone           = isset($data['phone'])           ? trim($data['phone'])        : null;
    $address         = isset($data['address'])         ? trim($data['address'])      : null;
    $city            = isset($data['city'])            ? trim($data['city'])         : null;

    //Validación de los campos obligatorios
    if (!isset($email)           || empty($email)           ||
        !isset($password)        || empty($password)        ||
        !isset($confirmPassword) || empty($confirmPassword) ||
        !isset($business_name)   || empty($business_name)   ||
        !isset($phone)           || empty($phone)           ||
        !isset($address)         || empty($address)         ||
        !isset($city)            || empty($city) ) {
        throw new Exception('Todos los campos son obligatorios');
    }

    //validación de password correcto
    if ($password !== $confirmPassword) {
        throw new Exception('Las contraseñas no coinciden');
    }

    $password_hash = password_hash($password, PASSWORD_BCRYPT);

    // Comprobación de registro previo del email
    $query = "SELECT id FROM users WHERE email = :email";

    $exist = $db->fetchSingle($query, [':email' => $email]);

    if ($exist) {
        throw new Exception('El email ya existe.');
    }

    // Insersión del nuevo usuario en la base de datos
    $params = array(
        'email' => $email,
        'password_hash' => $password_hash
    );

    $queryNew = "INSERT INTO users (email, password_hash, role_id, is_active, created_at, updated_at)
                 VALUES (:email, :password_hash, 1, 1, NOW(), NOW())";

    $new = $db->execute($queryNew, $params);

    $lastId = $db->lastId();

    // Insersión de los datos del usuario en la base de datos
    $paramsDetails = array(
        'user_id' => $lastId,
        'business_name' => $business_name,
        'phone' => $phone,
        'address' => $address,
        'city' => $city
    );

    $queryDetails = "INSERT INTO owners (user_id, business_name, phone, address, city, created_at)
                     VALUES (:user_id, :business_name, :phone, :address, :city, NOW())";

    $details = $db->execute($queryDetails, $paramsDetails);

    // Envío de notificación de registro correcto
    $mailer->send(
        $email,
        $email,
        'Bienvenido/a - EscapeBooking',
        "Hola,\n\nTu cuenta ha sido creada correctamente.\n\nYa puedes acceder con tu email: $email"
    );

    // Respuesta de éxito con token de autenticación
    $queryRole = "SELECT name FROM roles WHERE id = :id";

    $role = $db->fetchSingle($queryRole, [':id' => 1]);

    if (!$role) {
        throw new Exception('No se encuentra el rol');
    }
    
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
    exit;
    
} catch (Exception $e) {
    //respuesta de error
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
    exit;
}


