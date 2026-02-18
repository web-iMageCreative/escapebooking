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

  if ( ! (isset( $data['name'] ) && trim($data['name']) != '') ) throw new Exception('Falta el nombre del negocio');
  if ( ! (isset( $data['owner'] ) && $data['owner'] != '') ) throw new Exception('Falta el id del dueño del negocio');
  
  $params = array();
  $params['name']        = trim( $data['name'] );
  $params['owner']       = $data['owner'];
  
  
  $query = "INSERT INTO escaperooms (name, owner) VALUES (:name, :owner)";
  
  $escaperoom = $db->execute($query, $params);
  
  if (!$escaperoom) {
    throw new Exception( 'No se pudo crear el negocio '. $params['name'] );
  }

  http_response_code(200);
  echo json_encode([
    'success' => true,
    'message' => 'Creado el negocio '. $params['name'],
    'data' => []
  ]);
} catch (Exception $e) {
  http_response_code(200);
  echo json_encode([
    'success' => false,
    'message' => $e->getMessage()
  ]);
}