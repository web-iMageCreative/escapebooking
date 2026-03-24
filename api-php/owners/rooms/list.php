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

require_once '../../shared/Database.php';

$db = new Database();

try {
    $id = $_GET['escaperoom_id'];
    $params = array('escaperoom_id' => $id);

    $query = "SELECT * FROM rooms WHERE escaperoom_id = :escaperoom_id";

    $rooms = $db->fetchAll($query, $params);

    if (! $rooms) {
        throw new Exception('No se han encontrado salas.');
    }

    echo json_encode([
        'success' => true,
        'message' => 'Salas cargadas.',
        'data' => $rooms
    ]);
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
