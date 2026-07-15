<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../shared/Database.php';

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

    $room_id = $_GET['room_id'];
    $params = array('room_id' => $room_id);
    $query = "SELECT * FROM rooms r JOIN escaperooms e ON r.escaperoom_id = e.id WHERE r.id = :room_id";
    $room = $db->fetchSingle($query, $params);

    if (!$room) {
        throw new Exception('Sala no encontrada.');
    }

    if ($room['owner'] != $user_id) {
        throw new Exception('No tienes permiso para acceder a esta Sala.');
    }

    $query = "SELECT b.*, r.name as room_name FROM bookings b 
        INNER JOIN rooms r ON b.id_room = r.id 
        WHERE b.id_room = :room_id AND b.date >= CURDATE()
        ORDER BY b.date ASC";
    $getOwnerBookings = $db->fetchAll($query, $params);

    if (! $getOwnerBookings) {
        echo json_encode([
            'success' => false,
            'message' => 'No se han encontrado reservas para esta sala.',
            'data' => $getOwnerBookings
        ]);
        exit;
    }

    echo json_encode([
        'success' => true,
        'message' => 'Reservas cargadas.',
        'data' => $getOwnerBookings
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
