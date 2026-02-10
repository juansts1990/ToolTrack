import { useState, useEffect } from 'react';
import '../App.css';
import Alertas from '../components/Alertas';
import { API_URL } from '../config';
import Tutorial from '../components/Tutorial'; 

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mostrarTutorial, setMostrarTutorial] = useState(false);

  useEffect(() => {
    cargarEstadisticas();
  
  }, []);

  const cargarEstadisticas = async () => {
    try {
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      const empresa_id = usuario?.empresa_id;
      
      if (!empresa_id) {
        console.error('No hay empresa_id');
        return;
      }
      
      const response = await fetch(`${API_URL}/dashboard?empresa_id=${empresa_id}`);
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const cerrarTutorial = () => {
    const usuarioActual = JSON.parse(localStorage.getItem('usuario'));
    localStorage.setItem(`tutorial_visto_${usuarioActual?.id}`, 'true');
    setMostrarTutorial(false);
  };

  // Mostrar tutorial si está activo
  if (mostrarTutorial) {
    return <Tutorial onClose={cerrarTutorial} />;
  }

  if (loading) return <div className="loading">Cargando estadísticas...</div>;

  const totalHerramientas = stats?.herramientas?.reduce((sum, h) => sum + h.cantidad, 0) || 0;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>📊 Dashboard ToolTrack</h1>
          <p className="page-subtitle">Vista general de tu inventario y operaciones</p>
        </div>
        <button 
          className="btn-tutorial"
          onClick={() => setMostrarTutorial(true)}
          title="Ver tutorial del sistema"
        >
          📚 Ver Tutorial
        </button>
      </div>
      
      {/* <Alertas /> */}

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{totalHerramientas}</h3>
          <p>Total Herramientas</p>
        </div>
        
        <div className="stat-card">
          <h3>{stats?.prestamos_activos || 0}</h3>
          <p>Préstamos Activos</p>
        </div>
        
        <div className="stat-card warning">
          <h3>{stats?.mantenimientos_pendientes || 0}</h3>
          <p>Mantenimientos Pendientes</p>
        </div>
        
        <div className="stat-card danger">
          <h3>{stats?.mantenimientos_vencidos || 0}</h3>
          <p>Mantenimientos Vencidos</p>
        </div>
      </div>

      <h2>Herramientas por Estado</h2>
      <div className="stats-grid">
        {stats?.herramientas?.map(h => (
          <div className="stat-card" key={h.estado}>
            <h3>{h.cantidad}</h3>
            <p style={{textTransform: 'capitalize'}}>{h.estado.replace('_', ' ')}</p>
          </div>
        ))}
      </div>

      <h2>Top Herramientas Más Prestadas</h2>
      <ul>
        {stats?.top_herramientas?.length > 0 ? (
          stats.top_herramientas.map((h, index) => (
            <li key={index}>
              <strong>{h.nombre}</strong> - {h.veces} {h.veces === 1 ? 'vez' : 'veces'} prestada
            </li>
          ))
        ) : (
          <li>No hay datos de préstamos aún</li>
        )}
      </ul>
    </div>
  );
}