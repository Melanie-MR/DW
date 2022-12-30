-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 30-12-2022 a las 23:10:58
-- Versión del servidor: 10.4.25-MariaDB
-- Versión de PHP: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `dw`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cities`
--

CREATE TABLE `cities` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `countries_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `cities`
--

INSERT INTO `cities` (`id`, `name`, `countries_id`) VALUES
(24, 'Caracas', 23),
(26, 'barcelona', 23),
(29, 'Verona', 28),
(30, 'Roma', 28);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `companies`
--

CREATE TABLE `companies` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `address` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone_number` int(25) NOT NULL,
  `isActive` tinyint(4) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  `cities_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `companies`
--

INSERT INTO `companies` (`id`, `name`, `address`, `email`, `phone_number`, `isActive`, `created_at`, `updated_at`, `cities_id`) VALUES
(4, 'Globant', 'Ruta 45', 'globant@gmail.com', 2147483647, 1, '2022-12-30 02:58:43', '2022-12-30 17:59:20', 26),
(9, 'Mercadolibre', 'Callao1234', 'mercado@libre.com', 1165800000, 1, '2022-12-30 18:44:45', '2022-12-30 18:44:45', 24);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `contacts`
--

CREATE TABLE `contacts` (
  `id` int(11) NOT NULL,
  `firstname` varchar(100) NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `position` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `address` varchar(100) NOT NULL,
  `cities_id` int(11) NOT NULL,
  `companies_id` int(11) NOT NULL,
  `interest` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `contacts`
--

INSERT INTO `contacts` (`id`, `firstname`, `lastname`, `position`, `email`, `address`, `cities_id`, `companies_id`, `interest`) VALUES
(7, 'Roberta', 'Perez', 'recepcionista', 'ro@perezcom', 'la matanza', 26, 4, 50);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `countries`
--

CREATE TABLE `countries` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `region_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `countries`
--

INSERT INTO `countries` (`id`, `name`, `region_id`) VALUES
(23, 'Venezuela', 1),
(27, 'Ecuador', 1),
(28, 'Italy', 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `regions`
--

CREATE TABLE `regions` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `regions`
--

INSERT INTO `regions` (`id`, `name`) VALUES
(1, 'South America'),
(5, 'Europa');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `firstname` varchar(100) NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `isAdmin` tinyint(1) NOT NULL DEFAULT 0,
  `password` varchar(100) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  `username` varchar(100) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `firstname`, `lastname`, `email`, `isAdmin`, `password`, `created_at`, `updated_at`, `username`, `isActive`) VALUES
(58, 'Admin', 'Acamica', 'acamica@acamica.com', 1, '$2a$05$tHyLuWJx.FUDubHMNJvXZOU2H/OCgHXt6wcx6YebMYs9Vv.8Al.pK', '2022-12-30 21:56:51', '2022-12-30 21:56:51', 'admin', 1),
(59, 'Basic', 'Acamica', 'basic@acamica.com', 0, '$2a$05$JAVW7AaQfgKoNvR4ulmYculot7LwqrVsOV5FN4ByguDdphqQskshK', '2022-12-30 21:59:07', '2022-12-30 21:59:07', 'basic', 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `cities`
--
ALTER TABLE `cities`
  ADD PRIMARY KEY (`id`,`countries_id`),
  ADD KEY `fk_cities_country_idx` (`countries_id`);

--
-- Indices de la tabla `companies`
--
ALTER TABLE `companies`
  ADD PRIMARY KEY (`id`,`cities_id`),
  ADD KEY `fk_companies_cities_idx` (`cities_id`);

--
-- Indices de la tabla `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_contacts_cities` (`cities_id`),
  ADD KEY `fk_contacts_companies` (`companies_id`);

--
-- Indices de la tabla `countries`
--
ALTER TABLE `countries`
  ADD PRIMARY KEY (`id`,`region_id`),
  ADD KEY `fk_countries_region_idx` (`region_id`);

--
-- Indices de la tabla `regions`
--
ALTER TABLE `regions`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email_UNIQUE` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `cities`
--
ALTER TABLE `cities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT de la tabla `companies`
--
ALTER TABLE `companies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `countries`
--
ALTER TABLE `countries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT de la tabla `regions`
--
ALTER TABLE `regions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `cities`
--
ALTER TABLE `cities`
  ADD CONSTRAINT `fk_cities_country` FOREIGN KEY (`countries_id`) REFERENCES `countries` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Filtros para la tabla `companies`
--
ALTER TABLE `companies`
  ADD CONSTRAINT `fk_companies_cities` FOREIGN KEY (`cities_id`) REFERENCES `cities` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Filtros para la tabla `contacts`
--
ALTER TABLE `contacts`
  ADD CONSTRAINT `fk_contacts_cities` FOREIGN KEY (`cities_id`) REFERENCES `cities` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_contacts_companies` FOREIGN KEY (`companies_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Filtros para la tabla `countries`
--
ALTER TABLE `countries`
  ADD CONSTRAINT `fk_countries_regions` FOREIGN KEY (`region_id`) REFERENCES `regions` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
