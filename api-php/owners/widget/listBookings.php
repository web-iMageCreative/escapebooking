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
    $room_id = $_GET['room_id'];
    $params = array('room_id' => $room_id);

    $query = "SELECT b.*, r.name as room_name FROM bookings b 
        INNER JOIN rooms r ON b.id_room = r.id 
        WHERE b.id_room = :room_id
        ORDER BY b.date ASC";

    $getOwnerBookings = $db->fetchAll($query, $params);

    echo json_encode([
        'success' => true,
        'message' => 'Reservas cargadas.',
        'data' => $getOwnerBookings ?? []
    ]);

} catch (Exception $e) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
