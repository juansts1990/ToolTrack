const express = require('express');
const router = express.Router();
const db = require('../config/database.js');

// GET - Obtener datos de empresa
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [empresas] = await db.query(
      'SELECT * FROM empresas WHERE id = ?',
      [id]
    );
    
    if (empresas.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Empresa no encontrada' 
      });
    }
    
    res.json({ success: true, data: empresas[0] });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT - Actualizar empresa
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, logo, nit, direccion, telefono, email } = req.body;
    
    await db.query(
      `UPDATE empresas 
       SET nombre = ?, logo = ?, nit = ?, direccion = ?, telefono = ?, email = ?
       WHERE id = ?`,
      [nombre, logo, nit, direccion, telefono, email, id]
    );
    
    res.json({ 
      success: true, 
      message: 'Empresa actualizada exitosamente' 
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;