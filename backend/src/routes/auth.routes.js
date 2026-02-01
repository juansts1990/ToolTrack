const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database.js');

const JWT_SECRET = 'tooltrack_secret_key_2024';

// POST - Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email y contraseña son requeridos' 
      });
    }
    
    const [usuarios] = await db.query(
      'SELECT * FROM usuarios WHERE email = ? AND activo = TRUE',
      [email]
    );
    
    if (usuarios.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Email o contraseña incorrectos' 
      });
    }
    
    const usuario = usuarios[0];
    const passwordValido = await bcrypt.compare(password, usuario.password);
    
    if (!passwordValido) {
      return res.status(401).json({ 
        success: false, 
        message: 'Email o contraseña incorrectos' 
      });
    }
    
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    const expiraEn = new Date();
    expiraEn.setDate(expiraEn.getDate() + 7);
    
    await db.query(
      'INSERT INTO sesiones (usuario_id, token, expira_en, ip_address) VALUES (?, ?, ?, ?)',
      [usuario.id, token, expiraEn, req.ip]
    );
    
    await db.query(
      'UPDATE usuarios SET updated_at = NOW() WHERE id = ?',
      [usuario.id]
    );
    
    res.json({ 
  success: true,
  message: 'Login exitoso',
  data: {
    token,
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      empresa: usuario.empresa || 'Sin empresa',
      empresa_id: usuario.empresa_id
    }
  }
});
    
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al iniciar sesión' 
    });
  }
});

// POST - Registro de nuevo usuario
// POST - Registro de nuevo usuario
router.post('/registro', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    
    if (!nombre || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Todos los campos son requeridos' 
      });
    }
    
    // Verificar si el email ya existe
    const [usuarioExistente] = await db.query(
      'SELECT id FROM usuarios WHERE email = ?',
      [email]
    );
    
    if (usuarioExistente.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Este email ya está registrado' 
      });
    }
    
    // Hashear contraseña
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Crear usuario (empresa_id = 1 por defecto)
    const [result] = await db.query(
      'INSERT INTO usuarios (empresa_id, nombre, email, password, rol, activo) VALUES (?, ?, ?, ?, ?, ?)',
      [1, nombre, email, passwordHash, 'admin', 1]
    );
    
    res.status(201).json({ 
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        id: result.insertId,
        nombre,
        email
      }
    });
    
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al registrar usuario' 
    });
  }
});

module.exports = router;