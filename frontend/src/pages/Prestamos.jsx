import { useState, useEffect } from 'react';
import '../App.css';
import { exportToExcel, exportToCSV } from '../utils/exportToExcel';
import { API_URL } from '../config';
import Toast from '../components/Toast';
import SearchBar from '../components/SearchBar';
import ConfirmModal from '../components/ConfirmModal';
import useToast from '../hooks/useToast';

export default function Prestamos() {
  const [prestamos, setPrestamos] = useState([]);
  const [prestamosFiltrados, setPrestamosFiltrados] = useState([]);
  const [herramientas, setHerramientas] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [herramientasDisponibles, setHerramientasDisponibles] = useState([]);
  const [filtroEmpleado, setFiltroEmpleado] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [prestamoADevolver, setPrestamoADevolver] = useState(null);
  const [formData, setFormData] = useState({
    herramienta_id: '',
    empleado_id: ''
  });
  const { toasts, showToast, removeToast } = useToast();

  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      const empresa_id = usuario?.empresa_id;
      
      if (!empresa_id) {
        console.error('No hay empresa_id');
        return;
      }
      
      const [prestamosRes, herramientasRes, empleadosRes] = await Promise.all([
        fetch(`${API_URL}/prestamos?empresa_id=${empresa_id}`),
        fetch(`${API_URL}/herramientas?empresa_id=${empresa_id}`),
        fetch(`${API_URL}/empleados?empresa_id=${empresa_id}`)
      ]);
      
      const prestamosData = await prestamosRes.json();
      const herramientasData = await herramientasRes.json();
      const empleadosData = await empleadosRes.json();
      
      if (prestamosData.success) {
        let prestamosFiltrados = prestamosData.data;
        
        if (usuario.rol === 'empleado') {
          prestamosFiltrados = prestamosData.data.filter(p => 
            p.empleado.toLowerCase().includes(usuario.nombre.toLowerCase())
          );
        }
        
        setPrestamos(prestamosFiltrados);
        setPrestamosFiltrados(prestamosFiltrados);
      }
      if (herramientasData.success) {
        if (usuario.rol !== 'empleado') {
          setHerramientasDisponibles(herramientasData.data.filter(h => h.estado === 'disponible'));
        }
      }
      if (empleadosData.success) {
        setEmpleados(empleadosData.data);
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('Error al cargar datos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const buscarPrestamos = (termino) => {
    if (!termino.trim()) {
      const filtrados = filtroEmpleado 
        ? prestamos.filter(p => p.empleado_id === parseInt(filtroEmpleado))
        : prestamos;
      setPrestamosFiltrados(filtrados);
      return;
    }

    const terminoLower = termino.toLowerCase();
    let resultados = prestamos.filter(p =>
      p.herramienta.toLowerCase().includes(terminoLower) ||
      p.empleado.toLowerCase().includes(terminoLower) ||
      p.estado.toLowerCase().includes(terminoLower)
    );

    if (filtroEmpleado) {
      resultados = resultados.filter(p => p.empleado_id === parseInt(filtroEmpleado));
    }

    setPrestamosFiltrados(resultados);
  };

  const aplicarFiltroEmpleado = (empleadoId) => {
    setFiltroEmpleado(empleadoId);
    if (!empleadoId) {
      setPrestamosFiltrados(prestamos);
    } else {
      const filtrados = prestamos.filter(p => p.empleado_id === parseInt(empleadoId));
      setPrestamosFiltrados(filtrados);
    }
  };

  const abrirModal = () => {
    setFormData({ herramienta_id: '', empleado_id: '' });
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      const empresa_id = usuario?.empresa_id;
      
      const response = await fetch(`${API_URL}/prestamos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, empresa_id })
      });
      const data = await response.json();
      
      if (data.success) {
        cargarDatos();
        cerrarModal();
        showToast('✓ Préstamo registrado exitosamente', 'success');
      } else {
        showToast(data.message, 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('Error al registrar el préstamo', 'error');
    }
  };

  const confirmarDevolucion = (prestamo) => {
    setPrestamoADevolver(prestamo);
    setShowConfirmModal(true);
  };

  const devolverHerramienta = async () => {
    if (!prestamoADevolver) return;
    
    try {
      const response = await fetch(`${API_URL}/prestamos/${prestamoADevolver.id}/devolver`, {
        method: 'PUT'
      });
      
      const data = await response.json();
      
      if (data.success) {
        cargarDatos();
        showToast('✓ Herramienta devuelta correctamente', 'success');
      } else {
        showToast(data.message, 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('Error al devolver la herramienta', 'error');
    } finally {
      setShowConfirmModal(false);
      setPrestamoADevolver(null);
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportarExcel = () => {
    const dataExport = prestamosFiltrados.map(p => ({
      ID: p.id,
      Herramienta: p.herramienta,
      Empleado: p.empleado,
      'Fecha Préstamo': formatearFecha(p.fecha_prestamo),
      'Fecha Devolución': formatearFecha(p.fecha_devolucion),
      Estado: p.estado === 'activo' ? 'Activo' : 'Devuelto'
    }));
    exportToExcel(dataExport, 'Prestamos_ToolTrack');
    showToast('✓ Archivo Excel descargado', 'success');
  };

  const exportarCSV = () => {
    const dataExport = prestamosFiltrados.map(p => ({
      ID: p.id,
      Herramienta: p.herramienta,
      Empleado: p.empleado,
      'Fecha Préstamo': formatearFecha(p.fecha_prestamo),
      'Fecha Devolución': formatearFecha(p.fecha_devolucion),
      Estado: p.estado === 'activo' ? 'Activo' : 'Devuelto'
    }));
    exportToCSV(dataExport, 'Prestamos_ToolTrack');
    showToast('✓ Archivo CSV descargado', 'success');
  };

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div className="page" style={{ animation: 'fadeIn 0.3s ease-in' }}>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}

      <div className="page-header">
        <div>
          <h1>📦 Préstamos</h1>
          <p className="page-subtitle">Gestiona los préstamos de herramientas ({prestamosFiltrados.length} {prestamosFiltrados.length === 1 ? 'préstamo' : 'préstamos'})</p>
        </div>
        <div style={{display: 'flex', gap: '12px'}}>
          <button className="btn-secondary" onClick={exportarExcel}>
            📊 Exportar Excel
          </button>
          <button className="btn-secondary" onClick={exportarCSV}>
            📄 Exportar CSV
          </button>
          {(usuario.rol === 'admin' || usuario.rol === 'supervisor') && (
            <button className="btn-primary" onClick={() => abrirModal()}>
              + Nuevo Préstamo
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '300px' }}>
          <SearchBar 
            placeholder="Buscar por herramienta, empleado o estado..." 
            onSearch={buscarPrestamos}
          />
        </div>
        
        <div style={{ minWidth: '250px' }}>
          <select
            value={filtroEmpleado}
            onChange={(e) => aplicarFiltroEmpleado(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #2d3748',
              borderRadius: '10px',
              background: '#1a1a1a',
              color: 'white',
              fontSize: '15px',
              cursor: 'pointer'
            }}
          >
            <option value="">👥 Todos los empleados</option>
            {empleados.map(e => (
              <option key={e.id} value={e.id}>
                {e.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-container">
        {prestamosFiltrados.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '48px', 
            color: '#718096',
            fontSize: '16px'
          }}>
            {prestamos.length === 0 ? '📋 No hay préstamos registrados' : '🔍 No se encontraron resultados'}
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Herramienta</th>
                <th>Empleado</th>
                <th>Fecha Préstamo</th>
                <th>Fecha Devolución</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {prestamosFiltrados.map(p => (
                <tr key={p.id} style={{ animation: 'slideIn 0.3s ease-out' }}>
                  <td>{p.id}</td>
                  <td>{p.herramienta}</td>
                  <td>{p.empleado}</td>
                  <td>{formatearFecha(p.fecha_prestamo)}</td>
                  <td>{formatearFecha(p.fecha_devolucion)}</td>
                  <td>
                    <span className={`badge ${p.estado}`}>
                      {p.estado === 'activo' ? 'Activo' : 'Devuelto'}
                    </span>
                  </td>
                  <td>
                    {p.estado === 'activo' && (
                      <button 
                        className="btn-primary" 
                        onClick={() => confirmarDevolucion(p)}
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        Devolver
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showConfirmModal && prestamoADevolver && (
        <ConfirmModal
          title="¿Confirmar devolución?"
          message={`¿Confirmas la devolución de "${prestamoADevolver.herramienta}" por parte de ${prestamoADevolver.empleado}?`}
          type="info"
          onConfirm={devolverHerramienta}
          onCancel={() => {
            setShowConfirmModal(false);
            setPrestamoADevolver(null);
          }}
        />
      )}

      {showModal && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ animation: 'slideDown 0.3s ease-out' }}>
            <div className="modal-header">
              <h2>Nuevo Préstamo</h2>
              <button className="btn-close" onClick={cerrarModal}>×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Herramienta *</label>
                <select
                  value={formData.herramienta_id}
                  onChange={(e) => setFormData({...formData, herramienta_id: e.target.value})}
                  required
                >
                  <option value="">Selecciona una herramienta</option>
                  {herramientasDisponibles.map(h => (
                    <option key={h.id} value={h.id}>
                      {h.nombre} - {h.qr_code}
                    </option>
                  ))}
                </select>
                {herramientasDisponibles.length === 0 && (
                  <small style={{color: '#ef4444'}}>
                    No hay herramientas disponibles
                  </small>
                )}
              </div>

              <div className="form-group">
                <label>Empleado *</label>
                <select
                  value={formData.empleado_id}
                  onChange={(e) => setFormData({...formData, empleado_id: e.target.value})}
                  required
                >
                  <option value="">Selecciona un empleado</option>
                  {empleados.map(e => (
                    <option key={e.id} value={e.id}>
                      {e.nombre} - {e.identificacion}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={cerrarModal}>
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={herramientasDisponibles.length === 0}
                >
                  Registrar Préstamo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}