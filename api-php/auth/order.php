<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://dev2.icreative.es');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

$data  = json_decode(file_get_contents('php://input'), true);
$email = $data['email'] ?? 'sin-email';

$clientId     = 'AcVoDh51dfGFZRauylq59NZYdjJAJZRHES2-v9eYgTck08AHeBMDgCc5myqz9QDYsD3aZUjOB4hCbdKb';
$clientSecret = 'EIa9Tbf9QeHNWvLM04gFJ32FoReKk02bRMZJ0iLhf54EPPpXl5oIVSeAtZLxnUtidPyRPVs7b98wDqyW';
$base         = 'https://api-m.sandbox.paypal.com';

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
                'intent' => 'CAPTURE',
                'purchase_units' => [[
                    'reference_id'    => 'plan_owner',
                    'description'     => 'Cuenta Owner - Acceso completo a la plataforma',
                    'custom_id'       => $email,
                    'soft_descriptor' => 'Plan Owner',
                    'amount' => [
                        'currency_code' => 'EUR',
                        'value'         => '9.99',
                        'breakdown'     => [
                            'item_total' => ['currency_code' => 'EUR', 'value' => '9.99']
                        ]
                    ],
                    'items' => [[
                        'name'        => 'Plan Owner',
                        'description' => 'Suscripción EscapeBooking plan Owner ',
                        'quantity'    => '1',
                        'unit_amount' => ['currency_code' => 'EUR', 'value' => '9.99'],
                        'category'    => 'DIGITAL_GOODS',
                    ]]
                ]]
            ]),
        ]
    ])), true);

    echo json_encode(['success' => true, 'orderID' => $order['id']]);

} catch (Exception $e) {
    http_response_code(200);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}