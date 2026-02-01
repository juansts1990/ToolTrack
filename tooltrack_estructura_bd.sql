-- ============================================
-- TOOLTRACK DATABASE - ESTRUCTURA COMPLETA
-- Fecha: 2026-01-27
-- ============================================

DROP DATABASE IF EXISTS tooltrack_db;
CREATE DATABASE tooltrack_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tooltrack_db;

-- Tabla empresas
CREATE TABLE empresas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  nit VARCHAR(20) NOT NULL UNIQUE,
  direccion VARCHAR(200),
  telefono VARCHAR(20),
  email VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla usuarios (con foto_perfil)
CREATE TABLE usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  empresa_id INT NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  foto_perfil VARCHAR(255) NULL,
  rol ENUM('admin', 'supervisor', 'empleado') DEFAULT 'empleado',
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla sesiones
CREATE TABLE sesiones (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  token VARCHAR(500) NOT NULL,
  fecha_inicio DATETIME DEFAULT CURRENT_TIMESTAMP,
  expira_en DATETIME NOT NULL,
  ip_address VARCHAR(50),
  activa BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla herramientas
CREATE TABLE herramientas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  empresa_id INT NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  marca VARCHAR(50),
  modelo VARCHAR(50),
  serial VARCHAR(100) UNIQUE,
  categoria VARCHAR(50),
  estado ENUM('disponible', 'en_uso', 'mantenimiento') DEFAULT 'disponible',
  valor_compra DECIMAL(10,2),
  fecha_compra DATE,
  ubicacion VARCHAR(100),
  observaciones TEXT,
  qr_code VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla empleados (con qr_code)
CREATE TABLE empleados (
  id INT PRIMARY KEY AUTO_INCREMENT,
  empresa_id INT NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  identificacion VARCHAR(20) NOT NULL,
  qr_code VARCHAR(255) NULL,
  seccion VARCHAR(50),
  cargo VARCHAR(50),
  telefono VARCHAR(20),
  email VARCHAR(100),
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_identificacion_empresa (identificacion, empresa_id),
  FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla prestamos (con usuario_registro_id)
CREATE TABLE prestamos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  empresa_id INT NOT NULL,
  herramienta_id INT NOT NULL,
  empleado_id INT NOT NULL,
  usuario_registro_id INT NULL,
  fecha_prestamo DATETIME NOT NULL,
  fecha_devolucion DATETIME,
  estado ENUM('activo', 'devuelto') DEFAULT 'activo',
  observaciones TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
  FOREIGN KEY (herramienta_id) REFERENCES herramientas(id) ON DELETE CASCADE,
  FOREIGN KEY (empleado_id) REFERENCES empleados(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_registro_id) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla mantenimientos
CREATE TABLE mantenimientos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  empresa_id INT NOT NULL,
  herramienta_id INT NOT NULL,
  tipo ENUM('preventivo', 'correctivo') NOT NULL,
  fecha_programada DATE NOT NULL,
  fecha_realizada DATE,
  costo DECIMAL(10,2),
  realizado_por VARCHAR(100),
  observaciones TEXT,
  estado ENUM('pendiente', 'realizado', 'vencido') DEFAULT 'pendiente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
  FOREIGN KEY (herramienta_id) REFERENCES herramientas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- DATOS DE DEMOSTRACIÓN
-- ============================================

-- Insertar empresa demo
INSERT INTO empresas (nombre, nit, direccion, telefono, email) VALUES
('ToolTrack Demo S.A.S', '900123456-7', 'Calle 123 #45-67, Cali', '3001234567', 'info@tooltrack.com');

-- Insertar usuarios (password: 123456 para todos)
INSERT INTO usuarios (empresa_id, nombre, email, password, rol) VALUES
(1, 'Admin ToolTrack', 'admin@tooltrack.com', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'admin'),
(1, 'Supervisor Demo', 'supervisor@tooltrack.com', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'supervisor'),
(1, 'Empleado Demo', 'empleado@tooltrack.com', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'empleado');

-- Insertar empleados
INSERT INTO empleados (empresa_id, nombre, identificacion, qr_code, seccion, cargo, telefono) VALUES
(1, 'Luis Martínez', '1098765432', 'EMP-1098765432', 'Construcción', 'Operario', '3101234567'),
(1, 'María Gómez', '1234567890', 'EMP-1234567890', 'Construcción', 'Técnico', '3209876543'),
(1, 'Carlos Rodríguez', '1112223334', 'EMP-1112223334', 'Mantenimiento', 'Jefe de Cuadrilla', '3156789012'),
(1, 'Pedro Sánchez', '9998887776', 'EMP-9998887776', 'Construcción', 'Ayudante', '3187654321');

-- Insertar herramientas
INSERT INTO herramientas (empresa_id, nombre, marca, modelo, serial, categoria, estado, valor_compra, fecha_compra, qr_code) VALUES
(1, 'Taladro Percutor 20V DeWalt', 'DeWalt', 'DCD996', 'DW-TD-2024-001', 'Herramientas Eléctricas', 'disponible', 850000, '2024-01-15', 'HERR-DW-TD-2024-001'),
(1, 'Taladro de Impacto Milwaukee', 'Milwaukee', 'M18', 'MIL-TI-2024-002', 'Herramientas Eléctricas', 'disponible', 920000, '2024-02-20', 'HERR-MIL-TI-2024-002'),
(1, 'Sierra Circular 7¼" Makita', 'Makita', '5007MG', 'MAK-SC-2024-003', 'Herramientas Eléctricas', 'disponible', 650000, '2024-03-10', 'HERR-MAK-SC-2024-003'),
(1, 'Lijadora Orbital Black&Decker', 'Black&Decker', 'BDERO100', 'BD-LO-2024-004', 'Herramientas Eléctricas', 'disponible', 280000, '2024-04-05', 'HERR-BD-LO-2024-004'),
(1, 'Amoladora Angular 4½" Bosch', 'Bosch', 'GWS 750', 'BSH-AA-2024-005', 'Herramientas Eléctricas', 'disponible', 380000, '2024-05-12', 'HERR-BSH-AA-2024-005');

-- Insertar préstamos de ejemplo
INSERT INTO prestamos (empresa_id, herramienta_id, empleado_id, usuario_registro_id, fecha_prestamo, estado) VALUES
(1, 1, 1, 1, '2026-01-20 08:00:00', 'activo'),
(1, 2, 2, 1, '2026-01-21 09:00:00', 'activo');

-- Insertar mantenimientos
INSERT INTO mantenimientos (empresa_id, herramienta_id, tipo, fecha_programada, costo, estado) VALUES
(1, 1, 'preventivo', '2026-02-15', 50000, 'pendiente'),
(1, 3, 'preventivo', '2026-02-20', 30000, 'pendiente'),
(1, 5, 'correctivo', '2026-01-25', 80000, 'pendiente');

-- ============================================
-- CREDENCIALES DE ACCESO
-- ============================================
-- Email: admin@tooltrack.com | Password: 123456
-- Email: supervisor@tooltrack.com | Password: 123456
-- Email: empleado@tooltrack.com | Password: 123456