<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: DELETE, OPTIONS');
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

  if (function_exists('getallheaders')) {
      $headers = getallheaders();
      $token = str_replace('Bearer ', '', $headers['Authorization'] ?? '');
      $token = base64_decode($token);
      $token = json_decode($token, true);
      $user_id = $token['user_id'];
  }

  if (!isset($token) || !isset($user_id)) {
    throw new Exception('Token de autorización no proporcionado: ' . json_encode($token));
  }

  $id = $data['id'];
  $params = array('id' => $id);
  $query = "SELECT * FROM rooms r JOIN escaperooms e ON r.escaperoom_id = e.id WHERE r.id = :id ORDER BY r.name";
  $escaperoom = $db->fetchSingle($query, $params);

  if (!$escaperoom) {
    throw new Exception('EscapeRoom no encontrado.');
  }

  if ($escaperoom['owner'] != $user_id) {
    throw new Exception('No tienes permiso para acceder a este EscapeRoom.');
  }
  
  if ( ! (isset( $data['id'] ) && trim($data['id']) != '') ) throw new Exception('Falta el id de la sala');

  $params = array();
  $params['id'] = $data['id'];

  $query = "DELETE FROM rooms WHERE id = :id";

  $result = $db->execute($query, $params);
  
  if (!$result) {
    throw new Exception( 'No se puede eliminar la sala' );
  }

  http_response_code(200);
  echo json_encode([
    'success' => true,
    'message' => 'Sala eliminada',
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