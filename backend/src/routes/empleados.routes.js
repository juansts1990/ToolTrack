const express = require('express');
const router = express.Router();
const db = require('../config/database.js');

// GET - Listar empleados activos
router.get('/', async (req, res) => {
  try {
    const empresa_id = req.query.empresa_id;
    
    if (!empresa_id) {
      return res.status(400).json({ success: false, message: 'empresa_id es requerido' });
    }
    
    const [empleados] = await db.query(
      'SELECT * FROM empleados WHERE activo = 1 AND empresa_id = ? ORDER BY nombre',
      [empresa_id]
    );
    res.json({ success: true, data: empleados });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST - Crear empleado
router.post('/', async (req, res) => {
  try {
    const { nombre, identificacion, seccion, cargo, telefono, email, empresa_id } = req.body;
    
    if (!nombre || !identificacion || !empresa_id) {
      return res.status(400).json({ success: false, message: 'Nombre, identificación y empresa_id son requeridos' });
    }


    const qr_code = `EMP-${identificacion}`;
    
    const [result] = await db.query(
  'INSERT INTO empleados (empresa_id, nombre, identificacion, qr_code, seccion, cargo, telefono, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
  [empresa_id, nombre, identificacion, qr_code, seccion, cargo, telefono, email]
);


    res.status(201).json({ 
      success: true, 
      message: 'Empleado creado exitosamente',
      data: { id: result.insertId, qr_code } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT - Actualizar empleado
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, identificacion, seccion, cargo, telefono, email } = req.body;
    
    const [result] = await db.query(
      'UPDATE empleados SET nombre = ?, identificacion = ?, seccion = ?, cargo = ?, telefono = ?, email = ? WHERE id = ?',
      [nombre, identificacion, seccion, cargo, telefono, email, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Empleado no encontrado' });
    }
    
    res.json({ success: true, message: 'Empleado actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE - Eliminar (desactivar) empleado
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si tiene préstamos activos
    const [prestamos] = await db.query(
      'SELECT COUNT(*) as count FROM prestamos WHERE empleado_id = ? AND estado = "activo"',
      [id]
    );
    
    if (prestamos[0].count > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No se puede eliminar un empleado con préstamos activos' 
      });
    }
    
    // Desactivar en lugar de eliminar
    const [result] = await db.query('UPDATE empleados SET activo = 0 WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Empleado no encontrado' });
    }
    
    res.json({ success: true, message: 'Empleado eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;