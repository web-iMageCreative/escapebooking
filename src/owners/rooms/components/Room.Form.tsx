import React, { useEffect, useState } from 'react';
import { RoomFormProps, RoomModel, Price, Schedule } from '../Room.Model';
import { Snackbar, Alert } from '@mui/material';
import '../styles/Room.Form.css';
import { days_of_week } from '../../../shared/data/days';

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
  const [openSchedule, setOpenSchedule] = useState<boolean>(false);
  const [day, setDay] = useState<number>(1);
  const [hour, setHour] = useState<Date>(new Date());
  const [schedules, setSchedules] = useState<Schedule[]>([]);


  useEffect(() => {
    setData(initialData);
    if (error !== null) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [error]);


  useEffect(() => {
    if (+data.min_players > +data.max_players) return;
    
    const max = data.max_players;
    const min = data.min_players;
    const newPrices: Price[] = [];
    
    for (let i = min; i <= max; i++) {
      const existe = data.prices.find(x => x.num_players === i)
      const hasId = data.id !== 0;
      newPrices.push(
        { id_room: hasId ? data.id : 0, num_players: i, price: existe ? existe.price : 0 }
      );
    }
    

    setData(({
      ...data,
      prices: newPrices
    }));
  }, [data.min_players, data.max_players]);


  const handleSnackbarClose = () => { setOpen(false); }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setData({
      ...data,
      [id]: value
    });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLInputElement>) => {
    if ( isNaN( parseFloat( e.target.value! ) ) ) return;
    const value: number = parseFloat(e.target.value!);
    const index: number = parseInt(e.target.dataset.index!);
    const min: number = data.min_players;
    const newPrices: Price[] = Object.assign([], data.prices);

    newPrices[index] = { id_room: 0, num_players: +min + +index, price: value };

    setData(({
      ...data,
      prices: newPrices
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(data);
  };

  const handleScheduleClick = () => {
    setOpenSchedule(true);
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDay(Number(e.target.value));
  };

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const h = e.target.value.split(':');

    setHour(new Date(0, 0, 0, Number(h[0]), Number(h[1])));

  };

  const handleAddSchedule = () => {
    let s:Schedule[] = schedules;
    s= [...schedules, {
      id_room: 0,
      day_week: day,
      hour: hour
    }];
    sortSchedules();
    setSchedules(s);
  };

  useEffect(() => {
    setData({
      ...data,
      schedule: schedules
    });
  }, [schedules]);


  const sortSchedules = () => {
    [...schedules].sort( (a, b) => {
      return a.hour.getTime() - b.hour.getTime();
    } );
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

        <button type="button" onClick={handleScheduleClick}>
          Introduce tu horario
        </button>

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

        {(data.min_players > 0 && data.max_players > 0 && data.min_players < data.max_players &&
          <>
          <h3>Precios por número de jugadores</h3>
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

      {openSchedule && (
          <div className='pop-overlay' onClick={() => setOpenSchedule(false)}>
            <div className='pop-content' onClick={(e) => e.stopPropagation()}>

              
              {schedules
                .map((s, i) => (
                  <div key={i} className="">
                    {s.hour.getHours()}
                  </div>
              ))}


              <div className="form-group">
                <label>Día</label>
                <select
                  value={day}
                  onChange={handleDayChange}
                >
                  <option value={1}>Lunes</option>
                  <option value={2}>Martes</option>
                  <option value={3}>Miércoles</option>
                  <option value={4}>Jueves</option>
                  <option value={5}>Viernes</option>
                  <option value={6}>Sábado</option>
                  <option value={7}>Domingo</option>
                </select>
              </div>

              <div className="form-group">
                <label>Hora</label>
                <input
                  type="time"
                  // value={hour.getTime()}
                  onChange={handleHourChange}
                  required
                />
              </div>

              <button type="button" onClick={handleAddSchedule}>
                Añadir horario
              </button>
            </div>
          </div>
        )}

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

export default RoomForm;
