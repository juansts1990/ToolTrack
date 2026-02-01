const express = require('express');
const router = express.Router();
const db = require('../config/database.js');

// GET - Listar todas las herramientas
router.get('/', async (req, res) => {
  try {
    const empresa_id = req.query.empresa_id;
    
    if (!empresa_id) {
      return res.status(400).json({ success: false, message: 'empresa_id es requerido' });
    }
    
    const [herramientas] = await db.query(
      'SELECT * FROM herramientas WHERE empresa_id = ? ORDER BY id DESC',
      [empresa_id]
    );
    res.json({ success: true, data: herramientas });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST - Crear herramienta
router.post('/', async (req, res) => {
  try {
    const { nombre, categoria, serial, valor_compra, fecha_compra, empresa_id } = req.body;
    
    if (!nombre || !empresa_id) {
      return res.status(400).json({ success: false, message: 'Nombre y empresa_id son requeridos' });
    }
    
    // Generar código QR único
    const timestamp = Date.now();
    const qr_code = `HERR-${serial || timestamp}`;
    
    const [result] = await db.query(
  'INSERT INTO herramientas (empresa_id, nombre, categoria, serial, valor_compra, fecha_compra, qr_code, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
  [empresa_id, nombre, categoria, serial, valor_compra, fecha_compra, qr_code, 'disponible']
);
    
    res.status(201).json({ 
      success: true, 
      message: 'Herramienta creada exitosamente',
      data: { id: result.insertId, qr_code }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT - Actualizar herramienta
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, categoria, serial, valor_compra, fecha_compra, estado } = req.body;
    
    const [result] = await db.query(
      'UPDATE herramientas SET nombre = ?, categoria = ?, serial = ?, valor_compra = ?, fecha_compra = ?, estado = ? WHERE id = ?',
      [nombre, categoria, serial, valor_compra, fecha_compra, estado, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Herramienta no encontrada' });
    }
    
    res.json({ success: true, message: 'Herramienta actualizada exitosamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE - Eliminar herramienta
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si tiene préstamos activos
    const [prestamos] = await db.query(
      'SELECT COUNT(*) as count FROM prestamos WHERE herramienta_id = ? AND estado = "activo"',
      [id]
    );
    
    if (prestamos[0].count > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No se puede eliminar una herramienta con préstamos activos' 
      });
    }
    
    const [result] = await db.query('DELETE FROM herramientas WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Herramienta no encontrada' });
    }
    
    res.json({ success: true, message: 'Herramienta eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;