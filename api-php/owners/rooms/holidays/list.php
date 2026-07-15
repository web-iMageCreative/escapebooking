<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000'); // Específico
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');


// Manejar preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../../shared/Database.php';

$db = new Database();

try {
    if (function_exists('getallheaders')) {
        $headers = getallheaders();
        $token = str_replace('Bearer ', '', $headers['Authorization'] ?? '');
        $token = base64_decode($token);
        $token = json_decode($token, true);
        $user_id = $token['user_id'];
    }

    if (!isset($token) || !isset($user_id)) {
        throw new Exception('Token de autorización no proporcionado: ' . json_encode($token));
    }

    $id = $_GET['room_id'];
    $params = array('room_id' => $id);
    $query = "SELECT * FROM rooms r JOIN escaperooms e ON r.escaperoom_id = e.id WHERE r.id = :room_id ORDER BY r.name";
    $room = $db->fetchSingle($query, $params);

    if (!$room) {
        throw new Exception('Sala no encontrada.');
    }

    if ($room['owner'] != $user_id) {
        throw new Exception('No tienes permiso para acceder a esta sala.');
    }

    $id = $_GET['room_id'];
    $params = array('room_id' => $id);

    $query = "SELECT * FROM holidays WHERE room_id = :room_id";

    $holidays = $db->fetchAll($query, $params);

    if (! $holidays) {
         echo json_encode([
            'success' => false,
            'message' => 'No se han encontrado periodos de vacaciones.',
            'data' => $holidays
        ]);
        exit;
    }

    echo json_encode([
        'success' => true,
        'message' => 'Periodos de vacaciones cargados.',
        'data' => $holidays
    ]);
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
