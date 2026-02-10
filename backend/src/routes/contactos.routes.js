const express = require('express');
const router = express.Router();
const db = require('../config/database.js');

// POST - Guardar contacto
router.post('/', async (req, res) => {
  try {
    const { nombre, email, empresa, telefono, mensaje } = req.body;
    
    if (!nombre || !email || !telefono || !mensaje) {
      return res.status(400).json({ 
        success: false, 
        message: 'Nombre, email, teléfono y mensaje son requeridos' 
      });
    }
    
    const [result] = await db.query(
      'INSERT INTO contactos (nombre, email, empresa, telefono, mensaje) VALUES (?, ?, ?, ?, ?)',
      [nombre, email, empresa || null, telefono, mensaje]
    );
    
    res.status(201).json({ 
      success: true,
      message: 'Contacto registrado exitosamente',
      data: { id: result.insertId }
    });
    
  } catch (error) {
    console.error('Error al guardar contacto:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al guardar contacto' 
    });
  }
});

// GET - Listar todos los contactos
router.get('/', async (req, res) => {
  try {
    const [contactos] = await db.query(
      'SELECT * FROM contactos ORDER BY created_at DESC'
    );
    
    res.json({ success: true, data: contactos });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;