<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://dev2.icreative.es');
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
    $data = array();
    $idRoom = $_GET['id_room'];
    $month = $_GET['month'];
    $year = $_GET['year'];
    $params = array();
    $query = array();
    $params['hours_by_day'] = array(
        'id_room' => $idRoom,
    );
    $params['bookings_by_month'] = array(
        'id_room' => $idRoom,
        'month' => $month,
        'year' => $year
    );

    $query['hours_by_day'] = "SELECT day_week, count(*) AS availables FROM schedule WHERE id_room = :id_room GROUP BY day_week";

    $query['bookings_by_month'] = "
        SELECT 
            DAYOFWEEK(date) as dayWeek,
            DATE(date) as date,
            COUNT(*) as bookings
        FROM bookings
        WHERE 
            MONTH(date) = :month AND
            YEAR(date) = :year AND
            id_room = :id_room
        GROUP BY DATE(date), DAYOFWEEK(date)
        ORDER BY date;
    ";

    $hours_by_day = $db->fetchAll( $query['hours_by_day'], $params['hours_by_day'] );
    $bookings_by_month = $db->fetchAll( $query['bookings_by_month'], $params['bookings_by_month'] );

    $data['hours_by_day'] = $hours_by_day ? $hours_by_day : array();
    $data['bookings_by_month'] = $bookings_by_month ? $bookings_by_month : array();

    echo json_encode([
        'success' => true,
        'message' => 'No hay horas reservadas.',
        'data' => $data
    ]);

} catch (Exception $e) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}