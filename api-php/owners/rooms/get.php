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

require_once '../../shared/Database.php';

$db = new Database();

try {
    $id = $_GET['id'];
    $params = array('id' => $id);

    $query = "SELECT * FROM rooms WHERE id = :id ORDER BY name";

    $room = $db->fetchSingle($query, $params);
    
    if (!$room) {
        throw new Exception('Sala no encontrada.');
    }
   
    $query = "SELECT * FROM prices WHERE id_room = :id ORDER BY num_players ASC";
    $prices = $db->fetchAll($query, $params);

    if ($prices) {
        $room['prices'] = $prices;
    } else {
        $room['prices'] = array();
    }

    echo json_encode([
        'success' => true,
        'message' => 'Salas cargadas.',
        'data' => $room
    ]);
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}