const express = require('express');
const router = express.Router();
const db = require('../config/database.js');

// GET - Todos los mantenimientos
router.get('/', async (req, res) => {
  try {
    const empresa_id = req.query.empresa_id;
    
    if (!empresa_id) {
      return res.status(400).json({ success: false, message: 'empresa_id es requerido' });
    }
    
    const [mantenimientos] = await db.query(`
      SELECT m.*, h.nombre as herramienta
      FROM mantenimientos m
      JOIN herramientas h ON m.herramienta_id = h.id
      WHERE m.empresa_id = ?
      ORDER BY m.fecha_programada DESC
    `, [empresa_id]);
    res.json({ success: true, data: mantenimientos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// POST - Crear mantenimiento
router.post('/', async (req, res) => {
  try {
    const { herramienta_id, tipo, fecha_programada, costo, observaciones, empresa_id } = req.body;
    
    if (!herramienta_id || !tipo || !fecha_programada || !empresa_id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Herramienta, tipo, fecha programada y empresa_id son requeridos' 
      });
    }
    
    const [result] = await db.query(
      'INSERT INTO mantenimientos (empresa_id, herramienta_id, tipo, fecha_programada, costo, observaciones) VALUES (?, ?, ?, ?, ?, ?)',
      [empresa_id, herramienta_id, tipo, fecha_programada, costo, observaciones]
    );
    
    res.status(201).json({ 
      success: true, 
      message: 'Mantenimiento programado exitosamente',
      data: { id: result.insertId }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT - Actualizar mantenimiento
// PUT - Actualizar mantenimiento
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = [];
    const values = [];
    
    // Solo actualizar los campos que vienen en el body
    if (req.body.tipo !== undefined) {
      updates.push('tipo = ?');
      values.push(req.body.tipo);
    }
    if (req.body.fecha_programada !== undefined) {
      updates.push('fecha_programada = ?');
      values.push(req.body.fecha_programada);
    }
    if (req.body.costo !== undefined) {
      updates.push('costo = ?');
      values.push(req.body.costo);
    }
    if (req.body.observaciones !== undefined) {
      updates.push('observaciones = ?');
      values.push(req.body.observaciones);
    }
    if (req.body.estado !== undefined) {
      updates.push('estado = ?');
      values.push(req.body.estado);
    }
    if (req.body.fecha_realizada !== undefined) {
      updates.push('fecha_realizada = ?');
      values.push(req.body.fecha_realizada);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No hay campos para actualizar' });
    }
    
    values.push(id);
    
    const [result] = await db.query(
      `UPDATE mantenimientos SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Mantenimiento no encontrado' });
    }
    
    res.json({ success: true, message: 'Mantenimiento actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT - Marcar como realizado
router.put('/:id/realizar', async (req, res) => {
  try {
    const { id } = req.params;
    const { realizado_por, costo, observaciones } = req.body;
    
    const [result] = await db.query(
      'UPDATE mantenimientos SET estado = "realizado", fecha_realizada = NOW(), realizado_por = ?, costo = ?, observaciones = ? WHERE id = ?',
      [realizado_por, costo, observaciones, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Mantenimiento no encontrado' });
    }
    
    res.json({ success: true, message: 'Mantenimiento marcado como realizado' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE - Eliminar mantenimiento
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await db.query('DELETE FROM mantenimientos WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Mantenimiento no encontrado' });
    }
    
    res.json({ success: true, message: 'Mantenimiento eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;