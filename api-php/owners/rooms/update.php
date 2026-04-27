<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: PUT, OPTIONS');
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

  if ( ! (isset( $data['id'] ) && trim($data['id']) != '') ) throw new Exception('Falta el id de la sala');
  if ( ! (isset( $data['name'] ) && trim($data['name']) != '') ) throw new Exception('Falta el nombre de la sala');
  if ( ! (isset( $data['duration'] ) && trim($data['duration']) != '') ) throw new Exception('Falta la duración de la sala');
  if ( ! (isset( $data['min_players'] ) && $data['min_players'] != '') ) throw new Exception('Falta el mínimo de jugadores');
  if ( ! (isset( $data['max_players'] ) && $data['max_players'] != '') ) throw new Exception('Falta el máximo de jugadores');
  if ( ! (isset( $data['escaperoom_id'] ) && $data['escaperoom_id'] != '') ) throw new Exception('Falta el id del escaperoom de la sala');

  $params = array();
  $params['id']        = $data['id'];
  $params['name']        = trim( $data['name'] );
  $params['duration']     = trim( $data['duration'] );
  $params['min_players']    = $data['min_players'];
  $params['max_players']    = $data['max_players'];
  $params['notes']  = $data['notes'];

  $query = "UPDATE rooms SET name = :name, duration = :duration, min_players = :min_players, max_players = :max_players, notes = :notes WHERE id = :id";

  $room = $db->execute($query, $params);

  if (!$room) {
    throw new Exception( 'No se pudo Editar la sala '. $params['name'] );
  }

  $queryDeletePrice = "DELETE FROM prices WHERE id_room = :id_room 
  AND (num_players < :min_players OR num_players > :max_players)";

  $db->execute($queryDeletePrice, [
    'id_room' => $data['id'],
    'min_players' => $params['min_players'],
    'max_players' => $params['max_players']
  ]);

  $queryDeleteSchedule = "DELETE FROM schedule WHERE id_room = :id_room";
  $db->execute($queryDeleteSchedule, [
      'id_room' => $data['id']
    ]);

  $schedule = $data['schedule'];
  
  for ($i = 0; $i < count($schedule); $i++) {

    if (!isset($schedule[$i]['day_week']) || !isset($schedule[$i]['strHour'])) {
        throw new Exception('El horario está incompleto');
    }

    $params_schedule = array();
    $params_schedule['id_room'] = $data['id'];
    $params_schedule['day_week'] = $schedule[$i]['day_week'];
    $params_schedule['hour'] = $schedule[$i]['strHour'];

    $querySchedule = "INSERT INTO schedule (id_room, day_week, hour) VALUES (:id_room, :day_week, :hour)";
    $updateSchedule = $db->execute($querySchedule, $params_schedule);

    if (!$schedule) {
      throw new Exception ('No se pudo crear el horario para la sala');
    }
  }


  if (isset($data['prices']) && is_array($data['prices'])) {
    foreach ($data['prices'] as $p) {
      if (!isset($p['num_players']) || !isset($p['price'])) {
        continue;
      }

      $query = "SELECT price FROM prices WHERE id_room = :id_room AND num_players = :num_players";
      $queryExist = $db->fetchSingle($query, [
        'id_room' => $data['id'],
        'num_players' => $p['num_players']
      ]);
      
      if ($queryExist) {
        $queryUpdate = "UPDATE prices SET price = :price WHERE id_room = :id_room AND num_players = :num_players";

        $db->execute($queryUpdate, [
          'price' => $p['price'],
          'id_room' => $data['id'],
          'num_players' => $p['num_players']
        ]);
      } else {
        $query = "INSERT INTO prices (id_room, num_players, price) VALUES (:id_room, :num_players, :price)";

        $db->execute($query, [
          'id_room' => $data['id'],
          'num_players' => $p['num_players'],
          'price' => $p['price']
        ]);
      }
    }
  }


  http_response_code(200);
  echo json_encode([
    'success' => true,
    'message' => 'Modificado el negocio '. $params['name'],
    'data' => []
  ]);
} catch (Exception $e) {
  http_response_code(200);
  echo json_encode([
    'success' => false,
    'message' => $e->getMessage()
  ]);
}