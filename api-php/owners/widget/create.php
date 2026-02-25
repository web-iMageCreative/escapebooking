<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Max-Age: 86400');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../shared/Database.php';

$db = new Database();

try {
    $data = json_decode(file_get_contents('php://input'), true);

    if ( ! (isset( $data['name'] ) && trim($data['name']) != '') ) throw new Exception('Falta el nombre');
    if ( ! (isset( $data['email'] ) && trim($data['email']) != '') ) throw new Exception('Falta el email');
    if ( ! (isset( $data['phone'] ) && trim($data['phone']) != '') ) throw new Exception('Falta el número');
    if ( ! (isset( $data['num_players'] ) && trim($data['num_players']) != '') ) throw new Exception('Falta el número de jugadores');
    if ( ! (isset( $data['date'] ) && trim($data['date']) != '') ) throw new Exception('Falta la fecha');
    if ( ! (isset( $data['id_room'] ) && $data['id_room'] != '') ) throw new Exception('Falta el id de la sala');
    if ( ! (isset( $data['price'] ) && trim($data['price']) != '') ) throw new Exception('Falta el precio');

    $params = array();
    $params['name']          = trim( $data['name'] );
    $params['email']          = trim( $data['email'] );
    $params['phone']          = trim( $data['phone'] );
    $params['num_players']          = trim( $data['num_players'] );
    $params['date']          = trim( $data['date'] );
    $params['id_room']          = trim( $data['id_room'] );
    $params['price']          = trim( $data['price'] );
    $params['notes']          = trim( $data['notes']);


    $query = "INSERT INTO bookings (name, email, phone, num_players, date, id_room, price, notes)
    VALUES (:name, :email, :phone, :num_players, :date, :id_room, :price, :notes)";

    $createBooking = $db->execute($query, $params);

    if (!$createBooking) {
        throw new Exception( 'No se pudo hacer la reserva ' );
    }

  http_response_code(200);
  echo json_encode([
    'success' => true,
    'message' => 'Reserva realizada',
    'data' => []
  ]);
} catch (Exception $e) {
  http_response_code(200);
  echo json_encode([
    'success' => false,
    'message' => $e->getMessage()
  ]);
}