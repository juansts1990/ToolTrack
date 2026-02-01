require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
  console.log(`Accesible desde red en http://192.168.20.174:${PORT}`);
});