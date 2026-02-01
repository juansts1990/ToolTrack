import { useState, useEffect } from 'react';
import { API_URL } from '../config';
import '../App.css';

export default function Configuracion() {
  const [loading, setLoading] = useState(true);
  const [empresa, setEmpresa] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    logo: '',
    nit: '',
    direccion: '',
    telefono: '',
    email: ''
  });

  useEffect(() => {
    cargarEmpresa();
  }, []);

  const cargarEmpresa = async () => {
    try {
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      const empresa_id = usuario?.empresa_id;
      
      if (!empresa_id) return;
      
      const response = await fetch(`${API_URL}/empresas/${empresa_id}`);
      const data = await response.json();
      
      if (data.success) {
        setEmpresa(data.data);
        setFormData({
          nombre: data.data.nombre || '',
          logo: data.data.logo || '',
          nit: data.data.nit || '',
          direccion: data.data.direccion || '',
          telefono: data.data.telefono || '',
          email: data.data.email || ''
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      const empresa_id = usuario?.empresa_id;
      
      const response = await fetch(`${API_URL}/empresas/${empresa_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('✅ Configuración actualizada exitosamente');
        cargarEmpresa();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar configuración');
    }
  };

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>⚙️ Configuración de Empresa</h1>
          <p className="page-subtitle">Personaliza la información de tu empresa</p>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{
          background: 'white',
          padding: '32px',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}>
          <form onSubmit={handleSubmit}>
            {/* Nombre de Empresa */}
            <div className="form-group">
              <label>Nombre de la Empresa *</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                required
              />
            </div>

            {/* Logo URL */}
            <div className="form-group">
              <label>Logo (URL de imagen)</label>
              <input
                type="text"
                value={formData.logo}
                onChange={(e) => setFormData({...formData, logo: e.target.value})}
                placeholder="https://ejemplo.com/logo.png"
              />
              <small style={{color: '#718096', fontSize: '13px'}}>
                Sube tu logo a un servicio como Imgur o usa una URL pública
              </small>
            </div>

            {/* Vista previa del logo */}
            {formData.logo && (
              <div style={{marginBottom: '24px'}}>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: 700}}>
                  Vista Previa:
                </label>
                <img 
                  src={formData.logo} 
                  alt="Logo" 
                  style={{
                    maxWidth: '200px',
                    maxHeight: '80px',
                    objectFit: 'contain',
                    border: '1px solid #e2e8f0',
                    padding: '8px',
                    borderRadius: '8px'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* NIT */}
            <div className="form-group">
              <label>NIT</label>
              <input
                type="text"
                value={formData.nit}
                onChange={(e) => setFormData({...formData, nit: e.target.value})}
                placeholder="123456789-0"
              />
            </div>

            {/* Dirección */}
            <div className="form-group">
              <label>Dirección</label>
              <input
                type="text"
                value={formData.direccion}
                onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                placeholder="Calle 123 #45-67"
              />
            </div>

            {/* Teléfono */}
            <div className="form-group">
              <label>Teléfono</label>
              <input
                type="text"
                value={formData.telefono}
                onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                placeholder="(+57) 300 123 4567"
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="contacto@empresa.com"
              />
            </div>

            <div style={{marginTop: '32px', display: 'flex', gap: '12px'}}>
              <button type="submit" className="btn-primary" style={{flex: 1}}>
                💾 Guardar Cambios
              </button>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={cargarEmpresa}
              >
                🔄 Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}