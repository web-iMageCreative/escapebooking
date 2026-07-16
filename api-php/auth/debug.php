<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000'); // Específico
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type, X-Auth-Token');
header('Access-Control-Allow-Credentials: true');

$response = [
    'method' => $_SERVER['REQUEST_METHOD'],
    'headers_apache' => function_exists('apache_request_headers') ? apache_request_headers() : 'No disponible',
    'headers_getall' => function_exists('getallheaders') ? getallheaders() : 'No disponible',
    'server_authorization' => [
        'HTTP_AUTHORIZATION' => $_SERVER['HTTP_AUTHORIZATION'] ?? 'No existe',
        'REDIRECT_HTTP_AUTHORIZATION' => $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? 'No existe',
        'Authorization' => $_SERVER['Authorization'] ?? 'No existe',
        'AUTHORIZATION' => $_SERVER['AUTHORIZATION'] ?? 'No existe',
    ],
    'all_server_http' => array_filter($_SERVER, function($key) {
        return strpos($key, 'HTTP_') === 0;
    }, ARRAY_FILTER_USE_KEY),
    'get' => $_GET,
    'post' => $_POST,
    'php_version' => PHP_VERSION,
    'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'No disponible',
];

echo json_encode($response);
?>