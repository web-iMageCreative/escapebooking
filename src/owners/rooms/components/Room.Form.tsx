import React, { useEffect, useState } from 'react';
import { Snackbar, Alert, Chip, TextField, FormControl, InputAdornment, FormHelperText, MenuItem, Button } from '@mui/material';
import { LocalizationProvider, TimeField } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { RoomFormProps, RoomModel, Price, Schedule, RoomFormError } from '../Room.Model';
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
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [day, setDay] = useState<number>(-1);
  const [hour, setHour] = useState<Date>(new Date(2000,1,1));
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [scheduleOK, setScheduleOK] = useState<boolean>(false);
  const [orderedSchedules, setOrderedSchedules] = useState<any>([[],[],[],[],[],[],[]]);
  const days_of_week: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
  const [validationError, setValidationError] = useState<RoomFormError>({
    name: { success: true, message: '' },
    duration: { success: true, message: '' },
    schedules: { success: true, message: '' },
    day: { success: true, message: '' },
    hour:  { success: true, message: '' },
    min_players: { success: true, message: '' },
    max_players: { success: true, message: '' },
    prices: []
  })

  useEffect(() => {
    setData(initialData);
    if (error !== null) {
      setOpenSnackbar(true);
    } else {
      setOpenSnackbar(false);
    }
  }, [error]);

  useEffect(() => {
    if (!initialData.schedule) return;
    
    setSchedules(initialData.schedule);

    let s: Schedule[] = sortSchedule([...initialData.schedule]);
    
    for (let i = 0; i <= 6; i++) {
      orderedSchedules[i] = s.filter(obj => obj.day_week === i);
    }

    setOrderedSchedules([...orderedSchedules]);

    for (let i = 0; i <= initialData.prices.length; i++) {
      validationError.prices.push({success: true, message: ''})
    }

    setValidationError(validationError);
  }, [initialData]);

  useEffect(() => {
    if (+data.min_players > +data.max_players 
      && +data.min_players !== 0 
      && +data.max_players !== 0 ) return;

    const max = data.max_players;
    const min = data.min_players;
    const newPrices: Price[] = [];

    for (let i = min; i <= max; i++) {
      const existe = data.prices.find(x => x.num_players === i)
      const hasId = data.id !== 0;
      validationError.prices.push({success: true, message: ''})
      newPrices.push(
        { id_room: hasId ? data.id : 0, num_players: i, price: existe ? existe.price : 0 }
      );
    }

    setData(({
      ...data,
      prices: newPrices
    }));
  }, [data.min_players, data.max_players]);

  useEffect(() => {
    setData({
      ...data,
      schedule: schedules
    });
  }, [schedules]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let { id, value } = e.target;
    
    if (id === "duration" || id === "min_players" || id === "max_players") {
      const onlyNums = e.target.value.replace(/[^0-9]/g, '');
      value = onlyNums;
    }

    if (id === "min_players" || id === "max_players") {
      if ( Number(value) > 20) {
        value = '20';
      }
    }

    setData({
      ...data,
      [id]: value
    });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value: string = e.target.value;
    let point: RegExpMatchArray | null;
    let parts: string[];
    let price: number | string;

    if (value === '') {
      value = '0';
    } else {
      value = value.replace(',','.')
      value = value.replace(/[^0-9.]/g, '');
      point = value.match(/\./g); 
      parts = value.split('.');

      if (point && point.length > 1) {
        value = parts[0] + '.' + parts.slice(1).join('');
      }

      if (parts[1] && parts[1].length > 2) {
        value = parts[0] + '.' + parts[1].substring(0,2);
      }
    }
    
    if (value.endsWith('.') || value.endsWith('0')) {
      price = value;
    } else {
      price = parseFloat(value);
    }

    const index: number = parseInt(e.target.dataset.index!);
    const min: number = data.min_players;
    const newPrices: Price[] = Object.assign([], data.prices);

    newPrices[index] = { id_room: 0, num_players: +min + +index, price: price };

    setData(({
      ...data,
      prices: newPrices
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    data.schedule = schedules;
    onSubmit(data);
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDay(Number(e.target.value));
  };

  const handleHourChange = (value: dayjs.Dayjs | null) => {
    setHour(new Date(0, 0, 0, value?.get('hour'), value?.get('minute')));
  };

  const handleAddSchedule = () => {
    let s: Schedule[] = [...schedules, {
      id_room: initialData.id,
      day_week: day,
      hour: hour,
      strHour: new Intl.DateTimeFormat("es-ES", { hour: 'numeric', minute: 'numeric' }).format(hour.getTime())
    }];

    s = sortSchedule(s);

    for (let i = 0; i <= 6; i++) {
      orderedSchedules[i] = s.filter(obj =>  obj.day_week === i);
    }

    setOrderedSchedules([...orderedSchedules]);
    setSchedules(s);
  };

  const handleDeleteHour = (i: number, j: number) => {
    const id_room = orderedSchedules[i][j]['id_room'];
    const day_week = orderedSchedules[i][j]['day_week'];
    const hour = orderedSchedules[i][j]['hour'];
    const s = schedules.filter( (schedule) => {
      return !(schedule.id_room === id_room && schedule.day_week === day_week && schedule.hour === hour);
    });
    setSchedules(s);

    delete orderedSchedules[i][j];
    setOrderedSchedules([...orderedSchedules]);
  }
  
  const sortSchedule = (s: Schedule[]) => {
    const result: Schedule[] = s.sort((a, b) => {
      return a.hour.getTime() - b.hour.getTime();
    });

    return result;
  }

  const validate = ( e: React.FocusEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    switch (id) {
      case 'name':
        if ( value.length > 100 ) {
          setValidationError({...validationError, name: {success: false, message: 'Máximo 100 caracteres'}} );
        } else {
          setValidationError({...validationError, name: {success: true, message: ''}} );
        }
      break;
    
      case 'duration':
        if ( Number(value) > 1440 ) {
          setValidationError({...validationError, duration: {success: false, message: 'Máximo 1440 minutos (24h)'}} );
        } else {
          setValidationError({...validationError, duration: {success: true, message: ''}} );
        }
      break;
    
      case 'min_players':
      case 'max_players':
        if (data.min_players > data.max_players) {
          setValidationError({...validationError, 
            min_players: {success: false, message: 'Mínimo debe ser igual o menor que máximo'},  
            max_players: {success: false, message: 'Mínimo debe ser igual o menor que máximo'}
          });
        } else {
          setValidationError({...validationError, 
            min_players: {success: true, message: ''},
             max_players: {success: true, message: ''}
          });
        }
      break;
      
      case 'prices':
        return true;
      break;

      default:
        return true;
      break;
    }
  }

  const validateSchedule =  (fieldId: string) => () => {
    const id = fieldId;

    switch (id) {
      case 'day':
        if ( day > 6 ) {
          setValidationError({...validationError, day: {success: false, message: 'Selecciona día de la semana'}} );
          setScheduleOK(false);
        } else {
          setValidationError({...validationError, day: {success: true, message: ''}} );
          setScheduleOK(true);
        }
      break;

      case 'hour':
        if ( hour.getFullYear() === 2000 ) {
          setValidationError({...validationError, hour: {success: false, message: 'Añade una hora'}} );
          setScheduleOK(false);
        } else {
          setValidationError({...validationError, hour: {success: true, message: ''}} );
          setScheduleOK(true);
        }
      break;
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="form contained" noValidate autoComplete='off'>
        <h2>{title}</h2>

        <div className="form-group">
          <div className="col-label">
            <label htmlFor="name">Nombre de la sala</label>
            <p className="description">
              Nombre comercial de tu sala.
              Usa un nombre con gancho, que evoque la ambientación de la partida.
            </p>
          </div>
          <div className="col-value">
            <FormControl variant="filled" fullWidth>
              <TextField
                variant='filled'
                sx={{backgroundColor: 'white'}}
                id="name"
                label="Nombre"
                slotProps={{
                  input: {
                    "aria-label": "Duración"
                  },
                }}
                required
                error={!validationError.name.success}
                value={data.name}
                onChange={handleInputChange}
                onBlur={validate}
                disabled={loading}
              />
              <FormHelperText error={!validationError.name.success} id="error_name">{validationError.name.message}</FormHelperText>
            </FormControl>
          </div>
        </div>

        <div className="form-group">
          <div className="col-label">
            <label htmlFor="duration">Duración de la partida</label>
            <p className="description">
              Duración completa de la experiencia en minutos
            </p>
          </div>
          <div className="col-value">
            <FormControl variant="filled" fullWidth>
              <TextField
                sx={{backgroundColor: 'transparent'}}
                variant="filled"
                type="text"
                id="duration"
                label="Duración"
                slotProps={{
                  input: {
                    endAdornment: <InputAdornment position="end">minutos</InputAdornment>,
                    "aria-label": "Duración"
                  },
                }}
                defaultValue={undefined}
                value={data.duration}
                onChange={handleInputChange}
                onBlur={validate}
                error={!validationError.duration.success}
                disabled={loading}
              />
              <FormHelperText error={!validationError.duration.success} id="error_duration">{validationError.duration.message}</FormHelperText>
            </FormControl>
          </div>
        </div>

        <div className="schedules">
          <h3>Horarios</h3>
          <div className="calendar">
            {orderedSchedules
              .map((d: any, i: number) => {
                return (
                <div key={i} className="day-of-week"> 
                  <div className="day-name">{days_of_week[i]}</div>
                  {d.map((s: Schedule, j: number) => (
                    <div key={j} className="hour">
                      <Chip
                        sx={{ width: '95%', fontSize: '12px' }}
                        label={ s.strHour }
                        onDelete={() => handleDeleteHour(i, j)}
                        color='primary'
                      />
                    </div>
                  ))}
                </div>
              )})}
          </div>

          <div className="schedule-form">
            <FormControl fullWidth>
              <TextField
                label="Días"
                select
                variant='filled'
                id="day"
                onChange={handleDayChange}
                onBlur={validateSchedule('day')}
                error={!validationError.day.success}
              >
                <MenuItem value={0}>Lunes</MenuItem>
                <MenuItem value={1}>Martes</MenuItem>
                <MenuItem value={2}>Miércoles</MenuItem>
                <MenuItem value={3}>Jueves</MenuItem>
                <MenuItem value={4}>Viernes</MenuItem>
                <MenuItem value={5}>Sábado</MenuItem>
                <MenuItem value={6}>Domingo</MenuItem>
              </TextField>
              <FormHelperText error={!validationError.day.success} id="error_duration">{validationError.day.message}</FormHelperText>
            </FormControl>

            <FormControl fullWidth>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimeField
                  variant='filled'
                  label="Hora"
                  id="hour"
                  defaultValue={dayjs("00:00")}
                  format="HH:mm"
                  onChange={handleHourChange}
                  onBlur={validateSchedule('hour')}
                  error={!validationError.hour.success}
                />
              </LocalizationProvider>
              <FormHelperText error={!validationError.hour.success} id="error_duration">{validationError.hour.message}</FormHelperText>
            </FormControl>

            <div className="action">  
              <Button 
                fullWidth
                color='inherit'
                size='large'
                variant="contained"
                disabled={!scheduleOK}
                onClick={handleAddSchedule}
              >
                Añadir horario
              </Button>
            </div>
          </div>
        </div>

        <h3>Precios <small>/ número de jugadores</small></h3>

        <div className="form-group">
          <div className="col-label">
            <label htmlFor="min_players">Mínimo de jugadores</label>
            <p className="description">
              Número mínimo de jugadores permitidos.
            </p>
          </div>
          <div className="col-value">
            <FormControl variant="filled" fullWidth>
              <TextField
                sx={{backgroundColor: 'transparent'}}
                variant="filled"
                type="text"
                id="min_players"
                label="Mínimo"
                slotProps={{
                  input: {
                    endAdornment: <InputAdornment position="end">Jugadores</InputAdornment>,
                    "aria-label": "Mínimo"
                  },
                }}
                value={data.min_players}
                onChange={handleInputChange}
                onBlur={validate}
                error={!validationError.min_players.success}
                disabled={loading}
              />
              <FormHelperText error={!validationError.min_players.success} id="error_min_players">{validationError.min_players.message}</FormHelperText>
            </FormControl>
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
            <FormControl variant="filled" fullWidth>
              <TextField
                sx={{backgroundColor: 'transparent'}}
                variant="filled"
                type="text"
                id="max_players"
                label="Máximo"
                slotProps={{
                  input: {
                    endAdornment: <InputAdornment position="end">Jugadores</InputAdornment>,
                    "aria-label": "Máximo"
                  },
                }}
                value={data.max_players}
                onChange={handleInputChange}
                onBlur={validate}
                error={!validationError.max_players.success}
                disabled={loading}
              />
              <FormHelperText error={!validationError.max_players.success} id="error_max_players">
                {validationError.max_players.message}
              </FormHelperText>
            </FormControl>
          </div>
        </div>

        {(data.min_players > 0 && data.max_players > 0 && data.min_players <= data.max_players &&
          <>
            {data.prices.map((x, index: number) => (
              <div key={x.num_players} className="form-group indented">
                <div className="col-label">
                  <label htmlFor={'price_' + x.num_players}>{x.num_players} {x.num_players === 1 ? 'jugador' : 'jugadores'}</label>
                </div>
                <div className="col-value">
                  <FormControl variant="filled" fullWidth>
                    <TextField
                      sx={{backgroundColor: 'transparent'}}
                      variant="filled"
                      type="text"
                      id={'price_' + x.num_players}
                      label="Precio"
                      slotProps={{
                        input: {
                          endAdornment: <InputAdornment position="end">€</InputAdornment>,
                          'aria-label': 'Precio'
                        },
                        htmlInput: {
                          'data-index': index
                        }
                      }}
                      value={x.price}
                      onChange={handlePriceChange}
                      onBlur={validate}
                      error={!validationError.prices[index]?.success}
                      disabled={loading}
                    />
                    <FormHelperText error={!validationError.prices[index]?.success} id="error_prices">{validationError.prices[index]?.message}</FormHelperText>
                  </FormControl>
                </div>
              </div>
            ))}
          </>
        )}

        <div className="form-actions">
          <Button
            sx={{marginRight: '20px'}}
            type="submit"
            color='primary'
            size='large'
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Procesando...' : submitText}
          </Button>

          <Button
            type="button"
            color='inherit'
            size='large'
            variant="contained"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </Button>
        </div>

      </form>

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
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