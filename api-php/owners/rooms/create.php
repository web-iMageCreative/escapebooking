<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Max-Age: 86400');

// MANEJAR OPTIONS PRIMERO
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../shared/Database.php';

$db = new Database();

try {
  $data = json_decode(file_get_contents('php://input'), true);

  if ( ! (isset( $data['name'] ) && trim($data['name']) != '') ) throw new Exception('Falta el nombre de la sala');
  if ( ! (isset( $data['duration'] ) && trim($data['duration']) != '') ) throw new Exception('Falta la duración de la sala');
  if ( ! (isset( $data['min_players'] ) && trim($data['min_players']) != '') ) throw new Exception('Falta el mínimo de jugadores');
  if ( ! (isset( $data['max_players'] ) && trim($data['max_players']) != '') ) throw new Exception('Falta el máximo de jugadores');
  if ( ! (isset( $data['escaperoom_id'] ) && $data['escaperoom_id'] != '') ) throw new Exception('Falta el id de la sala del Escaperoom');
  
  $params = array();
  $params['name']          = trim( $data['name'] );
  $params['duration']      = $data['duration'];
  $params['min_players']   = $data['min_players'];
  $params['max_players']   = $data['max_players'];
  $params['escaperoom_id'] = $data['escaperoom_id'];
  $prices = $data['prices'];
  $schedule = $data['schedule'];

  $query = "INSERT INTO rooms (name, duration, min_players, max_players, escaperoom_id) 
  VALUES (:name, :duration, :min_players, :max_players, :escaperoom_id)";
  
  $room = $db->execute($query, $params);

  if (!$room) {
    throw new Exception( 'No se pudo crear la sala '. $params['name'] );
  }

  $id_room = $db->lastId();

  for ( $i = 0; $i < count($data['prices']); $i++) {
    $params_price = array();
    $params_price['id_room'] = $id_room;
    $params_price['num_players'] = $prices[$i]['num_players'];
    $params_price['price'] = $prices[$i]['price'];
    
    $query = "INSERT INTO prices (id_room, num_players, price) VALUES (:id_room, :num_players, :price)";
    $price = $db->execute($query, $params_price);

    if (!$price) {
      throw new Exception( 'No se pudo crear el precio para la sala '. $params['name'] );
    }
  }


  for ($i = 0; $i < count($schedule); $i++) {

    if (!isset($schedule[$i]['day_week']) || !isset($schedule[$i]['hour'])) {
        throw new Exception('no existe el dia o la hora');
    }

    $params_schedule = array();
    $params_schedule['id_room'] = $id_room;
    $params_schedule['day_week'] = $schedule[$i]['day_week'];
    $params_schedule['hour'] = $schedule[$i]['strHour'];

    $querySchedule = "INSERT INTO schedule (id_room, day_week, hour) VALUES (:id_room, :day_week, :hour)";
    $createSchedule = $db->execute($querySchedule, $params_schedule);

    if (!$createSchedule) {
      throw new Exception ('No se pudo crear el horario para la sala'. $params['name']);
    }
  }

  http_response_code(200);
  echo json_encode([
    'success' => true,
    'message' => 'Creada la sala '. $params['name'],
    'data' => []
  ]);
} catch (Exception $e) {
  http_response_code(200);
  echo json_encode([
    'success' => false,
    'message' => $e->getMessage()
  ]);
}