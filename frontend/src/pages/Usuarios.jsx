import { useState, useEffect } from 'react';
import { API_URL } from '../config';
import '../App.css';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'empleado',
    activo: 1
  });

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      const empresa_id = usuario?.empresa_id;
      
      if (!empresa_id) return;
      
      const response = await fetch(`${API_URL}/usuarios?empresa_id=${empresa_id}`);
      const data = await response.json();
      if (data.success) {
        setUsuarios(data.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (usuario = null) => {
    if (usuario) {
      setEditando(usuario.id);
      setFormData({
        nombre: usuario.nombre,
        email: usuario.email,
        password: '',
        rol: usuario.rol,
        activo: usuario.activo
      });
    } else {
      setEditando(null);
      setFormData({
        nombre: '',
        email: '',
        password: '',
        rol: 'empleado',
        activo: 1
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
        ? `${API_URL}/usuarios/${editando}`
        : `${API_URL}/usuarios`;
      
      const method = editando ? 'PUT' : 'POST';
      
      const dataToSend = editando 
        ? { nombre: formData.nombre, email: formData.email, rol: formData.rol, activo: formData.activo }
        : { ...formData, empresa_id };
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });
      
      const data = await response.json();
      
      if (data.success) {
        cargarUsuarios();
        cerrarModal();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar usuario');
    }
  };

  const desactivarUsuario = async (id, nombre) => {
    if (!confirm(`¿Estás seguro de desactivar a "${nombre}"?`)) return;
    
    try {
      const response = await fetch(`${API_URL}/usuarios/${id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        cargarUsuarios();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al desactivar usuario');
    }
  };

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>👥 Usuarios</h1>
          <p className="page-subtitle">Gestiona los usuarios de tu empresa</p>
        </div>
        <button className="btn-primary" onClick={() => abrirModal()}>
          + Nuevo Usuario
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Fecha Creación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.nombre}</td>
                <td>{u.email}</td>
                <td>
                  <span className={`badge ${u.rol}`}>
                    {u.rol === 'admin' && '🔴 Admin'}
                    {u.rol === 'supervisor' && '🟡 Supervisor'}
                    {u.rol === 'empleado' && '🟢 Empleado'}
                  </span>
                </td>
                <td>
                  <span className={`badge ${u.activo ? 'disponible' : 'mantenimiento'}`}>
                    {u.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>{new Date(u.created_at).toLocaleDateString('es-CO')}</td>
                <td>
                  <button className="btn-secondary" onClick={() => abrirModal(u)}>
                    Editar
                  </button>
                  {u.activo === 1 && (
                    <button 
                      className="btn-secondary" 
                      onClick={() => desactivarUsuario(u.id, u.nombre)}
                      style={{marginLeft: '8px'}}
                    >
                      Desactivar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Crear/Editar */}
      {showModal && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editando ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
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
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>

              {!editando && (
                <div className="form-group">
                  <label>Contraseña *</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="Mínimo 6 caracteres"
                    required
                    minLength={6}
                  />
                </div>
              )}

              <div className="form-group">
                <label>Rol *</label>
                <select
                  value={formData.rol}
                  onChange={(e) => setFormData({...formData, rol: e.target.value})}
                  required
                >
                  <option value="empleado">🟢 Empleado</option>
                  <option value="supervisor">🟡 Supervisor</option>
                  <option value="admin">🔴 Admin</option>
                </select>
              </div>

              {editando && (
                <div className="form-group">
                  <label>Estado</label>
                  <select
                    value={formData.activo}
                    onChange={(e) => setFormData({...formData, activo: parseInt(e.target.value)})}
                  >
                    <option value={1}>Activo</option>
                    <option value={0}>Inactivo</option>
                  </select>
                </div>
              )}

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
    </div>
  );
}