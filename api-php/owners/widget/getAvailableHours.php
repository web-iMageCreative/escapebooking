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
    $idRoom = $_GET['id_room'];
    $date = $_GET['date'];
    $params = array(
        'idRoom' => $idRoom,
        'date' => $date
    );

    $query = "SELECT TIME_FORMAT(TIME(date), '%H:%i') as hour FROM bookings WHERE id_room = :idRoom AND DATE(date) = :date";    

    $getAvailableHours = $db->fetchAll($query, $params);

    if (!$getAvailableHours) {
        echo json_encode([
            'success' => true,
            'message' => 'No hay horas reservadas.',
            'data' => []
        ]);
        exit();
    }

    echo json_encode([
        'success' => true,
        'message' => 'Horario cargado.',
        'data' => $getAvailableHours
    ]);

} catch (Exception $e) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
