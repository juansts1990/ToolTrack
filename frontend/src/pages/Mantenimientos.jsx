import { useState, useEffect } from 'react';
import '../App.css';
import { API_URL } from '../config';
import Toast from '../components/Toast';
import SearchBar from '../components/SearchBar';
import ConfirmModal from '../components/ConfirmModal';
import useToast from '../hooks/useToast';

export default function Mantenimientos() {
  const [mantenimientos, setMantenimientos] = useState([]);
  const [mantenimientosFiltrados, setMantenimientosFiltrados] = useState([]);
  const [herramientas, setHerramientas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCompletarModal, setShowCompletarModal] = useState(false);
  const [mantenimientoACompletar, setMantenimientoACompletar] = useState(null);
  const [fechaRealizacion, setFechaRealizacion] = useState('');
  const [mantenimientoAEliminar, setMantenimientoAEliminar] = useState(null);
  const [formData, setFormData] = useState({
    herramienta_id: '',
    tipo: 'preventivo',
    fecha_programada: '',
    costo: '',
    observaciones: ''
  });
  const { toasts, showToast, removeToast } = useToast();

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
      
      const [mantRes, herramientasRes] = await Promise.all([
        fetch(`${API_URL}/mantenimientos?empresa_id=${empresa_id}`),
        fetch(`${API_URL}/herramientas?empresa_id=${empresa_id}`)
      ]);
      
      const mantData = await mantRes.json();
      const herramientasData = await herramientasRes.json();
      
      if (mantData.success) {
        setMantenimientos(mantData.data);
        setMantenimientosFiltrados(mantData.data);
      }
      if (herramientasData.success) {
        setHerramientas(herramientasData.data);
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('Error al cargar datos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const buscarMantenimientos = (termino) => {
    if (!termino.trim()) {
      setMantenimientosFiltrados(mantenimientos);
      return;
    }

    const terminoLower = termino.toLowerCase();
    const filtrados = mantenimientos.filter(m =>
      m.herramienta.toLowerCase().includes(terminoLower) ||
      m.tipo.toLowerCase().includes(terminoLower) ||
      m.estado.toLowerCase().includes(terminoLower) ||
      m.observaciones?.toLowerCase().includes(terminoLower)
    );
    setMantenimientosFiltrados(filtrados);
  };

  const abrirModal = (mantenimiento = null) => {
    if (mantenimiento) {
      setEditando(mantenimiento.id);
      setFormData({
        herramienta_id: mantenimiento.herramienta_id,
        tipo: mantenimiento.tipo,
        fecha_programada: mantenimiento.fecha_programada?.split('T')[0] || '',
        costo: mantenimiento.costo || '',
        observaciones: mantenimiento.observaciones || ''
      });
    } else {
      setEditando(null);
      setFormData({
        herramienta_id: '',
        tipo: 'preventivo',
        fecha_programada: '',
        costo: '',
        observaciones: ''
      });
    }
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setEditando(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      const empresa_id = usuario?.empresa_id;
      
      const url = editando 
        ? `${API_URL}/mantenimientos/${editando}`
        : `${API_URL}/mantenimientos`;
      
      const method = editando ? 'PUT' : 'POST';
      
      const dataToSend = editando ? formData : { ...formData, empresa_id };
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });
      
      const data = await response.json();
      
      if (data.success) {
        cargarDatos();
        cerrarModal();
        showToast(
          editando ? '✓ Mantenimiento actualizado exitosamente' : '✓ Mantenimiento programado exitosamente',
          'success'
        );
      } else {
        showToast(data.message, 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('Error al guardar el mantenimiento', 'error');
    }
  };

  const confirmarEliminar = (mantenimiento) => {
    setMantenimientoAEliminar(mantenimiento);
    setShowConfirmModal(true);
  };

  const eliminarMantenimiento = async () => {
    if (!mantenimientoAEliminar) return;
    
    try {
      const response = await fetch(`${API_URL}/mantenimientos/${mantenimientoAEliminar.id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        cargarDatos();
        showToast('✓ Mantenimiento eliminado correctamente', 'success');
      } else {
        showToast(data.message, 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('Error al eliminar el mantenimiento', 'error');
    } finally {
      setShowConfirmModal(false);
      setMantenimientoAEliminar(null);
    }
  };

  const abrirModalCompletar = (mantenimiento) => {
    setMantenimientoACompletar(mantenimiento);
    setFechaRealizacion(new Date().toISOString().split('T')[0]);
    setShowCompletarModal(true);
  };

  const marcarComoRealizado = async () => {
    if (!mantenimientoACompletar) return;
    
    try {
      const response = await fetch(`${API_URL}/mantenimientos/${mantenimientoACompletar.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          estado: 'realizado',
          fecha_realizada: fechaRealizacion
        })
      });
      
      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }
      
      const data = await response.json();
      
      if (data.success) {
        cargarDatos();
        showToast('✓ Mantenimiento marcado como realizado', 'success');
      } else {
        showToast(data.message || 'Error al actualizar', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('Error al actualizar el mantenimiento', 'error');
    } finally {
      setShowCompletarModal(false);
      setMantenimientoACompletar(null);
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatearPrecio = (precio) => {
    if (!precio) return '-';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio);
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
          <h1>🔧 Mantenimientos</h1>
          <p className="page-subtitle">Gestiona el mantenimiento de herramientas ({mantenimientosFiltrados.length} {mantenimientosFiltrados.length === 1 ? 'mantenimiento' : 'mantenimientos'})</p>
        </div>
        <button className="btn-primary" onClick={() => abrirModal()}>
          + Programar Mantenimiento
        </button>
      </div>

      <SearchBar 
        placeholder="Buscar por herramienta, tipo, estado u observaciones..." 
        onSearch={buscarMantenimientos}
      />

      <div className="table-container">
        {mantenimientosFiltrados.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '48px', 
            color: '#718096',
            fontSize: '16px'
          }}>
            {mantenimientos.length === 0 ? '📋 No hay mantenimientos programados' : '🔍 No se encontraron resultados'}
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Herramienta</th>
                <th>Tipo</th>
                <th>Fecha Programada</th>
                <th>Fecha Realizada</th>
                <th>Costo</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {mantenimientosFiltrados.map(m => (
                <tr key={m.id} style={{ animation: 'slideIn 0.3s ease-out' }}>
                  <td>{m.id}</td>
                  <td>{m.herramienta}</td>
                  <td style={{ textTransform: 'capitalize' }}>{m.tipo}</td>
                  <td>{formatearFecha(m.fecha_programada)}</td>
                  <td>{formatearFecha(m.fecha_realizada)}</td>
                  <td>{formatearPrecio(m.costo)}</td>
                  <td>
                    <span className={`badge ${m.estado}`}>
                      {m.estado === 'pendiente' ? 'Pendiente' : 
                       m.estado === 'realizado' ? 'Realizado' : 'Vencido'}
                    </span>
                  </td>
                  <td>
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      flexWrap: 'nowrap',
                      minWidth: '340px'
                    }}>
                      {m.estado === 'pendiente' && (
                        <button 
                          className="btn-primary" 
                          onClick={() => abrirModalCompletar(m)}
                          style={{ whiteSpace: 'nowrap' }}
                        >
                          ✓ Completar
                        </button>
                      )}
                      <button 
                        className="btn-secondary" 
                        onClick={() => abrirModal(m)}
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        Editar
                      </button>
                      <button 
                        className="btn-secondary" 
                        onClick={() => confirmarEliminar(m)}
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showConfirmModal && mantenimientoAEliminar && (
        <ConfirmModal
          title="¿Eliminar mantenimiento?"
          message={`¿Estás seguro de eliminar el mantenimiento de "${mantenimientoAEliminar.herramienta}"?`}
          type="danger"
          onConfirm={eliminarMantenimiento}
          onCancel={() => {
            setShowConfirmModal(false);
            setMantenimientoAEliminar(null);
          }}
        />
      )}

      {showCompletarModal && mantenimientoACompletar && (
        <div className="modal-overlay" onClick={() => setShowCompletarModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ animation: 'slideDown 0.3s ease-out' }}>
            <div className="modal-header">
              <h2>Completar Mantenimiento</h2>
              <button className="btn-close" onClick={() => setShowCompletarModal(false)}>×</button>
            </div>
            
            <div style={{ padding: '20px' }}>
              <p style={{ marginBottom: '20px', color: '#4A5568' }}>
                Marcar como realizado el mantenimiento de <strong>{mantenimientoACompletar.herramienta}</strong>
              </p>

              <div className="form-group">
                <label>Fecha de Realización *</label>
                <input
                  type="date"
                  value={fechaRealizacion}
                  onChange={(e) => setFechaRealizacion(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setShowCompletarModal(false)}
                >
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="btn-primary" 
                  onClick={marcarComoRealizado}
                >
                  ✓ Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ animation: 'slideDown 0.3s ease-out' }}>
            <div className="modal-header">
              <h2>{editando ? 'Editar Mantenimiento' : 'Programar Mantenimiento'}</h2>
              <button className="btn-close" onClick={cerrarModal}>×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Herramienta *</label>
                <select
                  value={formData.herramienta_id}
                  onChange={(e) => setFormData({...formData, herramienta_id: e.target.value})}
                  required
                  disabled={editando}
                >
                  <option value="">Selecciona una herramienta</option>
                  {herramientas.map(h => (
                    <option key={h.id} value={h.id}>
                      {h.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Tipo de Mantenimiento *</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                  required
                >
                  <option value="preventivo">Preventivo</option>
                  <option value="correctivo">Correctivo</option>
                </select>
              </div>

              <div className="form-group">
                <label>Fecha Programada *</label>
                <input
                  type="date"
                  value={formData.fecha_programada}
                  onChange={(e) => setFormData({...formData, fecha_programada: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Costo Estimado</label>
                <input
                  type="number"
                  value={formData.costo}
                  onChange={(e) => setFormData({...formData, costo: e.target.value})}
                  placeholder="50000"
                />
              </div>

              <div className="form-group">
                <label>Observaciones</label>
                <textarea
                  value={formData.observaciones}
                  onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                  placeholder="Detalles del mantenimiento..."
                  rows="4"
                  style={{
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={cerrarModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editando ? 'Actualizar' : 'Programar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}