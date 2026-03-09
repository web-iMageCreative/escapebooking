<?php
class Mailer {
    private $mailer;

    public function __construct() {
        require_once 'swiftmailer/lib/swift_required.php';

        $transport = Swift_SmtpTransport::newInstance('mail.imagecreative.es', 587)
            ->setUsername('notificaciones@imagecreative.es')
            ->setPassword('imcwebprogrammer3');

        $this->mailer = Swift_Mailer::newInstance($transport);
    }

    public function send($to, $toName, $subject, $body) {
        $message = Swift_Message::newInstance()
            ->setSubject($subject)
            ->setFrom(array('notificaciones@imagecreative.es' => 'Tu App'))
            ->setTo(array($to => $toName))
            ->setBody($body);

        return $this->mailer->send($message);
    }
}