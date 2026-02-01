import { useState, useEffect } from 'react';
import './Alertas.css';
import { API_URL } from '../config';

export default function Alertas() {
  const [alertas, setAlertas] = useState([]);

  useEffect(() => {
    cargarAlertas();
  }, []);

  const cargarAlertas = async () => {
    try {
      const response = await fetch(`${API_URL}/dashboard/stats`);
      const data = await response.json();
      
      if (data.success) {
        const alertasArray = [];
        
        // Préstamos vencidos
        if (data.data.prestamos_vencidos > 0) {
          alertasArray.push({
            tipo: 'danger',
            titulo: 'Préstamos Vencidos',
            mensaje: `Hay ${data.data.prestamos_vencidos} préstamo(s) con más de 30 días sin devolver`,
            icono: '⚠️'
          });
        }
        
        // Mantenimientos vencidos
        if (data.data.mantenimientos_vencidos > 0) {
          alertasArray.push({
            tipo: 'warning',
            titulo: 'Mantenimientos Vencidos',
            mensaje: `Hay ${data.data.mantenimientos_vencidos} mantenimiento(s) vencido(s)`,
            icono: '🔧'
          });
        }
        
        setAlertas(alertasArray);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (alertas.length === 0) return null;

  return (
    <div className="alertas-container">
      {alertas.map((alerta, index) => (
        <div key={index} className={`alerta alerta-${alerta.tipo}`}>
          <span className="alerta-icono">{alerta.icono}</span>
          <div className="alerta-contenido">
            <h4>{alerta.titulo}</h4>
            <p>{alerta.mensaje}</p>
          </div>
        </div>
      ))}
    </div>
  );
}