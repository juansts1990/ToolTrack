import { useState, useEffect } from 'react';
import '../App.css';

export default function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formPassword, setFormPassword] = useState({
    passwordActual: '',
    passwordNueva: '',
    passwordConfirmar: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);
  const handleFotoChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Validar que sea imagen
  if (!file.type.startsWith('image/')) {
    setError('Por favor selecciona una imagen válida');
    return;
  }

  // Validar tamaño (máximo 5MB)
  if (file.size > 5 * 1024 * 1024) {
    setError('La imagen no debe superar 5MB');
    return;
  }

  setUploading(true);
  setError('');

  try {
    // Convertir imagen a base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result;

      // Guardar en base de datos
      const response = await fetch('http://localhost:5000/api/usuarios/foto-perfil', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          usuario_id: usuario.id,
          foto_perfil: base64String
        })
      });

      const data = await response.json();

      if (data.success) {
        // Actualizar estado local
        const usuarioActualizado = { ...usuario, foto_perfil: base64String };
        setUsuario(usuarioActualizado);
        localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
        
        setSuccess('Foto de perfil actualizada exitosamente');
        setTimeout(() => setSuccess(''), 3000);
        
        // Recargar página para actualizar navbar
        window.location.reload();
      } else {
        setError(data.message || 'Error al actualizar foto');
      }
    };

    reader.readAsDataURL(file);
  } catch (error) {
    setError('Error al subir la foto');
    console.error(error);
  } finally {
    setUploading(false);
  }
};

  useEffect(() => {
    const userData = localStorage.getItem('usuario');
    if (userData) {
      setUsuario(JSON.parse(userData));
    }
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formPassword.passwordNueva !== formPassword.passwordConfirmar) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formPassword.passwordNueva.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    // Por ahora solo mostramos mensaje de éxito
    // En producción, aquí harías una petición al backend
    setSuccess('Contraseña actualizada exitosamente');
    setFormPassword({
      passwordActual: '',
      passwordNueva: '',
      passwordConfirmar: ''
    });
    
    setTimeout(() => {
      setShowModal(false);
      setSuccess('');
    }, 2000);
  };

  if (!usuario) {
    return <div className="loading">Cargando perfil...</div>;
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>👤 Mi Perfil</h1>
          <p className="page-subtitle">Información de tu cuenta</p>
        </div>
      </div>

      <div style={{maxWidth: '800px', margin: '0 auto'}}>
  
  {/* Sección Foto de Perfil */}
  <div className="table-container" style={{marginBottom: '24px'}}>
    <div style={{padding: '32px', textAlign: 'center'}}>
      <h2 style={{marginBottom: '24px', fontSize: '22px'}}>Foto de Perfil</h2>
      
      <div style={{marginBottom: '24px'}}>
        {usuario.foto_perfil ? (
          <img 
            src={usuario.foto_perfil} 
            alt={usuario.nombre}
            style={{
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '4px solid #038C8C'
            }}
          />
        ) : (
          <div style={{
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            background: '#038C8C',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '64px',
            fontWeight: '700',
            margin: '0 auto',
            border: '4px solid #026b6b'
          }}>
            {usuario.nombre?.charAt(0).toUpperCase() || 'U'}
          </div>
        )}
      </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleFotoChange}
            style={{display: 'none'}}
            id="foto-perfil-input"
          />
                
      <label htmlFor="foto-perfil-input" className="btn-primary" style={{cursor: 'pointer'}}>
        Cambiar Foto
      </label>
    </div>
  </div>

  <div className="table-container" style={{marginBottom: '24px'}}>
    <div style={{padding: '32px'}}>
      <h2 style={{marginBottom: '24px', fontSize: '22px'}}>Información Personal</h2>
            
            <div style={{display: 'grid', gap: '20px'}}>
              <div>
                <label style={{display: 'block', fontWeight: '700', marginBottom: '8px', color: '#4a5568'}}>
                  Nombre
                </label>
                <div style={{
                  padding: '14px 16px',
                  background: '#f7fafc',
                  borderRadius: '10px',
                  fontSize: '15px'
                }}>
                  {usuario.nombre}
                </div>
              </div>

              <div>
                <label style={{display: 'block', fontWeight: '700', marginBottom: '8px', color: '#4a5568'}}>
                  Email
                </label>
                <div style={{
                  padding: '14px 16px',
                  background: '#f7fafc',
                  borderRadius: '10px',
                  fontSize: '15px'
                }}>
                  {usuario.email}
                </div>
              </div>

              <div>
                <label style={{display: 'block', fontWeight: '700', marginBottom: '8px', color: '#4a5568'}}>
                  Rol
                </label>
                <div style={{
                  padding: '14px 16px',
                  background: '#f7fafc',
                  borderRadius: '10px',
                  fontSize: '15px',
                  textTransform: 'capitalize'
                }}>
                  {usuario.rol}
                </div>
              </div>
            </div>

            <div style={{marginTop: '32px'}}>
              <button className="btn-primary" onClick={() => setShowModal(true)}>
                🔒 Cambiar Contraseña
              </button>
            </div>
          </div>
        </div>

        <div className="table-container">
          <div style={{padding: '32px'}}>
            <h2 style={{marginBottom: '16px', fontSize: '22px'}}>Acerca de ToolTrack</h2>
            <p style={{color: '#718096', lineHeight: '1.7', marginBottom: '16px'}}>
              ToolTrack es tu solución profesional para la gestión de herramientas, préstamos y mantenimientos.
            </p>
            <p style={{color: '#718096', lineHeight: '1.7'}}>
              <strong>Versión:</strong> 1.0.0<br />
              <strong>Desarrollado por:</strong> ToolTrack Team<br />
              <strong>Año:</strong> 2025
            </p>
          </div>
        </div>
      </div>

      {/* Modal Cambiar Contraseña */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Cambiar Contraseña</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleChangePassword}>
              {error && (
                <div style={{
                  background: '#fee2e2',
                  color: '#991b1b',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  marginBottom: '16px',
                  fontSize: '14px'
                }}>
                  {error}
                </div>
              )}

              {success && (
                <div style={{
                  background: '#d1fae5',
                  color: '#065f46',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  marginBottom: '16px',
                  fontSize: '14px'
                }}>
                  {success}
                </div>
              )}

              <div className="form-group">
                <label>Contraseña Actual *</label>
                <input
                  type="password"
                  value={formPassword.passwordActual}
                  onChange={(e) => setFormPassword({...formPassword, passwordActual: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Nueva Contraseña *</label>
                <input
                  type="password"
                  value={formPassword.passwordNueva}
                  onChange={(e) => setFormPassword({...formPassword, passwordNueva: e.target.value})}
                  required
                  minLength="6"
                />
              </div>

              <div className="form-group">
                <label>Confirmar Nueva Contraseña *</label>
                <input
                  type="password"
                  value={formPassword.passwordConfirmar}
                  onChange={(e) => setFormPassword({...formPassword, passwordConfirmar: e.target.value})}
                  required
                  minLength="6"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Cambiar Contraseña
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}