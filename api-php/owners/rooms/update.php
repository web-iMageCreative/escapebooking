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
  if ( ! (isset( $data['description'] ) && trim($data['description']) != '') ) throw new Exception('Falta la descripción de la sala');
  if ( ! (isset( $data['duration'] ) && trim($data['duration']) != '') ) throw new Exception('Falta la duración de la sala');
  if ( ! (isset( $data['min_players'] ) && $data['min_players'] != '') ) throw new Exception('Falta el mínimo de jugadores');
  if ( ! (isset( $data['max_players'] ) && $data['max_players'] != '') ) throw new Exception('Falta el máximo de jugadores');
  if ( ! (isset( $data['escaperoom_id'] ) && $data['escaperoom_id'] != '') ) throw new Exception('Falta el id del escaperoom de la sala');

  $params = array();
  $params['id']        = $data['id'];
  $params['name']        = trim( $data['name'] );
  $params['description'] = trim( $data['description'] );
  $params['duration']     = trim( $data['duration'] );
  $params['min_players']    = $data['min_players'];
  $params['max_players']    = $data['max_players'];

  $query = "UPDATE rooms SET name = :name, description = :description, duration = :duration, min_players = :min_players, max_players = :max_players WHERE id = :id";

  $room = $db->execute($query, $params);

  if (!$room) {
    throw new Exception( 'No se pudo Editar la sala '. $params['name'] );
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