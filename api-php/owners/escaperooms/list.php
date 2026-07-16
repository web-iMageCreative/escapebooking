<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000'); // Específico
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Auth-Token');
header('Access-Control-Allow-Credentials: true');


// Manejar preflight OPTIONS
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
        throw new Exception('Token de autorización no proporcionado: ' . $token);
    }

    $userid = $_GET['userid'];

    if ($userid != $user_id) {
        throw new Exception('No tienes permiso para acceder a estos EscapeRoom.');
    }

    $params = array('userid' => $userid);

    $query = "SELECT * FROM escaperooms WHERE owner = :userid ORDER BY name";

    $escaperooms = $db->fetchAll($query, $params);

    if (!$escaperooms) {
        echo json_encode([
            'success' => false,
            'message' => 'No se encontraron escaperooms',
            'data' => $escaperooms
        ]);
        exit;
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Escaperooms cargados...',
        'data' => $escaperooms
    ]);
    exit;
} catch (Exception $e) {
    http_response_code(200);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
    exit;
}
?>