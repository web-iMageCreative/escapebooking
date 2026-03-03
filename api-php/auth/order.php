<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

$clientId     = 'AcVoDh51dfGFZRauylq59NZYdjJAJZRHES2-v9eYgTck08AHeBMDgCc5myqz9QDYsD3aZUjOB4hCbdKb';
$clientSecret = 'EIa9Tbf9QeHNWvLM04gFJ32FoReKk02bRMZJ0iLhf54EPPpXl5oIVSeAtZLxnUtidPyRPVs7b98wDqyW';
$base         = 'https://api-m.paypal.com';

try {
    $auth     = base64_encode("$clientId:$clientSecret");
    $tokenRes = json_decode(file_get_contents("$base/v1/oauth2/token", false, stream_context_create([
        'http' => [
            'method'  => 'POST',
            'header'  => "Authorization: Basic $auth\r\nContent-Type: application/x-www-form-urlencoded",
            'content' => 'grant_type=client_credentials',
        ]
    ])), true);

    $order = json_decode(file_get_contents("$base/v2/checkout/orders", false, stream_context_create([
        'http' => [
            'method'  => 'POST',
            'header'  => "Content-Type: application/json\r\nAuthorization: Bearer {$tokenRes['access_token']}",
            'content' => json_encode([
                'intent'         => 'CAPTURE',
                'purchase_units' => [['amount' => ['currency_code' => 'EUR', 'value' => '9.99']]]
            ]),
        ]
    ])), true);

    echo json_encode(['success' => true, 'orderID' => $order['id']]);

} catch (Exception $e) {
    http_response_code(200);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}