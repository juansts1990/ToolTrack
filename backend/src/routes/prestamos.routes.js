const express = require('express');
const router = express.Router();
const db = require('../config/database.js');


// GET - Todos los préstamos
router.get('/', async (req, res) => {
  try {
    const empresa_id = req.query.empresa_id;
    
    if (!empresa_id) {
      return res.status(400).json({ success: false, message: 'empresa_id es requerido' });
    }
    
    const [prestamos] = await db.query(`
      SELECT p.*, 
             h.nombre as herramienta, 
             e.nombre as empleado,
             u.nombre as usuario_registro
      FROM prestamos p
      JOIN herramientas h ON p.herramienta_id = h.id
      JOIN empleados e ON p.empleado_id = e.id
      LEFT JOIN usuarios u ON p.usuario_registro_id = u.id
      WHERE p.empresa_id = ?
      ORDER BY p.fecha_prestamo DESC
    `, [empresa_id]);
    res.json({ success: true, data: prestamos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


router.get('/activos', async (req, res) => {
  try {
    const [prestamos] = await db.query(`
      SELECT p.*, h.nombre as herramienta, e.nombre as empleado
      FROM prestamos p
      JOIN herramientas h ON p.herramienta_id = h.id
      JOIN empleados e ON p.empleado_id = e.id
      WHERE p.estado = 'activo'
      ORDER BY p.fecha_prestamo DESC
    `);
    res.json({ success: true, data: prestamos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST - Registrar préstamo (CON VALIDACIONES)
router.post('/', async (req, res) => {
  try {
    const { herramienta_id, empleado_id, usuario_registro_id, empresa_id } = req.body;
    
    if (!empresa_id) {
      return res.status(400).json({ success: false, message: 'empresa_id es requerido' });
    }
    
    // Validar herramienta existe
    const [herr] = await db.query('SELECT estado FROM herramientas WHERE id = ?', [herramienta_id]);
    if (herr.length === 0) {
      return res.status(404).json({ success: false, message: 'Herramienta no existe' });
    }
    
    // Validar no está prestada
    if (herr[0].estado !== 'disponible') {
      return res.status(400).json({ success: false, message: 'Herramienta no disponible' });
    }
    
    // Validar empleado existe
    const [emp] = await db.query('SELECT activo FROM empleados WHERE id = ?', [empleado_id]);
    if (emp.length === 0 || !emp[0].activo) {
      return res.status(404).json({ success: false, message: 'Empleado no válido' });
    }
    
    const [result] = await db.query(
      'INSERT INTO prestamos (empresa_id, herramienta_id, empleado_id, usuario_registro_id, fecha_prestamo, estado) VALUES (?, ?, ?, ?, NOW(), "activo")',
      [empresa_id, herramienta_id, empleado_id, usuario_registro_id || 1]
    );
    
    await db.query('UPDATE herramientas SET estado = "en_uso" WHERE id = ?', [herramienta_id]);
    
    res.status(201).json({ success: true, data: { id: result.insertId } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT - Devolver herramienta
router.put('/:id/devolver', async (req, res) => {
  try {
    const [prestamo] = await db.query('SELECT herramienta_id FROM prestamos WHERE id = ?', [req.params.id]);
    
    await db.query('UPDATE prestamos SET estado = "devuelto", fecha_devolucion = NOW() WHERE id = ?', [req.params.id]);
    await db.query('UPDATE herramientas SET estado = "disponible" WHERE id = ?', [prestamo[0].herramienta_id]);
    
    res.json({ success: true, message: 'Herramienta devuelta' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;