import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { API_URL } from '../config';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    
    if (data.success) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('usuario', JSON.stringify(data.data.usuario));
      navigate('/dashboard');
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

        <h1 className="login-title">Ingresa a tu cuenta</h1>
        <p className="login-subtitle">Sigue ganando tiempo y tranquilidad</p>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="login-error">{error}</div>
          )}

          <div className="form-group-login">
            <label>Correo electrónico</label>
            <input
              type="email"
              placeholder="Ingresa tu correo electrónico"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div className="form-group-login">
            <div className="label-row">
              <label>Contraseña</label>
              <a href="/recuperar" className="forgot-link">¿Olvidaste tu contraseña?</a>
            </div>
            <input
              type="password"
              placeholder="Ingresa tu contraseña"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>

          <div className="divider">
            <span>o</span>
          </div>

          <button type="button" className="btn-google">
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.593.102-1.17.282-1.709V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.335z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
            </svg>
            Iniciar sesión con Google
          </button>

          <button type="button" className="btn-email">
            <span className="icon-email">✉️</span>
            Ingresar desde mi correo
          </button>
        </form>

        <div className="login-footer">
          <p>
            ¿Aún no tienes una cuenta? <a href="/registro">Regístrate gratis</a>
          </p>
          <p className="login-footer-note">
            Ingresa con las mismas credenciales a todos los productos de ToolTrack.
          </p>
        </div>
      </div>
    </div>
  );
}