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
    $id = $_GET['room_id'];
    $params = array('room_id' => $id);

    $query = "SELECT * FROM holidays WHERE room_id = :room_id";

    $holidays = $db->fetchAll($query, $params);

    if (! $holidays) {
        throw new Exception('No se han encontrado periodos de vacaciones.');
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
