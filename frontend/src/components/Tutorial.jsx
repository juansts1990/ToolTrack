import { useState } from 'react';
import '../App.css';

export default function Tutorial({ onClose }) {
  const [paso, setPaso] = useState(0);
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  const pasos = [
    {
      titulo: '¡Bienvenido a ToolTrack! 👋',
      descripcion: `Hola ${usuario.nombre}, estamos felices de tenerte aquí. Te mostraremos cómo usar el sistema en unos pocos pasos.`,
      icono: '🎉'
    },
    {
      titulo: 'Dashboard - Tu Centro de Control 📊',
      descripcion: 'Aquí encontrarás estadísticas en tiempo real: total de herramientas, préstamos activos, empleados registrados y más.',
      icono: '📈'
    },
    {
      titulo: 'Herramientas 🔧',
      descripcion: 'Gestiona tu inventario completo: agrega nuevas herramientas, edítalas, genera códigos QR y controla su estado.',
      icono: '🛠️'
    },
    {
      titulo: 'Empleados 👷',
      descripcion: 'Administra tu equipo de trabajo. Cada empleado tiene un código QR único para identificación rápida.',
      icono: '👥'
    },
    {
      titulo: 'Préstamos 📦',
      descripcion: 'Registra préstamos de herramientas, controla devoluciones y filtra por empleado. Exporta reportes en Excel o CSV.',
      icono: '📋'
    },
    {
      titulo: 'Escaneo QR 📱',
      descripcion: 'Usa tu móvil para escanear códigos QR y registrar préstamos o devoluciones de forma instantánea.',
      icono: '📲'
    },
    {
      titulo: '¡Listo para comenzar! 🚀',
      descripcion: 'Ya conoces las funcionalidades principales. ¡Explora el sistema y optimiza la gestión de tus herramientas!',
      icono: '✨'
    }
  ];

  const siguiente = () => {
    if (paso < pasos.length - 1) {
      setPaso(paso + 1);
    } else {
      finalizar();
    }
  };

  const anterior = () => {
    if (paso > 0) {
      setPaso(paso - 1);
    }
  };

  const finalizar = () => {
    localStorage.setItem('tutorial_completado', 'true');
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.95)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '20px'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #012E40 0%, #1a4d5e 100%)',
        borderRadius: '24px',
        padding: '48px',
        maxWidth: '600px',
        width: '100%',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
        border: '2px solid #738C8C',
        position: 'relative'
      }}>
        {/* Indicador de progreso */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '32px',
          justifyContent: 'center'
        }}>
          {pasos.map((_, index) => (
            <div
              key={index}
              style={{
                width: '40px',
                height: '4px',
                background: index === paso ? '#10b981' : '#2d3748',
                borderRadius: '2px',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>

        {/* Contenido */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            fontSize: '80px',
            marginBottom: '24px',
            animation: 'bounce 1s ease-in-out'
          }}>
            {pasos[paso].icono}
          </div>
          
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: 'white',
            marginBottom: '16px'
          }}>
            {pasos[paso].titulo}
          </h2>
          
          <p style={{
            fontSize: '16px',
            color: '#cbd5e0',
            lineHeight: '1.6'
          }}>
            {pasos[paso].descripcion}
          </p>
        </div>

        {/* Botones */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={finalizar}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#738C8C',
              cursor: 'pointer',
              fontSize: '14px',
              padding: '8px 16px'
            }}
          >
            Omitir tutorial
          </button>

          <div style={{ display: 'flex', gap: '12px' }}>
            {paso > 0 && (
              <button
                onClick={anterior}
                className="btn-secondary"
                style={{ padding: '12px 24px' }}
              >
                ← Anterior
              </button>
            )}
            
            <button
              onClick={siguiente}
              className="btn-primary"
              style={{ padding: '12px 32px' }}
            >
              {paso === pasos.length - 1 ? '¡Comenzar!' : 'Siguiente →'}
            </button>
          </div>
        </div>

        {/* Contador */}
        <div style={{
          textAlign: 'center',
          marginTop: '24px',
          color: '#738C8C',
          fontSize: '14px'
        }}>
          Paso {paso + 1} de {pasos.length}
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}