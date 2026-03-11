<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require_once __DIR__ . '/../PHPMailer-master/src/Exception.php';
require_once __DIR__ . '/../PHPMailer-master/src/PHPMailer.php';
require_once __DIR__ . '/../PHPMailer-master/src/SMTP.php';

class Mailer {
    public function send($to, $toName, $subject, $body) {
        $mail = new PHPMailer(true);

        $mail->isSMTP();
        $mail->Host       = 'mail.imagecreative.es';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'notificaciones@imagecreative.es';
        $mail->Password   = 'imcwebprogrammer3';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;
        $mail->CharSet    = 'UTF-8';

        $mail->setFrom('notificaciones@imagecreative.es', 'Tu App');
        $mail->addAddress($to, $toName);
        $mail->Subject = $subject;
        $mail->Body    = $body;

        return $mail->send();
    }
}