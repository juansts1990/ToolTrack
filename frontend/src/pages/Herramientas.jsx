import { useState, useEffect } from 'react';
import '../App.css';
import { generarQR } from '../utils/generarQR';
import { API_URL } from '../config';
import Toast from '../components/Toast';
import SearchBar from '../components/SearchBar';
import ConfirmModal from '../components/ConfirmModal';
import useToast from '../hooks/useToast';

export default function Herramientas() {
  const [herramientas, setHerramientas] = useState([]);
  const [herramientasFiltradas, setHerramientasFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrSeleccionado, setQrSeleccionado] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [herramientaAEliminar, setHerramientaAEliminar] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    serial: '',
    valor_compra: '',
    fecha_compra: '',
    estado: 'disponible'
  });
  const { toasts, showToast, removeToast } = useToast();

  useEffect(() => {
    cargarHerramientas();
  }, []);

  const cargarHerramientas = async () => {
    try {
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      const empresa_id = usuario?.empresa_id;
      
      if (!empresa_id) {
        console.error('No hay empresa_id');
        return;
      }
      
      const response = await fetch(`${API_URL}/herramientas?empresa_id=${empresa_id}`);
      const data = await response.json();
      if (data.success) {
        setHerramientas(data.data);
        setHerramientasFiltradas(data.data);
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('Error al cargar herramientas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const buscarHerramientas = (termino) => {
    if (!termino.trim()) {
      setHerramientasFiltradas(herramientas);
      return;
    }

    const terminoLower = termino.toLowerCase();
    const filtradas = herramientas.filter(h =>
      h.nombre.toLowerCase().includes(terminoLower) ||
      h.categoria?.toLowerCase().includes(terminoLower) ||
      h.serial?.toLowerCase().includes(terminoLower) ||
      h.qr_code.toLowerCase().includes(terminoLower) ||
      h.estado.toLowerCase().includes(terminoLower)
    );
    setHerramientasFiltradas(filtradas);
  };

  const abrirModal = (herramienta = null) => {
    if (herramienta) {
      setEditando(herramienta.id);
      setFormData({
        nombre: herramienta.nombre,
        categoria: herramienta.categoria || '',
        serial: herramienta.serial || '',
        valor_compra: herramienta.valor_compra || '',
        fecha_compra: herramienta.fecha_compra?.split('T')[0] || '',
        estado: herramienta.estado
      });
    } else {
      setEditando(null);
      setFormData({
        nombre: '',
        categoria: '',
        serial: '',
        valor_compra: '',
        fecha_compra: '',
        estado: 'disponible'
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
        ? `${API_URL}/herramientas/${editando}`
        : `${API_URL}/herramientas`;
      
      const method = editando ? 'PUT' : 'POST';
      
      const dataToSend = editando ? formData : { ...formData, empresa_id };
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });
      
      const data = await response.json();
      
      if (data.success) {
        cargarHerramientas();
        cerrarModal();
        showToast(
          editando ? '✓ Herramienta actualizada exitosamente' : '✓ Herramienta creada exitosamente',
          'success'
        );
      } else {
        showToast(data.message, 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('Error al guardar la herramienta', 'error');
    }
  };

  const confirmarEliminar = (herramienta) => {
    setHerramientaAEliminar(herramienta);
    setShowConfirmModal(true);
  };

  const eliminarHerramienta = async () => {
    if (!herramientaAEliminar) return;
    
    try {
      const response = await fetch(`${API_URL}/herramientas/${herramientaAEliminar.id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        cargarHerramientas();
        showToast('✓ Herramienta eliminada correctamente', 'success');
      } else {
        showToast(data.message, 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('Error al eliminar la herramienta', 'error');
    } finally {
      setShowConfirmModal(false);
      setHerramientaAEliminar(null);
    }
  };

  const verQR = (herramienta) => {
    setQrSeleccionado(herramienta);
    setShowQRModal(true);
  };

  const descargarQR = async () => {
    if (qrSeleccionado) {
      await generarQR(qrSeleccionado.qr_code, `${qrSeleccionado.nombre}_${qrSeleccionado.qr_code}`);
      showToast('✓ Código QR descargado', 'success');
    }
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
          <h1>🔧 Herramientas</h1>
          <p className="page-subtitle">Gestiona tu inventario de herramientas ({herramientasFiltradas.length} {herramientasFiltradas.length === 1 ? 'herramienta' : 'herramientas'})</p>
        </div>
        <button className="btn-primary" onClick={() => abrirModal()}>
          + Nueva Herramienta
        </button>
      </div>

      <SearchBar 
        placeholder="Buscar por nombre, categoría, serial, QR o estado..." 
        onSearch={buscarHerramientas}
      />

      <div className="table-container">
        {herramientasFiltradas.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '48px', 
            color: '#718096',
            fontSize: '16px'
          }}>
            {herramientas.length === 0 ? '📋 No hay herramientas registradas' : '🔍 No se encontraron resultados'}
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Serial</th>
                <th>Valor</th>
                <th>Estado</th>
                <th>QR</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {herramientasFiltradas.map(h => (
                <tr key={h.id} style={{ animation: 'slideIn 0.3s ease-out' }}>
                  <td>{h.id}</td>
                  <td>{h.nombre}</td>
                  <td>{h.categoria || '-'}</td>
                  <td>{h.serial || '-'}</td>
                  <td>{formatearPrecio(h.valor_compra)}</td>
                  <td>
                    <span className={`badge ${h.estado}`}>
                      {h.estado.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{h.qr_code}</td>
                  <td>
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      flexWrap: 'nowrap',
                      minWidth: '340px'
                    }}>
                      <button 
                        className="btn-primary" 
                        onClick={() => verQR(h)}
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        Ver QR
                      </button>
                      <button 
                        className="btn-secondary" 
                        onClick={() => abrirModal(h)}
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        Editar
                      </button>
                      <button 
                        className="btn-secondary" 
                        onClick={() => confirmarEliminar(h)}
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

      {showConfirmModal && herramientaAEliminar && (
        <ConfirmModal
          title="¿Eliminar herramienta?"
          message={`Estás a punto de eliminar "${herramientaAEliminar.nombre}". Esta acción no se puede deshacer.`}
          type="danger"
          onConfirm={eliminarHerramienta}
          onCancel={() => {
            setShowConfirmModal(false);
            setHerramientaAEliminar(null);
          }}
        />
      )}

      {showModal && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ animation: 'slideDown 0.3s ease-out' }}>
            <div className="modal-header">
              <h2>{editando ? 'Editar Herramienta' : 'Nueva Herramienta'}</h2>
              <button className="btn-close" onClick={cerrarModal}>×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  required
                  placeholder="Ej: Taladro Percutor 20V"
                />
              </div>

              <div className="form-group">
                <label>Categoría</label>
                <input
                  type="text"
                  value={formData.categoria}
                  onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                  placeholder="Ej: Herramientas Eléctricas"
                />
              </div>

              <div className="form-group">
                <label>Serial</label>
                <input
                  type="text"
                  value={formData.serial}
                  onChange={(e) => setFormData({...formData, serial: e.target.value})}
                  placeholder="Ej: TAL-2024-001"
                  disabled={editando}
                />
              </div>

              <div className="form-group">
                <label>Valor de Compra</label>
                <input
                  type="number"
                  value={formData.valor_compra}
                  onChange={(e) => setFormData({...formData, valor_compra: e.target.value})}
                  placeholder="450000"
                />
              </div>

              <div className="form-group">
                <label>Fecha de Compra</label>
                <input
                  type="date"
                  value={formData.fecha_compra}
                  onChange={(e) => setFormData({...formData, fecha_compra: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Estado *</label>
                <select
                  value={formData.estado}
                  onChange={(e) => setFormData({...formData, estado: e.target.value})}
                  required
                >
                  <option value="disponible">Disponible</option>
                  <option value="en_uso">En Uso</option>
                  <option value="mantenimiento">Mantenimiento</option>
                  <option value="baja">Baja</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={cerrarModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editando ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showQRModal && qrSeleccionado && (
        <div className="modal-overlay" onClick={() => setShowQRModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ animation: 'zoomIn 0.3s ease-out' }}>
            <div className="modal-header">
              <h2>Código QR - {qrSeleccionado.nombre}</h2>
              <button className="btn-close" onClick={() => setShowQRModal(false)}>×</button>
            </div>
            
            <div style={{padding: '32px', textAlign: 'center'}}>
              <div style={{
                background: 'white',
                padding: '24px',
                borderRadius: '16px',
                display: 'inline-block',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${qrSeleccionado.qr_code}`}
                  alt="QR Code"
                  style={{width: '300px', height: '300px'}}
                />
              </div>
              
              <div style={{marginTop: '24px'}}>
                <p style={{fontSize: '18px', fontWeight: '700', marginBottom: '8px'}}>
                  {qrSeleccionado.qr_code}
                </p>
                <p style={{color: '#718096', fontSize: '14px'}}>
                  Escanea este código para identificar la herramienta
                </p>
              </div>

              <div style={{marginTop: '32px'}}>
                <button className="btn-primary" onClick={descargarQR}>
                  📥 Descargar QR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}