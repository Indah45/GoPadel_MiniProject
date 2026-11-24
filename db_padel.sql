-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 24, 2026 at 11:12 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_padel`
--

-- --------------------------------------------------------

--
-- Table structure for table `kategori`
--

CREATE TABLE `kategori` (
  `id` int(11) NOT NULL,
  `kode_kategori` varchar(20) NOT NULL,
  `nama_kategori` varchar(100) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kategori`
--

INSERT INTO `kategori` (`id`, `kode_kategori`, `nama_kategori`, `is_active`, `deleted_at`) VALUES
(1, 'KAT001', 'Indoor', 1, NULL),
(2, 'KAT002', 'Outdoor', 1, NULL),
(3, 'KAT003', 'Premium', 1, NULL),
(4, 'KAT004', 'PREMIUM', 1, '2026-11-23 09:24:45'),
(5, 'KAT005', 'PREMIUM', 1, '2026-11-24 05:08:20'),
(8, 'KAT006', 'PREMIUM', 1, '2026-11-24 09:40:21');

-- --------------------------------------------------------

--
-- Table structure for table `lapangan`
--

CREATE TABLE `lapangan` (
  `id` int(11) NOT NULL,
  `kategori_id` int(11) NOT NULL,
  `nama_lapangan` varchar(100) NOT NULL,
  `tipe_lapangan` varchar(50) DEFAULT NULL,
  `harga_per_jam` decimal(12,2) NOT NULL,
  `status` varchar(30) DEFAULT 'Tersedia',
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lapangan`
--

INSERT INTO `lapangan` (`id`, `kategori_id`, `nama_lapangan`, `tipe_lapangan`, `harga_per_jam`, `status`, `deleted_at`) VALUES
(1, 1, 'Lapangan A', 'Indoor', 150000.00, 'Tersedia', NULL),
(2, 2, 'Lapangan B', 'Outdoor', 120000.00, 'Tersedia', NULL),
(3, 3, 'Lapangan C', 'Premium', 200000.00, 'Tersedia', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `pemesanan`
--

CREATE TABLE `pemesanan` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `nama_lapangan` varchar(100) NOT NULL,
  `tanggal` date NOT NULL,
  `jam_mulai` time NOT NULL,
  `durasi` int(11) NOT NULL,
  `total_harga` decimal(12,2) NOT NULL,
  `status` enum('Menunggu','Dikonfirmasi','Dibatalkan') DEFAULT 'Menunggu',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pemesanan`
--

INSERT INTO `pemesanan` (`id`, `user_id`, `nama_lapangan`, `tanggal`, `jam_mulai`, `durasi`, `total_harga`, `status`, `created_at`) VALUES
(1, 2, 'Lapangan Reguler', '2026-11-26', '00:00:16', 2, 200000.00, 'Menunggu', '2026-11-24 08:36:56'),
(2, 2, 'Lapangan Premium', '2026-11-28', '00:00:17', 1, 150000.00, 'Menunggu', '2026-11-24 08:37:25'),
(3, 2, 'Lapangan VIP', '2026-11-26', '18:00:00', 2, 400000.00, 'Dibatalkan', '2026-11-24 09:09:39'),
(4, 2, 'Lapangan Premium', '2026-11-25', '18:00:00', 2, 300000.00, 'Dibatalkan', '2026-11-24 10:04:07');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `nama_role` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `nama_role`) VALUES
(1, 'admin'),
(2, 'user');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role_id` int(11) NOT NULL DEFAULT 2,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role_id`, `created_at`) VALUES
(1, 'Indah', 'indah@mail.com', '$2b$10$BhNffd1q9r3gjfX66YlNFeni4HXGIsCS8iwD1V6VocBLb200UuVRW', 1, '2026-11-24 04:18:07'),
(2, 'Indah Magdalena Silaban', 'magdalenasilaban07@gmail.com', '$2b$10$9ZLEu6/btzw5iM3l0Y7kXepzOEEx7xSk0eASvXGNkqUtEVaJ0DaWS', 2, '2026-11-24 05:39:52');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `kategori`
--
ALTER TABLE `kategori`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `kode_kategori` (`kode_kategori`);

--
-- Indexes for table `lapangan`
--
ALTER TABLE `lapangan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `kategori_id` (`kategori_id`);

--
-- Indexes for table `pemesanan`
--
ALTER TABLE `pemesanan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_pemesanan_users` (`user_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nama_role` (`nama_role`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `role_id` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `kategori`
--
ALTER TABLE `kategori`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `lapangan`
--
ALTER TABLE `lapangan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `pemesanan`
--
ALTER TABLE `pemesanan`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `lapangan`
--
ALTER TABLE `lapangan`
  ADD CONSTRAINT `lapangan_ibfk_1` FOREIGN KEY (`kategori_id`) REFERENCES `kategori` (`id`);

--
-- Constraints for table `pemesanan`
--
ALTER TABLE `pemesanan`
  ADD CONSTRAINT `fk_pemesanan_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
