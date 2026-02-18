import React, { useEffect, useState } from 'react';
import { EscapeRoomFormProps, EscapeRoomModel } from '../EscapeRoom.Model';
import  { Snackbar, Alert } from '@mui/material';

const EscapeRoomForm: React.FC<EscapeRoomFormProps> = ({
  initialData,
  loading,
  error,
  onSubmit,
  onCancel,
  title = "Escape Room",
  submitText = "Guardar",
  cancelText = "Cancelar"
}) => {
  const [data, setData] = useState<EscapeRoomModel>(initialData);
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

//  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//    const value = e.target.value;
//    setProvinceSelected(value);
//    setData({
//      ...data,
//      province: parseInt(value) || 0
//    });
//  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setData({
      ...data,
      [id]: value
    });
  };

  return (
    <div>
      <form className="form contained" onSubmit={handleSubmit}>

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

        {/* Acciones */}
        <div className="form-actions">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary button"
          >
            {loading ? 'Procesando...' : submitText}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="btn-secondary button"
          >
            {cancelText}
          </button>
        </div>

      </form>
      
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
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