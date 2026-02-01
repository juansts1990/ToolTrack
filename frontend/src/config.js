// Detectar si estamos en localhost o en la red
const hostname = window.location.hostname;

export const API_URL = hostname === 'localhost' 
  ? 'http://localhost:5000/api'
  : `http://${hostname}:5000/api`;