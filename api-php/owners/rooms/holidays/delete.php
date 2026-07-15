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

require_once '../../../shared/Database.php';

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
      
  if ( ! (isset( $data['holidays_id'] ) && trim($data['holidays_id']) != '') ) throw new Exception('Falta el id del periodo de vacaciones');

  $id = $data['holidays_id'];
  $params = array('id' => $id);
  

  $query = "DELETE FROM holidays WHERE id = :id";

  $result = $db->execute($query, $params);
  
  if (!$result) {
    throw new Exception( 'No se puede eliminar el periodo de vacaciones' );
  }

  http_response_code(200);
  echo json_encode([
    'success' => true,
    'message' => 'Periodo de vacaciones eliminado',
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