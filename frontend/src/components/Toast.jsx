import { useState, useEffect } from 'react';

export default function Toast({ message, type = 'success', duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const colors = {
    success: { bg: '#059669', icon: '✓' }, // Verde más suave y profesional
    error: { bg: '#dc2626', icon: '✕' },
    warning: { bg: '#d97706', icon: '⚠' },
    info: { bg: '#2563eb', icon: 'ℹ' }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '90px', // Justo debajo del navbar
      left: '50%',
      transform: `translateX(-50%) translateY(${isVisible ? '0' : '-100px'})`,
      opacity: isVisible ? 1 : 0,
      transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      zIndex: 10000
    }}>
      <div style={{
        background: colors[type].bg,
        color: 'white',
        padding: '14px 28px',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        minWidth: '400px',
        maxWidth: '600px'
      }}>
        <div style={{
          fontSize: '20px',
          fontWeight: 'bold',
          width: '28px',
          height: '28px',
          background: 'rgba(255,255,255,0.25)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          {colors[type].icon}
        </div>
        <div style={{ 
          flex: 1, 
          fontSize: '15px', 
          fontWeight: '600',
          letterSpacing: '0.3px'
        }}>
          {message}
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '0',
            width: '24px',
            height: '24px',
            opacity: 0.8,
            transition: 'opacity 0.2s',
            flexShrink: 0
          }}
          onMouseEnter={(e) => e.target.style.opacity = '1'}
          onMouseLeave={(e) => e.target.style.opacity = '0.8'}
        >
          ×
        </button>
      </div>
    </div>
  );
}