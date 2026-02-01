const express = require('express');
const router = express.Router();
const db = require('../config/database.js');

router.get('/', async (req, res) => {
  try {
    const empresa_id = req.query.empresa_id;
    
    if (!empresa_id) {
      return res.status(400).json({ success: false, message: 'empresa_id es requerido' });
    }
    
    // Total herramientas por estado
    const [herramientas] = await db.query(`
      SELECT estado, COUNT(*) as cantidad FROM herramientas WHERE empresa_id = ? GROUP BY estado
    `, [empresa_id]);

    
    // Préstamos activos
const [prestamosActivos] = await db.query(`
  SELECT COUNT(*) as total FROM prestamos WHERE estado = 'activo' AND empresa_id = ?
`, [empresa_id]);

// Mantenimientos pendientes
const [mantPendientes] = await db.query(`
  SELECT COUNT(*) as total FROM mantenimientos WHERE estado = 'pendiente' AND empresa_id = ?
`, [empresa_id]);

// Mantenimientos vencidos
const [mantVencidos] = await db.query(`
  SELECT COUNT(*) as total FROM mantenimientos 
  WHERE estado = 'pendiente' AND fecha_programada < CURDATE() AND empresa_id = ?
`, [empresa_id]);

// Top herramientas más prestadas
const [topHerr] = await db.query(`
  SELECT h.nombre, COUNT(p.id) as veces
  FROM prestamos p
  JOIN herramientas h ON p.herramienta_id = h.id
  WHERE p.empresa_id = ?
  GROUP BY h.id
  ORDER BY veces DESC
  LIMIT 5
`, [empresa_id]);

    
    res.json({
      success: true,
      data: {
        herramientas: herramientas,
        prestamos_activos: prestamosActivos[0].total,
        mantenimientos_pendientes: mantPendientes[0].total,
        mantenimientos_vencidos: mantVencidos[0].total,
        top_herramientas: topHerr
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// GET /api/reportes - Obtener datos para reportes con gráficos

// GET /api/reportes - Obtener datos para reportes con gráficos
router.get('/reportes', async (req, res) => {
  try {
    const { empresa_id } = req.query;
    
    if (!empresa_id) {
      return res.status(400).json({ success: false, message: 'empresa_id es requerido' });
    }

    // 1. Préstamos por mes (últimos 6 meses)
    const [prestamosPorMes] = await db.query(`
      SELECT 
        DATE_FORMAT(fecha_prestamo, '%Y-%m') as mes,
        COUNT(*) as total
      FROM prestamos
      WHERE empresa_id = ?
        AND fecha_prestamo >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(fecha_prestamo, '%Y-%m')
      ORDER BY mes
    `, [empresa_id]);

    // 2. Herramientas por estado
    const [herramientasPorEstado] = await db.query(`
      SELECT 
        estado,
        COUNT(*) as cantidad
      FROM herramientas
      WHERE empresa_id = ?
      GROUP BY estado
    `, [empresa_id]);

    // 3. Top 5 empleados con más préstamos
    const [topEmpleados] = await db.query(`
      SELECT 
        e.nombre,
        COUNT(p.id) as total_prestamos
      FROM empleados e
      LEFT JOIN prestamos p ON e.id = p.empleado_id
      WHERE e.empresa_id = ?
      GROUP BY e.id, e.nombre
      ORDER BY total_prestamos DESC
      LIMIT 5
    `, [empresa_id]);

    // 4. Devoluciones vs Préstamos activos
    const [estadoPrestamos] = await db.query(`
      SELECT 
        CASE 
          WHEN estado = 'activo' THEN 'Activos'
          ELSE 'Devueltos'
        END as estado,
        COUNT(*) as cantidad
      FROM prestamos
      WHERE empresa_id = ?
      GROUP BY estado
    `, [empresa_id]);

    // 5. Cálculo de ahorro por mantenimientos gratuitos
    const [herramientasNuevas] = await db.query(`
      SELECT COUNT(*) as total
      FROM herramientas
      WHERE empresa_id = ?
        AND fecha_compra >= DATE_SUB(NOW(), INTERVAL 1 YEAR)
    `, [empresa_id]);

    // 6. Mantenimientos realizados en el último año
    const [mantenimientosRealizados] = await db.query(`
      SELECT COUNT(*) as total
      FROM mantenimientos
      WHERE empresa_id = ?
        AND fecha_realizada >= DATE_SUB(NOW(), INTERVAL 1 YEAR)
    `, [empresa_id]);

    // Cálculo del ahorro (3 mantenimientos gratuitos por herramienta nueva)
    const mantenimientosGratuitos = herramientasNuevas[0].total * 3;
    const costoPromedioMantenimiento = 50000; // $50,000 COP por mantenimiento
    const ahorroAnual = mantenimientosGratuitos * costoPromedioMantenimiento;

    res.json({
      success: true,
      data: {
        prestamosPorMes,
        herramientasPorEstado,
        topEmpleados,
        estadoPrestamos,
        ahorro: {
          herramientasNuevas: herramientasNuevas[0].total,
          mantenimientosGratuitos: mantenimientosGratuitos,
          mantenimientosRealizados: mantenimientosRealizados[0].total,
          costoPromedioMantenimiento: costoPromedioMantenimiento,
          ahorroAnual: ahorroAnual,
          ahorroMensual: Math.round(ahorroAnual / 12)
        }
      }
    });

  } catch (error) {
    console.error('Error en reportes:', error);
    res.status(500).json({ success: false, message: 'Error al obtener reportes' });
  }
});


module.exports = router;