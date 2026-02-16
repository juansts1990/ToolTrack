import React from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar({ userName, userRole, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    onLogout();
    navigate('/login');
  };

  return (
    <nav style={{
      backgroundColor: '#0a4d4e',
      padding: '15px 30px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      {/* ====== LOGO TOOLTRACK - NUEVO ====== */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img 
          src="/assets/tooltrack-logo-header-dark.svg" 
          alt="ToolTrack" 
          style={{ 
            height: '50px',
            cursor: 'pointer',
            transition: 'transform 0.3s ease'
          }}
          onClick={() => navigate('/dashboard')}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        />
      </div>
      {/* ====== FIN LOGO ====== */}

      {/* Información del usuario */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '20px',
        color: '#ffffff'
      }}>
        <span style={{ 
          fontSize: '14px',
          fontWeight: '500'
        }}>
          {userName} ({userRole})
        </span>
        
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: '#14b8a6',
            color: 'white',
            border: 'none',
            padding: '8px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#0d9488'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#14b8a6'}
        >
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
