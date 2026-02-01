import { useState } from 'react';
import api from '../config/api';

export default function ModalNuevaHerramienta({ isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState({
    nombre: '',
    serial: '',
    categoria_id: 1,
    valor_compra: '',
    fecha_compra: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/herramientas', form);
      alert('✅ Herramienta creada');
      onSuccess();
      onClose();
    } catch (error) {
      alert('❌ Error: ' + error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🔧 Nueva Herramienta</h2>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre *</label>
            <input
              type="text"
              required
              value={form.nombre}
              onChange={e => setForm({...form, nombre: e.target.value})}
              placeholder="Ej: TALADRO DEWALT DCD771"
            />
          </div>
          <div className="form-group">
            <label>Serial</label>
            <input
              type="text"
              value={form.serial}
              onChange={e => setForm({...form, serial: e.target.value})}
              placeholder="Ej: TAL-DEW-01"
            />
          </div>
          <div className="form-group">
            <label>Valor Compra</label>
            <input
              type="number"
              value={form.valor_compra}
              onChange={e => setForm({...form, valor_compra: e.target.value})}
              placeholder="950000"
            />
          </div>
          <div className="form-group">
            <label>Fecha Compra</label>
            <input
              type="date"
              value={form.fecha_compra}
              onChange={e => setForm({...form, fecha_compra: e.target.value})}
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}