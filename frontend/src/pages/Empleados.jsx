import { useState, useEffect } from 'react';
import '../App.css';
import { generarQR } from '../utils/generarQR';
import { API_URL } from '../config';
import Toast from '../components/Toast';
import SearchBar from '../components/SearchBar';
import ConfirmModal from '../components/ConfirmModal';
import useToast from '../hooks/useToast';

export default function Empleados() {
  // ========== ESTADOS ==========
  const [empleados, setEmpleados] = useState([]);
  const [empleadosFiltrados, setEmpleadosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrSeleccionado, setQrSeleccionado] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [empleadoAEliminar, setEmpleadoAEliminar] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    identificacion: '',
    seccion: '',
    cargo: '',
    telefono: '',
    email: ''
  });
  const { toasts, showToast, removeToast } = useToast();

  // ========== EFECTO INICIAL ==========
  useEffect(() => {
    cargarEmpleados();
  }, []);

  // ========== FUNCIÓN: CARGAR EMPLEADOS ==========
  const cargarEmpleados = async () => {
    try {
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      const empresa_id = usuario?.empresa_id;
      
      if (!empresa_id) {
        console.error('No hay empresa_id');
        return;
      }
      
      const response = await fetch(`${API_URL}/empleados?empresa_id=${empresa_id}`);
      const data = await response.json();
      if (data.success) {
        setEmpleados(data.data);
        setEmpleadosFiltrados(data.data);
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('Error al cargar empleados', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ========== FUNCIÓN: BUSCAR EMPLEADOS ==========
  const buscarEmpleados = (termino) => {
    if (!termino.trim()) {
      setEmpleadosFiltrados(empleados);
      return;
    }

    const terminoLower = termino.toLowerCase();
    const filtrados = empleados.filter(e =>
      e.nombre.toLowerCase().includes(terminoLower) ||
      e.identificacion.toLowerCase().includes(terminoLower) ||
      e.cargo?.toLowerCase().includes(terminoLower) ||
      e.seccion?.toLowerCase().includes(terminoLower) ||
      e.qr_code.toLowerCase().includes(terminoLower)
    );
    setEmpleadosFiltrados(filtrados);
  };

  // ========== FUNCIÓN: ABRIR MODAL CREAR/EDITAR ==========
  const abrirModal = (empleado = null) => {
    if (empleado) {
      setEditando(empleado.id);
      setFormData({
        nombre: empleado.nombre,
        identificacion: empleado.identificacion,
        seccion: empleado.seccion || '',
        cargo: empleado.cargo || '',
        telefono: empleado.telefono || '',
        email: empleado.email || ''
      });
    } else {
      setEditando(null);
      setFormData({
        nombre: '',
        identificacion: '',
        seccion: '',
        cargo: '',
        telefono: '',
        email: ''
      });
    }
    setShowModal(true);
  };

  // ========== FUNCIÓN: CERRAR MODAL ==========
  const cerrarModal = () => {
    setShowModal(false);
    setEditando(null);
  };

  // ========== FUNCIÓN: SUBMIT FORMULARIO ==========
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      const empresa_id = usuario?.empresa_id;
      
      const url = editando 
        ? `${API_URL}/empleados/${editando}`
        : `${API_URL}/empleados`;
      
      const method = editando ? 'PUT' : 'POST';
      
      const dataToSend = editando ? formData : { ...formData, empresa_id };
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });
      
      const data = await response.json();
      
      if (data.success) {
        cargarEmpleados();
        cerrarModal();
        showToast(
          editando ? '✓ Empleado actualizado exitosamente' : '✓ Empleado creado exitosamente',
          'success'
        );
      } else {
        showToast(data.message, 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('Error al guardar el empleado', 'error');
    }
  };

  // ========== FUNCIÓN: CONFIRMAR ELIMINACIÓN ==========
  const confirmarEliminar = (empleado) => {
    setEmpleadoAEliminar(empleado);
    setShowConfirmModal(true);
  };

  // ========== FUNCIÓN: ELIMINAR EMPLEADO ==========
  const eliminarEmpleado = async () => {
    if (!empleadoAEliminar) return;
    
    try {
      const response = await fetch(`${API_URL}/empleados/${empleadoAEliminar.id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        cargarEmpleados();
        showToast('✓ Empleado eliminado correctamente', 'success');
      } else {
        showToast(data.message, 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('Error al eliminar el empleado', 'error');
    } finally {
      setShowConfirmModal(false);
      setEmpleadoAEliminar(null);
    }
  };

  // ========== FUNCIÓN: VER QR ==========
  const verQR = (empleado) => {
    setQrSeleccionado(empleado);
    setShowQRModal(true);
  };

  // ========== FUNCIÓN: DESCARGAR QR ==========
  const descargarQR = async () => {
    if (qrSeleccionado) {
      await generarQR(qrSeleccionado.qr_code, `${qrSeleccionado.nombre}_${qrSeleccionado.qr_code}`);
      showToast('✓ Código QR descargado', 'success');
    }
  };

  // ========== LOADING ==========
  if (loading) return <div className="loading">Cargando...</div>;

  // ========== RENDER ==========
  return (
    <div className="page" style={{ animation: 'fadeIn 0.3s ease-in' }}>
      {/* ========== TOASTS ========== */}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}

      {/* ========== HEADER ========== */}
      <div className="page-header">
        <div>
          <h1>👷 Empleados</h1>
          <p className="page-subtitle">Gestiona tu equipo de trabajo ({empleadosFiltrados.length} {empleadosFiltrados.length === 1 ? 'empleado' : 'empleados'})</p>
        </div>
        <button className="btn-primary" onClick={() => abrirModal()}>
          + Nuevo Empleado
        </button>
      </div>

      {/* ========== BÚSQUEDA ========== */}
      <SearchBar 
        placeholder="Buscar por nombre, identificación, cargo, sección o QR..." 
        onSearch={buscarEmpleados}
      />

      {/* ========== TABLA ========== */}
      <div className="table-container">
        {empleadosFiltrados.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '48px', 
            color: '#718096',
            fontSize: '16px'
          }}>
            {empleados.length === 0 ? '📋 No hay empleados registrados' : '🔍 No se encontraron resultados'}
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Identificación</th>
                <th>Sección</th>
                <th>Cargo</th>
                <th>Teléfono</th>
                <th>QR</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empleadosFiltrados.map(e => (
                <tr key={e.id} style={{ animation: 'slideIn 0.3s ease-out' }}>
                  <td>{e.id}</td>
                  <td>{e.nombre}</td>
                  <td>{e.identificacion}</td>
                  <td>{e.seccion || '-'}</td>
                  <td>{e.cargo || '-'}</td>
                  <td>{e.telefono || '-'}</td>
                  <td>{e.qr_code}</td>
                  <td>
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      flexWrap: 'nowrap',
                      minWidth: '340px'
                    }}>
                      <button 
                        className="btn-primary" 
                        onClick={() => verQR(e)}
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        Ver QR
                      </button>
                      <button 
                        className="btn-secondary" 
                        onClick={() => abrirModal(e)}
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        Editar
                      </button>
                      <button 
                        className="btn-secondary" 
                        onClick={() => confirmarEliminar(e)}
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

      {/* ========== MODAL CONFIRMACIÓN ========== */}
      {showConfirmModal && empleadoAEliminar && (
        <ConfirmModal
          title="¿Eliminar empleado?"
          message={`Estás a punto de eliminar a "${empleadoAEliminar.nombre}". Esta acción no se puede deshacer.`}
          type="danger"
          onConfirm={eliminarEmpleado}
          onCancel={() => {
            setShowConfirmModal(false);
            setEmpleadoAEliminar(null);
          }}
        />
      )}

      {/* ========== MODAL CREAR/EDITAR ========== */}
      {showModal && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ animation: 'slideDown 0.3s ease-out' }}>
            <div className="modal-header">
              <h2>{editando ? 'Editar Empleado' : 'Nuevo Empleado'}</h2>
              <button className="btn-close" onClick={cerrarModal}>×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre Completo *</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Identificación *</label>
                <input
                  type="text"
                  value={formData.identificacion}
                  onChange={(e) => setFormData({...formData, identificacion: e.target.value})}
                  required
                  disabled={editando}
                />
              </div>

              <div className="form-group">
                <label>Sección</label>
                <input
                  type="text"
                  value={formData.seccion}
                  onChange={(e) => setFormData({...formData, seccion: e.target.value})}
                  placeholder="Ej: Construcción, Mantenimiento"
                />
              </div>

              <div className="form-group">
                <label>Cargo</label>
                <input
                  type="text"
                  value={formData.cargo}
                  onChange={(e) => setFormData({...formData, cargo: e.target.value})}
                  placeholder="Ej: Supervisor, Operario"
                />
              </div>

              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                  placeholder="300 123 4567"
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="empleado@empresa.com"
                />
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

      {/* ========== MODAL QR ========== */}
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
                  Escanea este código para identificar al empleado
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

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideIn {
          from { 
            opacity: 0;
            transform: translateY(10px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideDown {
          from { 
            opacity: 0;
            transform: translateY(-20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes zoomIn {
          from { 
            opacity: 0;
            transform: scale(0.9);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}