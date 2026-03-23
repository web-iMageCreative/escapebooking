SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `roles` (`id`, `name`, `description`) VALUES
(1, 'owner', 'Propietario de negocios de EscapeRooms'),
(2, 'customer', 'Clientes normales'),
(3, 'admin', 'Administrador del sistema');

CREATE TABLE IF NOT EXISTS `autonomous_communities` (
  `id` int(11) NOT NULL,
  `code` varchar(2) NOT NULL,
  `name` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `autonomous_communities` (`id`, `code`, `name`, `created_at`) VALUES
(1, '01', 'Andalucía', '2026-01-21 09:38:59'),
(2, '02', 'Aragón', '2026-01-21 09:38:59'),
(3, '03', 'Asturias, Principado de', '2026-01-21 09:38:59'),
(4, '04', 'Balears, Illes', '2026-01-21 09:38:59'),
(5, '05', 'Canarias', '2026-01-21 09:38:59'),
(6, '06', 'Cantabria', '2026-01-21 09:38:59'),
(7, '07', 'Castilla y León', '2026-01-21 09:38:59'),
(8, '08', 'Castilla-La Mancha', '2026-01-21 09:38:59'),
(9, '09', 'Catalunya', '2026-01-21 09:38:59'),
(10, '10', 'Comunitat Valenciana', '2026-01-21 09:38:59'),
(11, '11', 'Extremadura', '2026-01-21 09:38:59'),
(12, '12', 'Galicia', '2026-01-21 09:38:59'),
(13, '13', 'Madrid, Comunidad de', '2026-01-21 09:38:59'),
(14, '14', 'Murcia, Región de', '2026-01-21 09:38:59'),
(15, '15', 'Navarra, Comunidad Foral de', '2026-01-21 09:38:59'),
(16, '16', 'País Vasco', '2026-01-21 09:38:59'),
(17, '17', 'Rioja, La', '2026-01-21 09:38:59'),
(18, '18', 'Ceuta', '2026-01-21 09:38:59'),
(19, '19', 'Melilla', '2026-01-21 09:38:59');

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role_id` int(11) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `users` (`id`, `email`, `password_hash`, `role_id`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'admin@escapebooking.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 3, 1, '2026-01-21 09:38:59', '2026-01-21 09:38:59'),
(2, 'madrid@escaperooms.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, '2026-01-21 09:38:59', '2026-01-21 09:38:59'),
(3, 'barcelona@escapefun.es', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, '2026-01-21 09:38:59', '2026-01-21 09:38:59'),
(4, 'valencia@puzzleescape.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, '2026-01-21 09:38:59', '2026-01-21 09:38:59'),
(5, 'juan.perez@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 2, 1, '2026-01-21 09:38:59', '2026-01-21 09:38:59'),
(6, 'maria.garcia@hotmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 2, 1, '2026-01-21 09:38:59', '2026-01-21 09:38:59'),
(7, 'alex.smith@yahoo.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 2, 1, '2026-01-21 09:38:59', '2026-01-21 09:38:59'),
(9, 'ejemplo@ejemplo.com', '$2y$10$hsY7yaOGc.PQY52nP.e09.GXDsG7OI2Q7EerRNirRUudM7luXRxru', 1, 1, '2026-03-02 11:00:42', '2026-03-02 11:00:42'),
(10, 'ejemplo2@ejemplo.com', '$2y$10$NQXmYFtpnG5T9sm.iXAW2./YvBc1JWtJ2bBNLU5r0tvgHazUnkImq', 1, 1, '2026-03-02 11:12:41', '2026-03-02 11:12:41'),
(11, 'a@escaperooms.com', '$2y$10$Yr0pthckIWnOv4J7TTTNGuHpTKG.sTniFqhs6G8gNgvbWUqe0bl6m', 1, 1, '2026-03-02 12:52:30', '2026-03-02 12:52:30'),
(12, 'test@pago.com', '$2y$10$jYC3sory2fVgdscSiTV8XubC9TSLItlJejnbgBcYjHFlXcV5Gs9Ku', 1, 1, '2026-03-04 08:28:19', '2026-03-04 08:28:19'),
(13, 'pagado@pagado.es', '$2y$10$t6/Rr2hUQvMhEBTSPKall.8nlyilFHB4kauwOgGQl2Xb6dPP89Kgi', 1, 1, '2026-03-04 08:57:07', '2026-03-04 08:57:07');

CREATE TABLE IF NOT EXISTS `owners` (
  `user_id` int(11) NOT NULL,
  `business_name` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `owners` (`user_id`, `business_name`, `phone`, `address`, `city`, `created_at`) VALUES
(2, 'Madrid Escape Masters', '+34111222333', 'Calle Gran Vía 123', 'Madrid', '2026-01-21 09:38:59'),
(3, 'Barcelona Puzzle World', '+34222333444', 'Avenida Diagonal 456', 'Barcelona', '2026-01-21 09:38:59'),
(4, 'Valencia Mystery Rooms', '+34333444555', 'Plaza del Ayuntamiento 789', 'Valencia', '2026-01-21 09:38:59');

CREATE TABLE IF NOT EXISTS `customers` (
  `user_id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `customers` (`user_id`, `first_name`, `last_name`, `phone`, `created_at`) VALUES
(5, 'Juan', 'Pérez', '+34666777888', '2026-01-21 09:38:59'),
(6, 'María', 'García', '+34777888999', '2026-01-21 09:38:59'),
(7, 'Alex', 'Smith', '+34888999000', '2026-01-21 09:38:59');

CREATE TABLE IF NOT EXISTS `escaperooms` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `owner` int(11) DEFAULT NULL,
  `address` varchar(100) NOT NULL,
  `postal_code` varchar(12) NOT NULL,
  `cif` varchar(20) NOT NULL,
  `email` text NOT NULL,
  `phone` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `escaperooms` (`id`, `name`, `owner`, `address`, `postal_code`, `cif`, `email`, `phone`) VALUES
(1, 'EscapeRoom Salas', 2, 'Calle Victoria 13', '11540', 'B23787349', 'x@x.com', '32323232'),
(2, 'escape2', 3, '', '', '', '', '');

CREATE TABLE IF NOT EXISTS `rooms` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `duration` int(11) NOT NULL,
  `escaperoom_id` int(11) NOT NULL,
  `min_players` int(11) DEFAULT 1,
  `max_players` int(11) DEFAULT NULL,
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `rooms` (`id`, `name`, `description`, `duration`, `escaperoom_id`, `min_players`, `max_players`, `notes`) VALUES
(1, 'Sala 1', 'Descripción de la sala', 120, 2, 1, NULL, NULL),
(6, 'sala salón salita', 'descripción de la sala sad as  s sa s a s a s as  asshd asfh fdsfsdfs d fsd', 120, 2, 10, 10, NULL),
(8, 'sala 999', 'ada', 100, 2, 5, 5, NULL),
(33, 'SALA TOP', NULL, 110, 1, 1, 3, ''),
(34, 'Sala 2', NULL, 130, 1, 1, 5, NULL);

CREATE TABLE IF NOT EXISTS `prices` (
  `id_room` int(11) NOT NULL,
  `num_players` int(11) NOT NULL,
  `price` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `prices` (`id_room`, `num_players`, `price`) VALUES
(33, 1, 100),
(33, 2, 120),
(33, 3, 140),
(34, 1, 120),
(34, 2, 140),
(34, 3, 160),
(34, 4, 170),
(34, 5, 180);

CREATE TABLE IF NOT EXISTS `schedule` (
  `id_room` int(11) NOT NULL,
  `day_week` int(11) NOT NULL,
  `hour` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `schedule` (`id_room`, `day_week`, `hour`) VALUES
(33, 0, '09:00:00'),
(33, 1, '12:00:00'),
(33, 1, '17:30:00'),
(33, 2, '09:00:00'),
(33, 3, '12:00:00'),
(33, 3, '17:30:00'),
(33, 4, '12:00:00'),
(33, 5, '09:00:00'),
(34, 0, '11:00:00'),
(34, 1, '07:00:00'),
(34, 1, '21:30:00'),
(34, 2, '11:00:00'),
(34, 3, '07:00:00'),
(34, 3, '21:30:00'),
(34, 4, '11:00:00');

CREATE TABLE IF NOT EXISTS `bookings` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` text NOT NULL,
  `num_players` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `id_room` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `bookings` (`id`, `name`, `email`, `phone`, `num_players`, `date`, `id_room`, `price`, `notes`) VALUES
(3, 'Anónimo', 'info@test.es', '2147483647', 3, '2026-02-22 12:00:00', 33, 140, NULL),
(19, 'Bien', 'web@imagecreative.es', '66555444', 2, '2026-02-25 17:30:00', 33, 120, NULL),
(21, 'Miguel', 'web@imagecreative.es', '66555444', 2, '2026-02-27 09:00:37', 33, 120, NULL);

ALTER TABLE `autonomous_communities`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `idx_name` (`name`);

ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_role` (`role_id`);

ALTER TABLE `owners`
  ADD PRIMARY KEY (`user_id`);

ALTER TABLE `customers`
  ADD PRIMARY KEY (`user_id`),
  ADD KEY `idx_name` (`first_name`,`last_name`);

ALTER TABLE `escaperooms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `owner` (`owner`),
  ADD KEY `idx_name` (`name`);

ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `escaperoom_id` (`escaperoom_id`),
  ADD KEY `idx_name` (`name`);

ALTER TABLE `prices`
  ADD PRIMARY KEY (`id_room`,`num_players`);

ALTER TABLE `schedule`
  ADD PRIMARY KEY (`id_room`,`day_week`,`hour`);

ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bookings_ibfk_1` (`id_room`);

ALTER TABLE `autonomous_communities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

ALTER TABLE `escaperooms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

ALTER TABLE `rooms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);

ALTER TABLE `owners`
  ADD CONSTRAINT `owners_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

ALTER TABLE `customers`
  ADD CONSTRAINT `customers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

ALTER TABLE `escaperooms`
  ADD CONSTRAINT `escaperooms_ibfk_2` FOREIGN KEY (`owner`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `rooms`
  ADD CONSTRAINT `rooms_ibfk_1` FOREIGN KEY (`escaperoom_id`) REFERENCES `escaperooms` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `prices`
  ADD CONSTRAINT `precio_fk` FOREIGN KEY (`id_room`) REFERENCES `rooms` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `schedule`
  ADD CONSTRAINT `schedule_fk` FOREIGN KEY (`id_room`) REFERENCES `rooms` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`id_room`) REFERENCES `rooms` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT;