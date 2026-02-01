import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/Login.css'; // Reutilizamos estilos del login
import { API_URL } from '../config';

export default function Registro() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    empresa: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validaciones
    if (formData.password !== formData.passwordConfirm) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/registro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          empresa: formData.empresa,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (data.success) {
        // Registro exitoso, redirigir al login
        alert('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.');
        navigate('/login');
      } else {
        setError(data.message);
        setLoading(false);
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-logo">
          <span className="logo-icon-big">🔧</span>
          <span className="logo-text-big">ToolTrack</span>
        </div>

        <h1 className="login-title">Crea tu cuenta</h1>
        <p className="login-subtitle">
          Comienza a gestionar tus herramientas de forma inteligente
        </p>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group-login">
            <label>Nombre completo *</label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              placeholder="Juan Pérez"
              required
            />
          </div>

          <div className="form-group-login">
            <label>Nombre de la empresa *</label>
            <input
              type="text"
              value={formData.empresa}
              onChange={(e) => setFormData({...formData, empresa: e.target.value})}
              placeholder="Mi Empresa S.A.S"
              required
            />
          </div>

          <div className="form-group-login">
            <label>Correo electrónico *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="correo@empresa.com"
              required
            />
          </div>

          <div className="form-group-login">
            <label>Contraseña *</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="Mínimo 6 caracteres"
              required
              minLength="6"
            />
          </div>

          <div className="form-group-login">
            <label>Confirmar contraseña *</label>
            <input
              type="password"
              value={formData.passwordConfirm}
              onChange={(e) => setFormData({...formData, passwordConfirm: e.target.value})}
              placeholder="Repite tu contraseña"
              required
              minLength="6"
            />
          </div>

          <button 
            type="submit" 
            className="btn-login"
            disabled={loading}
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
          </button>
        </form>

        <div className="login-footer">
          <p>
            ¿Ya tienes cuenta?{' '}
            <a href="/login">Inicia sesión</a>
          </p>
          <p className="login-footer-note">
            Al registrarte aceptas nuestros Términos y Condiciones
          </p>
        </div>
      </div>
    </div>
  );
}