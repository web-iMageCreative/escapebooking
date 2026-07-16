<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Auth-Token, X-Requested-With');
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
  $booking_id = $data['id'];
  $params = array('id' => $booking_id);
  $query = "SELECT * FROM bookings b JOIN rooms r ON b.id_room = r.id JOIN escaperooms e ON e.id = r.escaperoom_id WHERE b.id = :id";
  $booking = $db->fetchSingle($query, $params);

  if (!$booking) {
    throw new Exception('Sala no encontrada.');
  }

  if ($booking['owner'] != $user_id) {
    throw new Exception('No tienes permiso para acceder a esta Sala.');
  }
  
  if ( ! (isset( $data['id'] ) && trim($data['id']) != '') ) throw new Exception('Falta el id de la reserva');

  $params = array();
  $params['id'] = $data['id'];

  $query = "DELETE FROM bookings WHERE id = :id";

  $result = $db->execute($query, $params);
  
  if (!$result) {
    throw new Exception( 'No se puede eliminar la reserva' );
  }

  http_response_code(200);
  echo json_encode([
    'success' => true,
    'message' => 'Reserva eliminada',
    'data' => []
  ]);
} catch (Exception $e) {
  http_response_code(200);
  echo json_encode([
    'success' => false,
    'message' => $e->getMessage(),
    'data' => []
  ]);
}