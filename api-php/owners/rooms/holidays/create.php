<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://dev3.icreative.es');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Auth-Token, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Max-Age: 86400');

// MANEJAR OPTIONS PRIMERO
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../../shared/Database.php';

$db = new Database();

try {
  if ( isset ($_SERVER['HTTP_X_AUTH_TOKEN'])) {
    $token = str_replace('Bearer ', '', $_SERVER['HTTP_X_AUTH_TOKEN'] ?? '');
    $token = base64_decode($token);
    $token = json_decode($token, true);
    $user_id = $token['user_id'];
  }
    
  if (!isset($token) || !isset($user_id)) {
    throw new Exception('Token de autorización no proporcionado');
  }
      
  $data = json_decode(file_get_contents('php://input'), true);
  $id = $data['room_id'];
  $params = array('id' => $id);
  $query = "SELECT * FROM rooms r JOIN escaperooms e ON r.escaperoom_id = e.id WHERE r.id = :id ORDER BY r.name";
  $room = $db->fetchSingle($query, $params);

  if (!$room) {
    throw new Exception('Sala no encontrada.');
  }

  if ($room['owner'] != $user_id) {
    throw new Exception('No tienes permiso para acceder a esta sala.');
  }
  
  if ( ! (isset( $data['name'] ) && trim($data['name']) != '') ) throw new Exception('Falta el nombre del periodo de vacaciones');
  if ( ! (isset( $data['date_ini'] ) && trim($data['date_ini']) != '') ) throw new Exception('Falta la fecha de inicio');
  if ( ! (isset( $data['date_end'] ) && trim($data['date_end']) != '') ) throw new Exception('Falta la fecha de fin');
  if ( ! (isset( $data['room_id'] ) && trim($data['room_id']) != '') ) throw new Exception('Falta el ID de la sala');
  
  $params = array();
  $params['name']     = trim( $data['name'] );
  $params['date_ini'] = $data['date_ini'];
  $params['date_end'] = $data['date_end'];
  $params['room_id']  = $data['room_id'];
  $query = "INSERT INTO holidays (name, date_ini, date_end, room_id) 
            VALUES (:name, :date_ini, :date_end, :room_id)";
  $holiday = $db->execute($query, $params);

  if (!$holiday) {
    throw new Exception( 'No se pudo crear el periodo de vacaciones '. $params['name'] );
  }

  http_response_code(200);
  echo json_encode([
    'success' => true,
    'message' => 'Creado el periodo de vacaciones '. $params['name'],
    'data' => []
  ]);
} catch (Exception $e) {
  http_response_code(200);
  echo json_encode([
    'success' => false,
    'message' => $e->getMessage()
  ]);
}