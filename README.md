# 🔧 ToolTrack
> Sistema SaaS de gestión de herramientas, préstamos y mantenimientos para empresas del sector construcción e industrial en Colombia.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

## ✨ Características
- ✅ Gestión de inventario de herramientas con fotos
- ✅ Control de préstamos a empleados
- ✅ Programación y seguimiento de mantenimientos
- ✅ Escaneo y generación de códigos QR
- ✅ Dashboard con estadísticas en tiempo real
- ✅ Reportes exportables en PDF y Excel
- ✅ Sistema de roles y permisos (Admin / Supervisor / Operario)
- ✅ Arquitectura multi-empresa (SaaS)

## 🛠️ Requisitos previos
- Node.js **v18 o superior**
- MySQL **v8.0 o superior**
- npm v9+

## 📦 Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/juansts1990/ToolTrack.git
cd ToolTrack
```

### 2. Configurar la base de datos
Importa el archivo `tabla_sql.txt` desde phpMyAdmin:
- Abre phpMyAdmin → crea la base de datos `tooltrack_db`
- Ve a la pestaña **Importar** → selecciona `tabla_sql.txt` → clic en **Importar**

Luego ejecuta manualmente este SQL para crear la tabla de contactos:
```sql
CREATE TABLE contactos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  empresa VARCHAR(100),
  telefono VARCHAR(20),
  mensaje TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 3. Configurar el Backend
```bash
cd backend
npm install
```

Crea el archivo `.env` dentro de la carpeta `backend/` con el siguiente contenido:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=tooltrack_db
JWT_SECRET=tooltrack_secret
PORT=3001
```

Luego inicia el servidor:
```bash
npm start
```

El backend queda disponible en `http://localhost:3001`

### 4. Configurar el Frontend
```bash
cd ../frontend
npm install
npm run dev
```

El frontend queda disponible en `http://localhost:5173`

## 🔑 Credenciales de demo (solo entorno local)

| Rol | Email | Contraseña |
|-----|-------|------------|
| Administrador | admin@tooltrack.com | 123456 |
| Supervisor | supervisor@tooltrack.com | 123456 |
| Empleado | empleado@tooltrack.com | 123456 |

## 📁 Estructura del proyecto
