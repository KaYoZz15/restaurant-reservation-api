DROP DATABASE IF EXISTS restaurant_reservation;
CREATE DATABASE restaurant_reservation;
USE restaurant_reservation;

-- =========================
-- TABLE: users
-- =========================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    fname VARCHAR(100) NOT NULL,
    lname VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role ENUM('admin', 'client') NOT NULL DEFAULT 'client',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =========================
-- TABLE: restaurant_tables
-- =========================
CREATE TABLE restaurant_tables (
    id INT AUTO_INCREMENT PRIMARY KEY,
    table_number VARCHAR(20) NOT NULL UNIQUE,
    seats INT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- TABLE: menu_items
-- =========================
CREATE TABLE menu_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category ENUM('starter', 'main', 'dessert', 'drink') NOT NULL,
    image VARCHAR(255),
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- TABLE: reservations
-- =========================
CREATE TABLE reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    number_of_people INT NOT NULL,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    note TEXT,
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =========================
-- TABLE: reservation_tables
-- relation reservations <-> tables
-- =========================
CREATE TABLE reservation_tables (
    reservation_id INT NOT NULL,
    table_id INT NOT NULL,
    
    PRIMARY KEY (reservation_id, table_id),
    
    FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE CASCADE,
    FOREIGN KEY (table_id) REFERENCES restaurant_tables(id) ON DELETE CASCADE
);

-- =========================
-- DATA DE TEST
-- =========================

INSERT INTO users (email, password_hash, fname, lname, phone, role) VALUES
('admin@restaurant.com', 'hashedpassword', 'Admin', 'Restaurant', '0600000000', 'admin'),
('client@test.com', 'hashedpassword', 'Jean', 'Dupont', '0611223344', 'client');

INSERT INTO restaurant_tables (table_number, seats) VALUES
('T1', 2),
('T2', 2),
('T3', 4),
('T4', 4),
('T5', 6);

INSERT INTO menu_items (name, description, price, category) VALUES
('Salade César', 'Salade avec poulet et parmesan', 9.90, 'starter'),
('Burger Maison', 'Burger avec steak et fromage', 15.50, 'main'),
('Fondant Chocolat', 'Dessert au chocolat', 6.50, 'dessert'),
('Coca-Cola', '33cl', 3.50, 'drink');