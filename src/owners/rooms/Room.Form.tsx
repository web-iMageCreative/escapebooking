import React, { useEffect, useState } from 'react';
import { RoomFormProps, RoomModel } from './Room.Model';
import  { Snackbar, Alert } from '@mui/material';
import './Room.Form.css';

const RoomForm: React.FC<RoomFormProps> = ({
    initialData,
    loading,
    error,
    onSubmit,
    onCancel,
    title = "Sala",
    submitText = "Guardar",
    cancelText = "Cancelar"
}) => {
    const [data, setData] = useState<RoomModel>(initialData);
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setData({
          ...data,
          [id]: value
        });
      };

    return (
        <div className="room-form-container">
            <form onSubmit={handleSubmit} className="room-form contained">
                <h2>{title}</h2>

                <div className="form-group">
                    <div className="col-label">
                        <label htmlFor="name">Nombre</label>
                        <p className="description">
                            Nombre comercial de tu sala.
                            Aparecerá en los listados de búsqueda.
                        </p>
                    </div>
                    <div className="col-value">
                        <input 
                            type="text"
                            id="name"
                            value={data.name}
                            onChange={handleInputChange}
                            placeholder="Sala Masters Albacete"
                            required
                            disabled={loading}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <div className="col-label">
                        <label htmlFor="description">Descripción</label>
                        <p className="description">
                            Describe tu Sala. Incluye temática, dificultad, y experiencia única.
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

                <div className="form-group">
                    <div className="col label">
                        <label htmlFor="duration">Duración</label>
                        <p className="description">
                            Duración completa de la experiencia en minutos
                        </p>
                    </div>
                    <div className="col-value">
                        <input 
                            type="number"
                            id="duration"
                            value={data.duration}
                            onChange={handleInputChange}
                            placeholder="150"
                            required
                            disabled={loading} 
                        />
                    </div>
                </div>

                <div className="form-group">
                    <div className="col-label">
                        <label htmlFor="min_players">Mínimo de jugadores</label>
                        <p className="description">
                            Número mínimo de jugadores permitidos.
                        </p>
                    </div>
                    <div className="col-value">
                        <input 
                            type="number"
                            id="min_players"
                            value={data.min_players}
                            onChange={handleInputChange}
                            placeholder="1"
                            required
                            disabled={loading} 
                        />
                    </div>
                </div>

                <div className="form-group">
                    <div className="col-label">
                        <label htmlFor="max_players">Máximo de jugadores</label>
                        <p className="description">
                            Número máximo de jugadores permitidos.
                        </p>
                    </div>
                    <div className="col-value">
                        <input 
                            type="number"
                            id="max_players"
                            value={data.max_players}
                            onChange={handleInputChange}
                            placeholder="6"
                            required
                            disabled={loading} 
                        />
                    </div>
                </div>

                

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

export default RoomForm;
