<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000'); // Específico
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Auth-Token');
header('Access-Control-Allow-Credentials: true');


// Manejar preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../shared/Database.php';

$db = new Database();

try {
    if ( isset ($_SERVER['HTTP_X_AUTH_TOKEN'])) {
        $token = str_replace('Bearer ', '', $_SERVER['HTTP_X_AUTH_TOKEN'] ?? '');
        $token = base64_decode($token);
        $token = json_decode($token, true);
        $user_id = $token['user_id'];
    } 
    
    if (!isset($token) || !isset($user_id)) {
        throw new Exception('Token de autorización no proporcionado');
    }

    $id = $_GET['escaperoom_id'];
    $params = array('id' => $id);
    $query = "SELECT * FROM escaperooms WHERE id = :id ORDER BY name";
    $escaperoom = $db->fetchSingle($query, $params);

    if (!$escaperoom) {
        throw new Exception('EscapeRoom no encontrado.');
    }

    if ($escaperoom['owner'] != $user_id) {
        throw new Exception('No tienes permiso para acceder a este EscapeRoom.');
    }

    $params = array('escaperoom_id' => $id);
    $query = "SELECT * FROM rooms WHERE escaperoom_id = :escaperoom_id";
    $rooms = $db->fetchAll($query, $params);

    if (! $rooms) {
        echo json_encode([
            'success' => false,
            'message' => 'No se han encontrado salas.',
            'data' => $rooms
        ]);
        exit;
    }

    echo json_encode([
        'success' => true,
        'message' => 'Salas cargadas.',
        'data' => $rooms
    ]);
    exit;
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
    exit;
}
