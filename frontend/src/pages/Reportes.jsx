import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../App.css';
import { API_URL } from '../config';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function Reportes() {
  const [datos, setDatos] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarReportes();
  }, []);

  const cargarReportes = async () => {
    try {
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      const empresa_id = usuario?.empresa_id;
      
      if (!empresa_id) {
        console.error('No hay empresa_id');
        return;
      }
      
      const response = await fetch(`${API_URL}/dashboard/reportes?empresa_id=${empresa_id}`);
      const data = await response.json();
      
      if (data.success) {
        setDatos(data.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Colores para gráficos
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  // Formatear números a COP
  const formatCOP = (num) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(num);
  };

  // Función para exportar a PDF
  const exportarPDF = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    try {
      // Header del PDF
      pdf.setFillColor(3, 140, 140);
      pdf.rect(0, 0, pageWidth, 30, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(20);
      pdf.text('ToolTrack - Reportes y Análisis', pageWidth / 2, 15, { align: 'center' });
      pdf.setFontSize(10);
      const fecha = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
      pdf.text(`Generado el ${fecha}`, pageWidth / 2, 23, { align: 'center' });
      
      let yPosition = 40;
      
      // Sección de Ahorro
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(14);
      pdf.text('💰 Ahorro por Mantenimientos Gratuitos', 15, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(10);
      pdf.text(`Ahorro Total Anual: ${formatCOP(datos?.ahorro?.ahorroAnual || 0)}`, 15, yPosition);
      yPosition += 7;
      pdf.text(`Herramientas Nuevas: ${datos?.ahorro?.herramientasNuevas || 0}`, 15, yPosition);
      yPosition += 7;
      pdf.text(`Mantenimientos Gratuitos Disponibles: ${datos?.ahorro?.mantenimientosGratuitos || 0}`, 15, yPosition);
      yPosition += 7;
      pdf.text(`Ahorro Mensual Promedio: ${formatCOP(datos?.ahorro?.ahorroMensual || 0)}`, 15, yPosition);
      yPosition += 15;
      
      // Capturar gráficos
      const graficos = document.querySelectorAll('.stat-card');
      
      for (let i = 0; i < graficos.length; i++) {
        if (yPosition > pageHeight - 80) {
          pdf.addPage();
          yPosition = 20;
        }
        
        const canvas = await html2canvas(graficos[i], {
          scale: 2,
          backgroundColor: '#ffffff',
          logging: false
        });
        
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth - 30;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 15, yPosition, imgWidth, imgHeight);
        yPosition += imgHeight + 10;
      }
      
      // Guardar PDF
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      const nombreArchivo = `ToolTrack_Reporte_${usuario?.nombre?.replace(/\s/g, '_')}_${new Date().getTime()}.pdf`;
      pdf.save(nombreArchivo);
      
      alert('✅ Reporte exportado exitosamente');
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('❌ Error al generar el reporte PDF');
    }
  };

  if (loading) return <div className="loading">Cargando reportes...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>📊 Reportes y Análisis</h1>
          <p className="page-subtitle">Visualiza el rendimiento de tu inventario</p>
        </div>
        <button 
          className="btn-primary"
          onClick={exportarPDF}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          📄 Exportar a PDF
        </button>
      </div>

      {/* ========== AHORRO ANUAL ========== */}
      <div style={{
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        padding: '32px',
        borderRadius: '16px',
        marginBottom: '32px',
        color: 'white',
        boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)'
      }}>
        <h2 style={{ fontSize: '24px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          💰 Ahorro por Mantenimientos Gratuitos
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
          <div>
            <div style={{ fontSize: '36px', fontWeight: '700' }}>
              {formatCOP(datos?.ahorro?.ahorroAnual || 0)}
            </div>
            <div style={{ opacity: 0.9, fontSize: '14px' }}>Ahorro Total Anual</div>
          </div>
          <div>
            <div style={{ fontSize: '36px', fontWeight: '700' }}>
              {datos?.ahorro?.herramientasNuevas || 0}
            </div>
            <div style={{ opacity: 0.9, fontSize: '14px' }}>Herramientas Nuevas (último año)</div>
          </div>
          <div>
            <div style={{ fontSize: '36px', fontWeight: '700' }}>
              {datos?.ahorro?.mantenimientosGratuitos || 0}
            </div>
            <div style={{ opacity: 0.9, fontSize: '14px' }}>Mantenimientos Gratuitos Disponibles</div>
          </div>
          <div>
            <div style={{ fontSize: '36px', fontWeight: '700' }}>
              {formatCOP(datos?.ahorro?.ahorroMensual || 0)}
            </div>
            <div style={{ opacity: 0.9, fontSize: '14px' }}>Ahorro Mensual Promedio</div>
          </div>
        </div>
        <div style={{ 
          marginTop: '20px', 
          padding: '16px', 
          background: 'rgba(255, 255, 255, 0.1)', 
          borderRadius: '8px',
          fontSize: '14px'
        }}>
          💡 <strong>Beneficio:</strong> Cada herramienta nueva incluye 3 mantenimientos gratuitos del proveedor 
          (valor promedio: {formatCOP(datos?.ahorro?.costoPromedioMantenimiento || 0)} c/u). 
          Has realizado {datos?.ahorro?.mantenimientosRealizados || 0} mantenimientos este año.
        </div>
      </div>

      {/* ========== GRÁFICOS ========== */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '24px' }}>
        
        {/* Gráfico 1: Préstamos por Mes */}
        <div className="stat-card" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '20px' }}>📈 Préstamos por Mes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={datos?.prestamosPorMes || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
              <XAxis dataKey="mes" stroke="#718096" />
              <YAxis stroke="#718096" />
              <Tooltip 
                contentStyle={{ background: '#1a1a1a', border: '1px solid #2d3748' }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
              <Line type="monotone" dataKey="total" stroke="#10b981" strokeWidth={3} name="Préstamos" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico 2: Herramientas por Estado */}
        <div className="stat-card" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '20px' }}>🔧 Distribución por Estado</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={datos?.herramientasPorEstado || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ estado, cantidad }) => `${estado}: ${cantidad}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="cantidad"
              >
                {datos?.herramientasPorEstado?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ background: '#1a1a1a', border: '1px solid #2d3748' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico 3: Top Empleados */}
        <div className="stat-card" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '20px' }}>👷 Top 5 Empleados</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={datos?.topEmpleados || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
              <XAxis dataKey="nombre" stroke="#718096" angle={-45} textAnchor="end" height={100} />
              <YAxis stroke="#718096" />
              <Tooltip 
                contentStyle={{ background: '#1a1a1a', border: '1px solid #2d3748' }}
              />
              <Bar dataKey="total_prestamos" fill="#3b82f6" name="Préstamos" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico 4: Estado de Préstamos */}
        <div className="stat-card" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '20px' }}>📦 Estado de Préstamos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={datos?.estadoPrestamos || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ estado, cantidad }) => `${estado}: ${cantidad}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="cantidad"
              >
                {datos?.estadoPrestamos?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#3b82f6'} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ background: '#1a1a1a', border: '1px solid #2d3748' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}