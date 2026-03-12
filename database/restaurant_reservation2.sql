-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : jeu. 12 mars 2026 à 10:51
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `restaurant_reservation`
--

-- --------------------------------------------------------

--
-- Structure de la table `menu_items`
--

CREATE TABLE `menu_items` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `category` enum('starter','main','dessert','drink') NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `is_available` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `menu_items`
--

INSERT INTO `menu_items` (`id`, `name`, `description`, `price`, `category`, `image`, `is_available`, `created_at`) VALUES
(1, 'Salade César', 'Salade avec poulet et parmesan', 9.90, 'starter', NULL, 1, '2026-03-10 08:28:47'),
(2, 'Burger Maison', 'Burger avec steak et fromage', 15.50, 'main', NULL, 1, '2026-03-10 08:28:47'),
(3, 'Fondant Chocolat', 'Dessert au chocolat', 6.50, 'dessert', NULL, 1, '2026-03-10 08:28:47'),
(4, 'Coca-Cola', '33cl', 3.50, 'drink', NULL, 1, '2026-03-10 08:28:47');

-- --------------------------------------------------------

--
-- Structure de la table `opening_exceptions`
--

CREATE TABLE `opening_exceptions` (
  `id` int(11) NOT NULL,
  `exception_date` date NOT NULL,
  `is_closed` tinyint(1) NOT NULL DEFAULT 1,
  `reason` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `opening_exceptions`
--

INSERT INTO `opening_exceptions` (`id`, `exception_date`, `is_closed`, `reason`, `created_at`) VALUES
(1, '2026-06-20', 1, 'Ceci est une raison.', '2026-03-12 09:50:29');

-- --------------------------------------------------------

--
-- Structure de la table `opening_slots`
--

CREATE TABLE `opening_slots` (
  `id` int(11) NOT NULL,
  `day_of_week` tinyint(4) NOT NULL,
  `slot_time` time NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `opening_slots`
--

INSERT INTO `opening_slots` (`id`, `day_of_week`, `slot_time`, `is_active`, `created_at`) VALUES
(1, 1, '12:00:00', 1, '2026-03-12 09:41:33'),
(2, 1, '13:00:00', 1, '2026-03-12 09:41:33'),
(3, 1, '19:00:00', 1, '2026-03-12 09:41:33'),
(4, 1, '20:30:00', 1, '2026-03-12 09:41:33'),
(5, 2, '12:00:00', 1, '2026-03-12 09:41:33'),
(6, 2, '13:00:00', 1, '2026-03-12 09:41:33'),
(7, 2, '19:00:00', 1, '2026-03-12 09:41:33'),
(8, 2, '20:30:00', 1, '2026-03-12 09:41:33'),
(9, 3, '12:00:00', 1, '2026-03-12 09:41:33'),
(10, 3, '13:00:00', 1, '2026-03-12 09:41:33'),
(11, 3, '19:00:00', 1, '2026-03-12 09:41:33'),
(12, 3, '20:30:00', 1, '2026-03-12 09:41:33'),
(13, 4, '12:00:00', 1, '2026-03-12 09:41:33'),
(14, 4, '13:00:00', 1, '2026-03-12 09:41:33'),
(15, 4, '19:00:00', 1, '2026-03-12 09:41:33'),
(16, 4, '20:30:00', 1, '2026-03-12 09:41:33'),
(17, 5, '12:00:00', 1, '2026-03-12 09:41:33'),
(18, 5, '13:00:00', 1, '2026-03-12 09:41:33'),
(19, 5, '19:00:00', 1, '2026-03-12 09:41:33'),
(20, 5, '20:30:00', 1, '2026-03-12 09:41:33'),
(21, 6, '12:00:00', 1, '2026-03-12 09:41:33'),
(22, 6, '13:00:00', 1, '2026-03-12 09:41:33'),
(23, 6, '19:00:00', 1, '2026-03-12 09:41:33'),
(24, 6, '20:30:00', 1, '2026-03-12 09:41:33');

-- --------------------------------------------------------

--
-- Structure de la table `opening_slot_exceptions`
--

CREATE TABLE `opening_slot_exceptions` (
  `id` int(11) NOT NULL,
  `exception_date` date NOT NULL,
  `slot_time` time NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `reservations`
--

CREATE TABLE `reservations` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `number_of_people` int(11) NOT NULL,
  `reservation_date` date NOT NULL,
  `reservation_time` time NOT NULL,
  `note` text DEFAULT NULL,
  `status` enum('pending','confirmed','cancelled') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `reservations`
--

INSERT INTO `reservations` (`id`, `user_id`, `name`, `phone`, `number_of_people`, `reservation_date`, `reservation_time`, `note`, `status`, `created_at`) VALUES
(1, 3, 'Jean Dupont', '0611223344', 4, '2026-03-20', '20:00:00', 'Table proche fenetre', 'pending', '2026-03-12 06:42:51'),
(2, 3, 'Jean Dupont', '0611223344', 2, '2026-03-21', '19:30:00', 'Mise a jour de la reservation', 'pending', '2026-03-12 06:43:55'),
(3, 3, 'Jean Dupont', '0611223344', 2, '2026-03-21', '19:30:00', 'Mise a jour de la reservation', 'confirmed', '2026-03-12 07:08:10');

-- --------------------------------------------------------

--
-- Structure de la table `reservation_tables`
--

CREATE TABLE `reservation_tables` (
  `reservation_id` int(11) NOT NULL,
  `table_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `reservation_tables`
--

INSERT INTO `reservation_tables` (`reservation_id`, `table_id`) VALUES
(1, 3),
(2, 1),
(3, 1);

-- --------------------------------------------------------

--
-- Structure de la table `restaurant_tables`
--

CREATE TABLE `restaurant_tables` (
  `id` int(11) NOT NULL,
  `table_number` varchar(20) NOT NULL,
  `seats` int(11) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `restaurant_tables`
--

INSERT INTO `restaurant_tables` (`id`, `table_number`, `seats`, `is_active`, `created_at`) VALUES
(1, 'T1', 2, 1, '2026-03-10 08:28:47'),
(2, 'T2', 2, 1, '2026-03-10 08:28:47'),
(3, 'T3', 4, 1, '2026-03-10 08:28:47'),
(4, 'T4', 4, 1, '2026-03-10 08:28:47'),
(5, 'T5', 6, 1, '2026-03-10 08:28:47');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `fname` varchar(100) NOT NULL,
  `lname` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role` enum('admin','client') NOT NULL DEFAULT 'client',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `email`, `password_hash`, `fname`, `lname`, `phone`, `role`, `created_at`, `updated_at`) VALUES
(1, 'admin@restaurant.com', 'hashedpassword', 'Admin', 'Restaurant', '0600000000', 'admin', '2026-03-10 08:28:46', '2026-03-10 08:28:46'),
(2, 'client@test.com', 'hashedpassword', 'Jean', 'Dupont', '0611223344', 'client', '2026-03-10 08:28:46', '2026-03-10 08:28:46'),
(3, 'john@example.com', '$2a$10$D9h.j4HbXRvft2jtsSmRL.T4GH6lF0OfpOOMXgLKiqDCyD1wUo4w.', 'John', 'Doe', '0611223344', 'client', '2026-03-11 16:53:50', '2026-03-12 07:10:31');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `menu_items`
--
ALTER TABLE `menu_items`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `opening_exceptions`
--
ALTER TABLE `opening_exceptions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `exception_date` (`exception_date`);

--
-- Index pour la table `opening_slots`
--
ALTER TABLE `opening_slots`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_day_slot` (`day_of_week`,`slot_time`);

--
-- Index pour la table `opening_slot_exceptions`
--
ALTER TABLE `opening_slot_exceptions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_exception_slot` (`exception_date`,`slot_time`);

--
-- Index pour la table `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `reservation_tables`
--
ALTER TABLE `reservation_tables`
  ADD PRIMARY KEY (`reservation_id`,`table_id`),
  ADD KEY `table_id` (`table_id`);

--
-- Index pour la table `restaurant_tables`
--
ALTER TABLE `restaurant_tables`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `table_number` (`table_number`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `menu_items`
--
ALTER TABLE `menu_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `opening_exceptions`
--
ALTER TABLE `opening_exceptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `opening_slots`
--
ALTER TABLE `opening_slots`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT pour la table `opening_slot_exceptions`
--
ALTER TABLE `opening_slot_exceptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `reservations`
--
ALTER TABLE `reservations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `restaurant_tables`
--
ALTER TABLE `restaurant_tables`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `reservation_tables`
--
ALTER TABLE `reservation_tables`
  ADD CONSTRAINT `reservation_tables_ibfk_1` FOREIGN KEY (`reservation_id`) REFERENCES `reservations` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reservation_tables_ibfk_2` FOREIGN KEY (`table_id`) REFERENCES `restaurant_tables` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
