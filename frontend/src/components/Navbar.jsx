import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const isActive = (path) => location.pathname === path ? 'active' : '';
  const isLandingPage = location.pathname === '/';
  const isLoginPage = location.pathname === '/login';

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img 
            src="/assets/tooltrack-logo-header-dark.svg" 
            alt="ToolTrack" 
            className="navbar-logo-img"
            style={{ height: '50px' }}
          />
        </Link>
        
        {isLandingPage ? (
          <div className="nav-links-landing">
            <a href="#nosotros" className="nav-link-landing">Quiénes somos</a>
            <a href="#planes" className="nav-link-landing">Planes</a>
            <a href="#demo" className="nav-link-landing">Contacto</a>
            <Link to="/login" className="btn-ingresa">Ingresa</Link>
            <a href="#planes" className="btn-comenzar">Empieza gratis</a>
          </div>
        ) : isLoginPage ? (
          <div className="nav-links-landing">
            <Link to="/" className="nav-link-landing">Inicio</Link>
            <a href="/#planes" className="btn-comenzar">Empieza gratis</a>
          </div>
        ) : (
        <div className="nav-links">
          <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>

          {(usuario?.rol === 'admin' || usuario?.rol === 'supervisor') && (
            <Link to="/escanear" className={isActive('/escanear')}>Escanear</Link>
          )}

          {(usuario?.rol === 'admin' || usuario?.rol === 'supervisor') && (
            <Link to="/herramientas" className={isActive('/herramientas')}>Herramientas</Link>
          )}

          {(usuario?.rol === 'admin' || usuario?.rol === 'supervisor') && (
            <Link to="/empleados" className={isActive('/empleados')}>Empleados</Link>
          )}

          <Link to="/prestamos" className={isActive('/prestamos')}>Préstamos</Link>

          {(usuario?.rol === 'admin' || usuario?.rol === 'supervisor') && (
            <Link to="/mantenimientos" className={isActive('/mantenimientos')}>Mantenimientos</Link>
          )}
          
          {(usuario?.rol === 'admin' || usuario?.rol === 'supervisor') && (
            <Link to="/reportes" className={isActive('/reportes')}>Reportes</Link>
          )}
          
          <div className="user-menu">
            
            <button 
                    className="user-menu-btn"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                  {usuario?.foto_perfil ? (
                    <img 
                      src={usuario.foto_perfil} 
                      alt={usuario.nombre}
                      className="user-avatar"
                    />
                  ) : (
                    <div className="user-avatar-placeholder">
                      {usuario?.nombre?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <span>{usuario?.nombre || 'Usuario'}</span>
                  <span>▼</span>
                </button>
            
            {showUserMenu && (
              <div className="user-menu-dropdown">
                <Link to="/perfil" onClick={() => setShowUserMenu(false)}>
                  Perfil
                </Link>
                
                {usuario?.rol === 'admin' && (
                  <Link to="/configuracion" onClick={() => setShowUserMenu(false)}>
                    Configuración
                  </Link>
                )}
                
                {usuario?.rol === 'admin' && (
                  <Link to="/usuarios" onClick={() => setShowUserMenu(false)}>
                    Usuarios
                  </Link>
                )}
                
                {token && (
                  <button onClick={handleLogout} className="logout-option">
                    Cerrar sesión
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      </div>
    </nav>
  );
}