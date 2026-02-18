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
    $idRoom = $_GET['id'];
    $params = array('idRoom' => $idRoom);

    $query = "SELECT * FROM rooms WHERE id = :idRoom ORDER BY name";

    $getRooms = $db->fetchSingle($query, $params);

    if (!$getRooms) {
        throw new Exception('No se ha encontrado ninguna sala.');
    }

    echo json_encode([
        'success' => true,
        'message' => 'Salas cargadas.',
        'data' => $getRooms
    ]);
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}