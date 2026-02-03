import React, { useEffect, useState } from 'react';
import { RoomFormProps, RoomModel, Price } from '../Room.Model';
import { Snackbar, Alert } from '@mui/material';
import '../styles/Room.Form.css';

const RoomForm: React.FC<RoomFormProps> = ({
  initialData,
  loading,
  error,
  onSubmit,
  onCancel,
  title,
  submitText,
  cancelText
}) => {
  const [data, setData] = useState<RoomModel>(initialData);
  const [open, setOpen] = useState<boolean>(false);
  const min: number = data.min_players;
  const max: number = data.max_players;

  useEffect(() => {
    setData(initialData);
    if (error !== null) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [error]);


  useEffect(() => {
    if (min > max) return;
    const newPrices: Price[] = [];

    if (data.prices.length > 0)
      for (let i = 0; i <= max - min; i++) {
        const indice = i - min
        const existe = data.prices[indice];
        newPrices.push(
        { id_room: 0, num_players: i, price: existe ? existe.price : 0 }
      );
    } else {
      for (let i = min; i <= max; i++) {
        newPrices.push(
          { id_room: 0, num_players: i, price: 0 }
        );
      }
    }

    setData(({
      ...data,
      prices: newPrices
    }));
  }, [min, max]);


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

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLInputElement>) => {
    if ( isNaN( parseFloat( e.target.value! ) ) ) return;
    const id: string = e.target.id;
    const value: number = parseFloat(e.target.value!);
    const index: number = parseInt(e.target.dataset.index!);
    const newPrices: Price[] = Object.assign([], data.prices);

    newPrices[index] = { id_room: 0, num_players: +min + +index, price: value };

    setData(({
      ...data,
      prices: newPrices
    }));
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
          <div className="col-label">
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
              value={min}
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
              value={max}
              onChange={handleInputChange}
              placeholder="6"
              required
              disabled={loading}
            />
          </div>
        </div>

        {(min > 0 && max > 0 && min < max &&
          <>
          <h2>Precios Por número de jugadores</h2>
          {data.prices.map( (x, index: number) => (
            <div key={x.num_players} className="form-group indented">
              <div className="col-label">
              <label htmlFor={'price_' + x.num_players}>{x.num_players} jugadores</label>
              </div>
              <div className="col-value">
                <input
                  type="number"
                  id={'price_' + x.num_players}
                  data-index={index}
                  min={0}
                  step={0.01}
                  value={x.price}
                  onChange={handlePriceChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>
          ))}
          </>
        )}

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
