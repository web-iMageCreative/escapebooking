-- NOMBRE DE LA BASE DE DATOS: escapebooking

CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL, -- 'owner', 'customer', 'admin'
    description VARCHAR(255)
);

-- 2. USERS TABLE (simplified)
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

-- 3. OWNERS TABLE (essential fields only)
CREATE TABLE owners (
    user_id INT PRIMARY KEY,
    business_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. CUSTOMERS TABLE (essential fields only)
CREATE TABLE customers (
    user_id INT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_name (first_name, last_name)
);

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