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
    $dayWeek = $_GET['day_week'];
    $params = array(
        'idRoom' => $idRoom,
        'dayWeek' => $dayWeek
    );

    $query = "SELECT hours FROM schedule WHERE id = :idRoom AND day_week = :dayWeek";

    $getHours = $db->fetchSingle($query, $params);

    if (!$getHours) {
        throw new Exception('No se han encontrado horarios para esta sala.');
    }

    echo json_encode([
        'success' => true,
        'message' => 'Horario cargado.',
        'data' => $getHours
    ]);

} catch (Exception $e) {

    http_response_code(401);

    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}