-- NOMBRE DE LA BASE DE DATOS: escapebooking

-- 1. AUTONOMOUS_COMMUNITIES TABLE
CREATE TABLE autonomous_communities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(2) UNIQUE NOT NULL,  -- Código CA
    name VARCHAR(50) UNIQUE NOT NULL, -- Nombre completo
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (name)
);

-- 2. PROVINCES TABLE
CREATE TABLE provinces (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(2) UNIQUE NOT NULL,  -- Código provincia INE
    name VARCHAR(50) NOT NULL,
    autonomous_community_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (autonomous_community_id) 
        REFERENCES autonomous_communities(id) ON DELETE CASCADE,
    INDEX idx_name (name),
    INDEX idx_community (autonomous_community_id),
    UNIQUE KEY unique_province (code, autonomous_community_id)
);

-- 3. ROLES TABLE
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL, -- 'owner', 'customer', 'admin'
    description VARCHAR(255)
);

-- 4. USERS TABLE (simplified)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id),
    INDEX idx_email (email),
    INDEX idx_role (role_id)
);

-- 5. OWNERS TABLE (essential fields only)
CREATE TABLE owners (
    user_id INT PRIMARY KEY,
    business_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. CUSTOMERS TABLE (essential fields only)
CREATE TABLE customers (
    user_id INT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_name (first_name, last_name)
);

-- 7. ESCAPEROOMS TABLE
CREATE TABLE escaperooms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    address VARCHAR(100) NOT NULL,
    province INT NOT NULL,
    owner INT,
    FOREIGN KEY (province) REFERENCES provinces(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (owner) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_name (name)
);

CREATE TABLE `rooms` (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  duration INT(11) NOT NULL,
  min_players int(11) DEFAULT 1,
  max_players int(11) DEFAULT NULL,
  escaperoom_id int(11) NOT NULL,
  FOREIGN KEY (escaperoom_id) REFERENCES escaperooms(id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_name (name)
);


CREATE TABLE `prices` (
  `id_room` int(11) NOT NULL,
  `num_players` int(11) NOT NULL,
  `price` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE `prices`
  ADD PRIMARY KEY (`id_room`,`num_players`);

ALTER TABLE `prices` ADD CONSTRAINT `precio_fk` FOREIGN KEY (`id_room`) REFERENCES `rooms`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;



INSERT IGNORE INTO roles (name, description) VALUES 
('owner', 'Propietario de negocios de EscapeRooms'),
('customer', 'Clientes normales'),
('admin', 'Administrador del sistema');

-- Insert test ADMIN user (password: admin123)
INSERT INTO users (email, password_hash, role_id) VALUES 
('admin@escapebooking.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 3);

-- Insert test OWNER users (password: owner123)
INSERT INTO users (email, password_hash, role_id) VALUES 
('madrid@escaperooms.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1),
('barcelona@escapefun.es', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1),
('valencia@puzzleescape.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1);

-- Insert test CUSTOMER users (password: customer123)
INSERT INTO users (email, password_hash, role_id) VALUES 
('juan.perez@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 2),
('maria.garcia@hotmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 2),
('alex.smith@yahoo.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 2);

-- Insert OWNERS data
INSERT INTO owners (user_id, business_name, phone, address, city) VALUES 
(2, 'Madrid Escape Masters', '+34111222333', 'Calle Gran Vía 123', 'Madrid'),
(3, 'Barcelona Puzzle World', '+34222333444', 'Avenida Diagonal 456', 'Barcelona'),
(4, 'Valencia Mystery Rooms', '+34333444555', 'Plaza del Ayuntamiento 789', 'Valencia');

-- Insert CUSTOMERS data
INSERT INTO customers (user_id, first_name, last_name, phone) VALUES 
(5, 'Juan', 'Pérez', '+34666777888'),
(6, 'María', 'García', '+34777888999'),
(7, 'Alex', 'Smith', '+34888999000');

INSERT INTO `rooms` (`id`, `name`, `description`, `duration`, `escaperoom_id`, `min_players`, `max_players`) 
    VALUES ('5', 'Sala 378', 'as fa fas aufbdb as dfb sd bfbsdf', '160', '1', '1', '6');

INSERT INTO autonomous_communities (code, name) VALUES
('01', 'Andalucía'),
('02', 'Aragón'),
('03', 'Asturias, Principado de'),
('04', 'Balears, Illes'),
('05', 'Canarias'),
('06', 'Cantabria'),
('07', 'Castilla y León'),
('08', 'Castilla-La Mancha'),
('09', 'Catalunya'),
('10', 'Comunitat Valenciana'),
('11', 'Extremadura'),
('12', 'Galicia'),
('13', 'Madrid, Comunidad de'),
('14', 'Murcia, Región de'),
('15', 'Navarra, Comunidad Foral de'),
('16', 'País Vasco'),
('17', 'Rioja, La'),
('18', 'Ceuta'),
('19', 'Melilla');


-- Inserción completa de provincias con sus CCAA
INSERT INTO provinces (code, name, autonomous_community_id) VALUES
-- Andalucía (id 1)
('04', 'Almería', 1),
('11', 'Cádiz', 1),
('14', 'Córdoba', 1),
('18', 'Granada', 1),
('21', 'Huelva', 1),
('23', 'Jaén', 1),
('29', 'Málaga', 1),
('41', 'Sevilla', 1),

-- Aragón (id 2)
('22', 'Huesca', 2),
('44', 'Teruel', 2),
('50', 'Zaragoza', 2),

-- Asturias (id 3)
('33', 'Asturias', 3),

-- Baleares (id 4)
('07', 'Balears, Illes', 4),

-- Canarias (id 5)
('35', 'Las Palmas', 5),
('38', 'Santa Cruz de Tenerife', 5),

-- Cantabria (id 6)
('39', 'Cantabria', 6),

-- Castilla y León (id 7)
('05', 'Ávila', 7),
('09', 'Burgos', 7),
('24', 'León', 7),
('34', 'Palencia', 7),
('37', 'Salamanca', 7),
('40', 'Segovia', 7),
('42', 'Soria', 7),
('47', 'Valladolid', 7),
('49', 'Zamora', 7),

-- Castilla-La Mancha (id 8)
('02', 'Albacete', 8),
('13', 'Ciudad Real', 8),
('16', 'Cuenca', 8),
('19', 'Guadalajara', 8),
('45', 'Toledo', 8),

-- Catalunya (id 9)
('08', 'Barcelona', 9),
('17', 'Girona', 9),
('25', 'Lleida', 9),
('43', 'Tarragona', 9),

-- Comunitat Valenciana (id 10)
('03', 'Alacant/Alicante', 10),
('12', 'Castelló/Castellón', 10),
('46', 'Valencia/València', 10),

-- Extremadura (id 11)
('06', 'Badajoz', 11),
('10', 'Cáceres', 11),

-- Galicia (id 12)
('15', 'Coruña, A', 12),
('27', 'Lugo', 12),
('32', 'Ourense', 12),
('36', 'Pontevedra', 12),

-- Madrid (id 13)
('28', 'Madrid', 13),

-- Murcia (id 14)
('30', 'Murcia', 14),

-- Navarra (id 15)
('31', 'Navarra', 15),

-- País Vasco (id 16)
('01', 'Araba/Álava', 16),
('48', 'Bizkaia', 16),
('20', 'Gipuzkoa', 16),

-- La Rioja (id 17)
('26', 'Rioja, La', 17),

-- Ceuta (id 18)
('51', 'Ceuta', 18),

-- Melilla (id 19)
('52', 'Melilla', 19);