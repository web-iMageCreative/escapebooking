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
  if ( ! (isset( $data['address'] ) && $data['address'] != '') ) throw new Exception('Falta la dirección');
  if ( ! (isset( $data['postal_code'] ) && $data['postal_code'] != '') ) throw new Exception('Falta el código postal');
  if ( ! (isset( $data['cif'] ) && $data['cif'] != '') ) throw new Exception('Falta el cif');
  if ( ! (isset( $data['email'] ) && $data['email'] != '') ) throw new Exception('Falta el email');
  if ( ! (isset( $data['phone'] ) && $data['phone'] != '') ) throw new Exception('Falta el teléfono');
  
  $params = array();
  $params['name']        = trim( $data['name'] );
  $params['owner']       = $data['owner'];
  $params['address']       = $data['address'];
  $params['postal_code']       = $data['postal_code'];
  $params['cif']       = $data['cif'];
  $params['email']       = $data['email'];
  $params['phone']       = $data['phone'];
  
  
  $query = "INSERT INTO escaperooms (name, owner, address, postal_code, cif, email, phone) VALUES (:name, :owner, :address, :postal_code, :cif, :email, :phone)";
  
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