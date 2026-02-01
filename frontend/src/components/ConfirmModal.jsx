export default function ConfirmModal({ title, message, onConfirm, onCancel, type = 'warning' }) {
  const colors = {
    warning: { bg: '#d97706', icon: '⚠️' },
    danger: { bg: '#dc2626', icon: '🗑️' },
    info: { bg: '#2563eb', icon: 'ℹ️' }
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={onCancel}
      style={{ zIndex: 10001 }}
    >
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ 
          animation: 'zoomIn 0.3s ease-out',
          maxWidth: '480px'
        }}
      >
        <div style={{
          textAlign: 'center',
          padding: '32px 24px'
        }}>
          <div style={{
            fontSize: '64px',
            marginBottom: '16px',
            animation: 'bounce 0.6s ease-in-out'
          }}>
            {colors[type].icon}
          </div>
          
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '12px',
            color: 'white'
          }}>
            {title}
          </h2>
          
          <p style={{
            fontSize: '16px',
            color: '#a0aec0',
            marginBottom: '32px',
            lineHeight: '1.5'
          }}>
            {message}
          </p>

          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center'
          }}>
            <button 
              className="btn-secondary"
              onClick={onCancel}
              style={{ minWidth: '120px' }}
            >
              Cancelar
            </button>
            <button 
              className="btn-primary"
              onClick={onConfirm}
              style={{ 
                minWidth: '120px',
                background: colors[type].bg,
                borderColor: colors[type].bg
              }}
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}