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
    $id = $_GET['id'];
    $params = array('id' => $id);

    $query = "SELECT * FROM rooms WHERE id = :id";

    $getRoom = $db->fetchSingle($query, $params);

    if (!$getRoom) {
        throw new Exception('No se ha encontrado ninguna sala.');
    }

    $queryPrice = "SELECT * FROM prices WHERE id_room = :id ORDER BY num_players ASC";
    $prices = $db->fetchAll($queryPrice, $params);

    if ($prices) {
        $getRoom['prices'] = $prices;
    } else {
        $getRoom['prices'] = array();
    }

    echo json_encode([
        'success' => true,
        'message' => 'Salas cargadas.',
        'data' => $getRoom
    ]);
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}