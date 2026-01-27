import React, { useEffect, useState } from 'react';
import { EscapeRoomFormProps, EscapeRoomModel } from './EscapeRoom.Model';
import  { Snackbar, Alert } from '@mui/material';
import './EscapeRoom.Form.css';

const EscapeRoomForm: React.FC<EscapeRoomFormProps> = ({
  initialData,
  provinces,
  loading,
  error,
  onSubmit,
  onCancel,
  title = "Escape Room",
  submitText = "Guardar",
  cancelText = "Cancelar"
}) => {
  const [data, setData] = useState<EscapeRoomModel>(initialData);
  const [provinceSelected, setProvinceSelected] = useState<string>(initialData.province.toString());
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if ( error !== null ) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [error]);

  const handleSnackbarClose = () => { setOpen(false); }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(data);
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setProvinceSelected(value);
    setData({
      ...data,
      province: parseInt(value) || 0
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setData({
      ...data,
      [id]: value
    });
  };

  return (
    <div className="escaperoom-form-container">
      <form className="escaperoom-form contained" onSubmit={handleSubmit}>

        <h2>{title}</h2>

        {/* Campo: Nombre */}
        <div className="form-group">
          <div className="col-label">
            <label htmlFor="name">Nombre</label>
            <p className="description">
              Nombre comercial de tu escape room.
              Aparecerá en los listados de búsqueda.
            </p>
          </div>
          <div className="col-value">
            <input
              type="text"
              id="name"
              value={data.name}
              onChange={handleInputChange}
              placeholder="Escape Masters Madrid"
              required
              disabled={loading}
            />
          </div>
        </div>

        {/* Campo: Descripción */}
        <div className="form-group">
          <div className="col-label">
            <label htmlFor="description">Descripción</label>
            <p className="description">
              Describe tu escape room. Incluye temática,
              dificultad, y experiencia única.
            </p>
          </div>
          <div className="col-value">
            <textarea
              id="description"
              value={data.description}
              onChange={handleInputChange}
              placeholder="Sumérgete en una aventura de misterio..."
              rows={6}
              required
              disabled={loading}
            />
          </div>
        </div>

        {/* Campo: Dirección */}
        <div className="form-group">
          <div className="col-label">
            <label htmlFor="address">Dirección</label>
            <p className="description">
              Dirección completa para que los clientes
              puedan localizarte.
            </p>
          </div>
          <div className="col-value">
            <input
              type="text"
              id="address"
              value={data.address}
              onChange={handleInputChange}
              placeholder="Calle Gran Vía, 123"
              required
              disabled={loading}
            />
          </div>
        </div>

        {/* Campo: Provincia */}
        <div className="form-group">
          <div className="col-label">
            <label htmlFor="province">Provincia</label>
            <p className="description">
              Selecciona la provincia donde se encuentra
              tu establecimiento.
            </p>
          </div>
          <div className="col-value">
            <select
              id="province"
              value={provinceSelected}
              onChange={handleProvinceChange}
              disabled={loading || provinces.length === 0}
              required
            >
              <option value="0">-- Selecciona provincia --</option>
              {provinces.map((province) => (
                <option key={province.id} value={province.id}>
                  {province.name} ({province.code})
                </option>
              ))}
            </select>
            {provinces.length === 0 && (
              <p className="loading-text">Cargando provincias...</p>
            )}
          </div>
        </div>

        {/* Acciones */}
        <div className="form-actions">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Procesando...' : submitText}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="btn-secondary"
          >
            {cancelText}
          </button>
        </div>

      </form>
      
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={open}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default EscapeRoomForm;