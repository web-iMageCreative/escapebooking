<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://dev3.icreative.es');
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

  if ( ! (isset( $data['id'] ) && trim($data['id']) != '') ) {
    throw new Exception('Falta el id del negocio');
  }

  $id = $data['id'];
  $params = array('id' => $id);
  $query = "SELECT * FROM escaperooms WHERE id = :id ORDER BY name";
  $escaperoom = $db->fetchSingle($query, $params);

  if (!$escaperoom) {
    throw new Exception('EscapeRoom no encontrado.');
  }

  if ($escaperoom['owner'] != $user_id) {
    throw new Exception('No tienes permiso para acceder a este EscapeRoom.');
  }

  $query = "DELETE FROM escaperooms WHERE id = :id";

  $result = $db->execute($query, $params);
  
  if (!$result) {
    throw new Exception( 'No se eliminar el EscapeRoom' );
  }

  http_response_code(200);
  echo json_encode([
    'success' => true,
    'message' => 'EscapeRoom eliminado',
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