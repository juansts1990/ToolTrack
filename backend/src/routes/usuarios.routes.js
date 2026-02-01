const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/database.js');

// GET - Listar usuarios de una empresa
router.get('/', async (req, res) => {
  try {
    const empresa_id = req.query.empresa_id;
    
    if (!empresa_id) {
      return res.status(400).json({ success: false, message: 'empresa_id es requerido' });
    }
    
    const [usuarios] = await db.query(
      'SELECT id, nombre, email, rol, activo, created_at FROM usuarios WHERE empresa_id = ? ORDER BY nombre',
      [empresa_id]
    );
    
    res.json({ success: true, data: usuarios });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST - Crear nuevo usuario
router.post('/', async (req, res) => {
  try {
    const { nombre, email, password, rol, empresa_id } = req.body;
    
    if (!nombre || !email || !password || !rol || !empresa_id) {
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
    
    // Crear usuario
    const [result] = await db.query(
      'INSERT INTO usuarios (empresa_id, nombre, email, password, rol, activo) VALUES (?, ?, ?, ?, ?, ?)',
      [empresa_id, nombre, email, passwordHash, rol, 1]
    );
    
    res.status(201).json({ 
      success: true,
      message: 'Usuario creado exitosamente',
      data: {
        id: result.insertId,
        nombre,
        email,
        rol
      }
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT - Actualizar usuario
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, rol, activo } = req.body;
    
    await db.query(
      'UPDATE usuarios SET nombre = ?, email = ?, rol = ?, activo = ? WHERE id = ?',
      [nombre, email, rol, activo, id]
    );
    
    res.json({ success: true, message: 'Usuario actualizado exitosamente' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE - Desactivar usuario
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await db.query('UPDATE usuarios SET activo = 0 WHERE id = ?', [id]);
    
    res.json({ success: true, message: 'Usuario desactivado exitosamente' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT - Cambiar contraseña
router.put('/:id/password', async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    
    if (!password || password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'La contraseña debe tener al menos 6 caracteres' 
      });
    }
    
    const passwordHash = await bcrypt.hash(password, 10);
    
    await db.query('UPDATE usuarios SET password = ? WHERE id = ?', [passwordHash, id]);
    
    res.json({ success: true, message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT - Actualizar foto de perfil
router.put('/foto-perfil', async (req, res) => {
  try {
    const { usuario_id, foto_perfil } = req.body;
    
    if (!usuario_id || !foto_perfil) {
      return res.status(400).json({ 
        success: false, 
        message: 'usuario_id y foto_perfil son requeridos' 
      });
    }
    
    // Actualizar foto en base de datos
    const [result] = await db.query(
      'UPDATE usuarios SET foto_perfil = ? WHERE id = ?',
      [foto_perfil, usuario_id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Foto de perfil actualizada exitosamente' 
    });
    
  } catch (error) {
    console.error('Error al actualizar foto:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al actualizar foto de perfil' 
    });
  }
});

module.exports = router;