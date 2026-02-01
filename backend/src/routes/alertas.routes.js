const express = require('express');
const router = express.Router();
const db = require('../config/database.js');

// GET - Todas las alertas no resueltas
router.get('/', async (req, res) => {
  try {
    const [alertas] = await db.query(`
      SELECT * FROM alertas 
      WHERE resuelta = FALSE 
      ORDER BY fecha_generada DESC
    `);
    res.json({ success: true, data: alertas });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET - Generar alertas automáticas
router.get('/generar', async (req, res) => {
  try {
    // Alertas mantenimientos próximos (30 días)
    const [mant] = await db.query(`
      SELECT m.id, m.fecha_programada, h.nombre, h.serial,
        DATEDIFF(m.fecha_programada, CURDATE()) as dias
      FROM mantenimientos m
      JOIN herramientas h ON m.herramienta_id = h.id
      WHERE m.estado = 'pendiente' 
        AND m.fecha_programada <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)
    `);
    
    // Alertas préstamos (más de 7 días)
    const [prest] = await db.query(`
      SELECT p.id, e.nombre, h.nombre as herramienta,
        DATEDIFF(CURDATE(), DATE(p.fecha_prestamo)) as dias
      FROM prestamos p
      JOIN empleados e ON p.empleado_id = e.id
      JOIN herramientas h ON p.herramienta_id = h.id
      WHERE p.estado = 'activo' 
        AND DATEDIFF(CURDATE(), DATE(p.fecha_prestamo)) > 7
    `);
    
    res.json({ 
      success: true, 
      data: {
        mantenimientos: mant,
        prestamos: prest,
        total: mant.length + prest.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT - Marcar como resuelta
router.put('/:id/resolver', async (req, res) => {
  try {
    await db.query('UPDATE alertas SET resuelta = TRUE WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Alerta resuelta' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;