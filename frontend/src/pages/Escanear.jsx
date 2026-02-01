import { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import '../App.css';
import './Escanear.css';
import { API_URL } from '../config';

export default function Escanear() {
  // ========== ESTADOS ==========
  const [codigoQR, setCodigoQR] = useState('');
  const [herramienta, setHerramienta] = useState(null);
  const [empleados, setEmpleados] = useState([]);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState('');
  const [loading, setLoading] = useState(false);
  const [escaneando, setEscaneando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  // ========== EFECTO INICIAL ==========
  useEffect(() => {
    cargarEmpleados();
  }, []);

  // ========== FUNCIÓN: CARGAR EMPLEADOS ==========
  const cargarEmpleados = async () => {
    try {
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      const empresa_id = usuario?.empresa_id;
      
      if (!empresa_id) return;
      
      const response = await fetch(`${API_URL}/empleados?empresa_id=${empresa_id}`);
      const data = await response.json();
      if (data.success) {
        setEmpleados(data.data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // ========== FUNCIÓN: INICIAR ESCANEO CON CÁMARA ==========
  const iniciarEscaneo = () => {
    setEscaneando(true);
    
    const scanner = new Html5QrcodeScanner(
      "reader",
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      },
      false
    );

    scanner.render(
      (decodedText) => {
        setCodigoQR(decodedText);
        buscarHerramienta(decodedText);
        scanner.clear();
        setEscaneando(false);
      },
      (error) => {
        // Ignorar errores de escaneo continuo
      }
    );
  };

  // ========== FUNCIÓN: DETENER ESCANEO ==========
  const detenerEscaneo = () => {
    setEscaneando(false);
    const reader = document.getElementById('reader');
    if (reader) {
      reader.innerHTML = '';
    }
  };

  // ========== FUNCIÓN: BUSCAR HERRAMIENTA POR QR ==========
  const buscarHerramienta = async (codigo) => {
    setLoading(true);
    setMensaje('');
    
    try {
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      const empresa_id = usuario?.empresa_id;
      
      if (!empresa_id) {
        setMensaje('Error: No hay empresa_id');
        setLoading(false);
        return;
      }
      
      const response = await fetch(`${API_URL}/herramientas?empresa_id=${empresa_id}`);
      const data = await response.json();
      
      if (data.success) {
        const herramientaEncontrada = data.data.find(h => h.qr_code === codigo);
        
        if (herramientaEncontrada) {
          setHerramienta(herramientaEncontrada);
          
          // Si está en uso, buscar el préstamo activo
          if (herramientaEncontrada.estado === 'en_uso') {
            const prestamosRes = await fetch(`${API_URL}/prestamos?empresa_id=${empresa_id}`);
            const prestamosData = await prestamosRes.json();
            
            if (prestamosData.success) {
              const prestamoActivo = prestamosData.data.find(
                p => p.herramienta_id === herramientaEncontrada.id && p.estado === 'activo'
              );
              
              if (prestamoActivo) {
                setHerramienta({
                  ...herramientaEncontrada,
                  prestamo_id: prestamoActivo.id,
                  empleado_nombre: prestamoActivo.empleado
                });
              }
            }
          }
        } else {
          setMensaje('Herramienta no encontrada');
          setHerramienta(null);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setMensaje('Error al buscar herramienta');
    } finally {
      setLoading(false);
    }
  };

  // ========== FUNCIÓN: BUSCAR MANUAL (FORMULARIO) ==========
  const handleBuscarManual = (e) => {
    e.preventDefault();
    if (codigoQR.trim()) {
      buscarHerramienta(codigoQR.trim());
    }
  };

  // ========== FUNCIÓN: PRESTAR HERRAMIENTA ==========
  const prestarHerramienta = async () => {
    if (!empleadoSeleccionado) {
      alert('Selecciona un empleado');
      return;
    }
    
    try {
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      const empresa_id = usuario?.empresa_id;
      
      const response = await fetch(`${API_URL}/prestamos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          herramienta_id: herramienta.id,
          empleado_id: empleadoSeleccionado,
          empresa_id,
          usuario_registro_id: usuario.id
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMensaje('✅ Préstamo registrado exitosamente');
        setTimeout(() => {
          setHerramienta(null);
          setCodigoQR('');
          setEmpleadoSeleccionado('');
          setMensaje('');
        }, 2000);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al registrar préstamo');
    }
  };

  // ========== FUNCIÓN: DEVOLVER HERRAMIENTA ==========
  const devolverHerramienta = async () => {
    try {
      const response = await fetch(`${API_URL}/prestamos/${herramienta.prestamo_id}/devolver`, {
        method: 'PUT'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMensaje('✅ Herramienta devuelta exitosamente');
        setTimeout(() => {
          setHerramienta(null);
          setCodigoQR('');
          setMensaje('');
        }, 2000);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al devolver herramienta');
    }
  };

  // ========== FUNCIÓN: FORMATEAR FECHA ==========
  const formatearFecha = (fecha) => {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // ========== LOADING ==========
  if (loading) return <div className="loading">Cargando...</div>;

  // ========== RENDER ==========
  return (
    <div className="page">
      {/* ========== HEADER ========== */}
      <div className="page-header">
        <div>
          <h1>📱 Escanear QR</h1>
          <p className="page-subtitle">Registra préstamos y devoluciones al instante</p>
        </div>
      </div>

      <div className="escanear-container">
        {/* ========== SECCIÓN: ESCANEO/BÚSQUEDA ========== */}
        <div className="escanear-card">
          <h2>🔍 Buscar Herramienta</h2>
          
          {!escaneando ? (
            <>
              <button className="btn-primary btn-scan" onClick={iniciarEscaneo}>
                📷 Escanear con Cámara
              </button>
              
              <div className="divider-scan">
                <span>o</span>
              </div>

              <form onSubmit={handleBuscarManual} className="form-buscar">
                <input
                  type="text"
                  value={codigoQR}
                  onChange={(e) => setCodigoQR(e.target.value)}
                  placeholder="Escribe el código QR (ej: HERR-1234)"
                  className="input-qr"
                />
                <button type="submit" className="btn-secondary">
                  Buscar
                </button>
              </form>
            </>
          ) : (
            <>
              <div id="reader"></div>
              <button className="btn-secondary" onClick={detenerEscaneo} style={{marginTop: '16px'}}>
                Cancelar Escaneo
              </button>
            </>
          )}

          {loading && <p className="mensaje-loading">Buscando...</p>}
          {mensaje && <p className="mensaje-info">{mensaje}</p>}
        </div>

        {/* ========== SECCIÓN: RESULTADO ========== */}
        {herramienta && (
          <div className="resultado-card">
            <h2>📦 Herramienta Encontrada</h2>
            
            <div className="info-herramienta">
              <div className="info-row">
                <span className="label">Nombre:</span>
                <span className="value">{herramienta.nombre}</span>
              </div>
              
              <div className="info-row">
                <span className="label">Código QR:</span>
                <span className="value">{herramienta.qr_code}</span>
              </div>
              
              <div className="info-row">
                <span className="label">Estado:</span>
                <span className={`badge ${herramienta.estado}`}>
                  {herramienta.estado}
                </span>
              </div>

              {herramienta.estado === 'en_uso' && (
                <div className="info-row">
                  <span className="label">Prestado a:</span>
                  <span className="value">{herramienta.empleado_nombre}</span>
                </div>
              )}
            </div>

            {/* ========== ACCIONES: PRESTAR ========== */}
            {herramienta.estado === 'disponible' && (
              <div className="acciones">
                <h3>Prestar a:</h3>
                <select
                  value={empleadoSeleccionado}
                  onChange={(e) => setEmpleadoSeleccionado(e.target.value)}
                  className="select-empleado"
                >
                  <option value="">Selecciona empleado</option>
                  {empleados.map(e => (
                    <option key={e.id} value={e.id}>
                      {e.nombre} - {e.identificacion}
                    </option>
                  ))}
                </select>
                <button 
                  className="btn-primary btn-action" 
                  onClick={prestarHerramienta}
                  disabled={!empleadoSeleccionado}
                >
                  ✅ Registrar Préstamo
                </button>
              </div>
            )}

            {/* ========== ACCIONES: DEVOLVER ========== */}
            {herramienta.estado === 'en_uso' && (
              <div className="acciones">
                <button className="btn-primary btn-action" onClick={devolverHerramienta}>
                  🔄 Registrar Devolución
                </button>
              </div>
            )}

            {/* ========== ACCIONES: MANTENIMIENTO ========== */}
            {herramienta.estado === 'mantenimiento' && (
              <div className="acciones">
                <p className="mensaje-warning">⚠️ Esta herramienta está en mantenimiento</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}