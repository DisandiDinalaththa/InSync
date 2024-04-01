--
-- Database: `insync`
--
CREATE DATABASE IF NOT EXISTS `insync` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `insync`;

-- --------------------------------------------------------

--
-- Table structure for table `personal_details`
--

CREATE TABLE `personal_details` (
  `Registration Number` int(5) NOT NULL,
  `Name` varchar(40) NOT NULL,
  `Password` varchar(10) NOT NULL,
  `Monthly Salary` int(10) NOT NULL,
  `Monthly Interest Rate` varchar(4) NOT NULL,
  `No. of years` int(2) NOT NULL,
  `Monthly Payment` int(10) NOT NULL,
  `Capital Payment` int(10) NOT NULL,
  `Interest in Rupees` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `personal_details`
--

INSERT INTO `personal_details` (`Registration Number`, `Name`, `Password`, `Monthly Salary`, `Monthly Interest Rate`, `No. of years`, `Monthly Payment`, `Capital Payment`, `Interest in Rupees`) VALUES
(1, 'Daichi Sawamura', 'SpyAir_123', 250000, '8%', 3, 7834, 6167, 1667),
(2, 'Koushi Sugawara', 'Bareboru_T', 200000, '12%', 4, 5267, 3267, 2000),
(3, 'Tetsuro Kuroo', 'Kodzuken_4', 500000, '5%', 5, 9436, 7352, 2083),
(4, 'Toru Oikawa', 'Kawa_Kawa', 450000, '7%', 4, 10776, 8151, 2625),
(5, 'Hajime Iwaizumi ', 'JNVT_AT', 350000, '10% ', 5, 7436, 4520, 2917),
(6, 'Koutaro Bokuto ', 'Keiji_xx', 400000, '8% ', 3, 9765, 7099, 2667),
(7, 'Asahi Azumane ', 'Little_Lib', 500000, '12%', 6, 9775, 4775, 5000),
(8, 'Yu Nishinoya', 'Sekaiwo', 350000, '10% ', 4, 7903, 6736, 1167),
(9, 'Haruki Nakayama ', 'Given04', 150000, '8%', 2, 6784, 5784, 1000),
(10, 'Shumei Sasaki ', 'Mi6ya_chan', 300000, '5%', 3, 8991, 7741, 1250);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `personal_details`
--
ALTER TABLE `personal_details`
  ADD PRIMARY KEY (`Registration Number`);
