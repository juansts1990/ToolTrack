require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/', (req, res) => {
  res.json({ 
    message: '✅ API ToolTrack funcionando',
    version: '1.0.0',
    database: process.env.DB_NAME,
    endpoints: [
      '/api/herramientas',
      '/api/empleados',
      '/api/prestamos'
    ]
  });
});

app.use('/api/herramientas', require('./routes/herramientas.routes.js'));
app.use('/api/auth', require('./routes/auth.routes.js'));
app.use('/api/empleados', require('./routes/empleados.routes.js'));
app.use('/api/empresas', require('./routes/empresas.routes.js'));
app.use('/api/usuarios', require('./routes/usuarios.routes.js'));
app.use('/api/prestamos', require('./routes/prestamos.routes.js'));
app.use('/api/mantenimientos', require('./routes/mantenimientos.routes.js'));
app.use('/api/alertas', require('./routes/alertas.routes.js'));
app.use('/api/dashboard', require('./routes/dashboard.routes.js'));
app.use('/api/mantenimientos', require('./routes/mantenimientos.routes.js'));
app.use('/api/contactos', require('./routes/contactos.routes.js'));

module.exports = app;

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
  console.log(`🌐 Accesible desde red en http://192.168.20.174:${PORT}`);
});