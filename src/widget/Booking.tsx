import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { RoomModel } from '../owners/rooms/Room.Model';
import { BookingModel, BookingFormError } from './Booking.Model';
import { BookingService } from './Booking.Service';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { RoomService } from '../owners/rooms/Room.Service';
import { Box, Button, Stack, TextField, FormControl, FormHelperText } from '@mui/material';
import { esES } from '@mui/x-date-pickers/locales';
import './Booking.css'


const Booking: React.FC = () => {
    const params = useParams();
    const id:string | undefined = params.id;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [clickDay, setClickDay] = useState<dayjs.Dayjs | null>(null);
    const [hours, setHours] = useState<any[]>([]);
    const [clickDate, setClickDate] = useState<Date | null>(null);
    const [hourSelected, setHourSelected] = useState<boolean>(false);
    const [iHourSelected, setIHourSelected] = useState<number>(-1);
    const [iPlayersSelected, setIPlayersSelected] = useState<number>(-1);
    const [availableHours, setAvailableHours] = useState<string[]>([]);
    const [validationError, setValidationError] = useState<BookingFormError>({
        name: { success: true, message: '' },
        email: { success: true, message: '' },
        phone: { success: true, message: '' },
      })
    
    const [room, setRoom] = useState<RoomModel>({
        id: 0,
        name: '',
        duration: 0,
        schedule: [],
        min_players: 0,
        max_players: 0,
        prices: [],
        escaperoom_id: 0
    });

    const [bookingData, setBookingData] = useState<BookingModel>({
        id: 0,
        name: 'Miguel',
        email: 'web@imagecreative.es',
        phone: 66555444,
        num_players: 0,
        date: new Date(),
        price: 0,
        id_room: 0,
        notes: ''
    });

    useEffect(() => {
        getRoom();
    }, []);

    useEffect(() => {
        if (room.id === 0) return;
        handleClickDay(dayjs());
    }, [room.id]);

    const getRoom = async () => {
        try {
            const res = await RoomService.getRoom(parseInt(id!));
            setRoom(res.data);
        } catch {
            console.log('Error cargando sala');
        } finally {
            return;
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {id, value} = e.target;
        setBookingData({
            ...bookingData,
            [id]: value
        });
    };

    const handleClickDay = async (value: dayjs.Dayjs | null) => {
        setClickDay(value);
        setIHourSelected(-1);
        const selectedDate = value;
        const currentDate = dayjs();
        if (currentDate.format('YYYY-MM-DD') > selectedDate!.format('YYYY-MM-DD')) {
            setHours([]);
            setAvailableHours([]);
            return;
        }
        
        const dayOfWeek = value?.get('day');
        const date = value?.format('YYYY-MM-DD')
        
        try {
            setLoading(true);
            const resHours = await BookingService.getHours(room.id, dayOfWeek!);
            const resAvailableHours = await BookingService.getAvailableHours(room.id, date!);
            console.log(resAvailableHours);
            setHours(resHours.data);
            setAvailableHours(resAvailableHours.data?.map((x: { hour: string }) => x.hour) ?? []);
        } catch {
            setError('Error al recuperar las horas.')
        } finally {
            setLoading(false);
        }
        
        setClickDate(value!.toDate());
    };

    const handleClickHour = (hour: any, i: number) => {
        const [h, m] = (hour.hour).split(':').map(Number);
        
        const dateDefinitive = clickDay!
        .hour(h)
        .minute(m)
        
        console.log(dateDefinitive.toDate());
        
        setIHourSelected(i);
        setHourSelected(true);
        setBookingData({
            ...bookingData,
            date: dateDefinitive.toDate()
        });
    };

    const validateFields = () => {
        const emailValidate = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        const phoneValidate = /^[(]?[0-9]{0,9}[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}[)]?$/im;
        
        const nameValid = bookingData.name.length > 0 && bookingData.name.length <= 100;
        const emailValid = emailValidate.test(bookingData.email);
        const phoneValid = phoneValidate.test(String(bookingData.phone));

        setValidationError({
            name: { success: nameValid, message: nameValid ? '' : 'Nombre no válido' },
            email: { success: emailValid, message: emailValid ? '' : 'Email no válido' },
            phone: { success: phoneValid, message: phoneValid ? '' : 'Teléfono no válido' },
        });

        return nameValid && emailValid && phoneValid;
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateFields()) return;
        bookingData.id_room = room.id;

        const formattedDate = {
            ...bookingData,
            date: dayjs(bookingData.date).format('YYYY-MM-DD HH:mm:ss')
        };
        try {
            await BookingService.createBooking(formattedDate as any);
        } catch {
            setError('Error al realizar la reserva.');
        } finally {
            setLoading(false);
        }
    };

    const isToday = clickDay?.format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD');
    const currentHour = dayjs().format('HH:mm');

    const validate = (e: React.FocusEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    switch (id) {
      case 'name':
        if (value.length > 100) {
          setValidationError({...validationError, name: {success: false, message: 'Máximo 100 caracteres'}});
        } else {
          setValidationError({...validationError, name: {success: true, message: ''}});
        }
        break;

      case 'email':
        const emailValidate = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailValidate.test(value)) {
          setValidationError({...validationError, email: {success: false, message: 'Email no válido'}});
        } else {
          setValidationError({...validationError, email: {success: true, message: ''}});
        }
        break;

      case 'phone':
        const phoneValidate = /^[(]?[0-9]{0,9}[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}[)]?$/im;
        if (!phoneValidate.test(value)) {
          setValidationError({...validationError, phone: {success: false, message: 'Teléfono no válido'}});
        } else {
          setValidationError({...validationError, phone: {success: true, message: ''}});
        }
        break;

      default:
        break;
    }
  }

    return (
        <div className="booking form contained">
            <h3 style={{ textAlign: 'center' }}>Reservar {room.name}</h3>
            {room.notes && (
                <p style={{ textAlign: 'center', color: '#555', marginBottom: '16px' }}>
                    {room.notes}
                </p>
            )}
                <form onSubmit={handleSubmit}>
                    <Stack spacing={2} maxWidth={350} margin={'0 auto'}>
                        <Box className="box-selector" sx={{boxShadow: 2, backgroundColor: 'white', p: 2, borderBottom: '2px solid #aaa'}}>
                            <h4>Días disponibles:</h4>
                            <LocalizationProvider 
                                dateAdapter={AdapterDayjs}
                                localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}
                                adapterLocale='es'
                            >
                                <DateCalendar 
                                    sx={{ border: 1, borderColor: '#141414', width: '100%', height: '310px', borderWidth: 0 }}
                                    onChange={handleClickDay}
                                    value={clickDay}
                                    minDate={dayjs()}
                                />
                            </LocalizationProvider>
                        </Box>

                        {clickDay &&
                        <Box className="box-selector" sx={{boxShadow: 2, backgroundColor: 'white', p: 2, borderBottom: '2px solid #aaa'}}>
                            <h4>Horas disponibles:</h4>
                            {hours?.map((h, i) => {
                                const isNotAvailable = availableHours.includes(h.hour) || (isToday && h.hour < currentHour);
                                return (
                                    <Button
                                        sx={{margin: '0 5px'}}
                                        variant='contained'
                                        size='small'
                                        key={i}
                                        color={iHourSelected === i ? 'primary' : 'inherit'}
                                        onClick={() => handleClickHour(h, i)}
                                        disabled={isNotAvailable}
                                    >
                                        {h.hour.substring(0, 5)}
                                    </Button>
                                );
                            })}
                            {hours.length === 0 &&
                                <span>No hay horas disponibles</span>
                            }
                        </Box>
                        }
                        {hourSelected && (
                        <Box className="box-selector" sx={{boxShadow: 2, backgroundColor: 'white', p: 2, borderBottom: '2px solid #aaa'}}>
                            <h4>Número de jugadores:</h4>
                            {room.prices?.map((p, i) => (
                                <Button
                                    sx={{margin: '0 5px'}}
                                    variant='contained'
                                    size='small'
                                    key={i}
                                    color={iPlayersSelected === i ? 'primary' : 'inherit'}
                                    onClick={() => {
                                            setIPlayersSelected(i)
                                            setBookingData({
                                                ...bookingData,
                                                num_players: p.num_players,
                                                price: p.price
                                            })
                                        }
                                    }
                                >
                                    {p.num_players} {p.num_players == 1 ? 'jugador' : 'jugadores'} · {p.price} €
                                </Button>
                            ))}
                        </Box> 
                        )}

                        {bookingData.num_players > 0 && (
                        <>
                        <Stack spacing={2}>
                            <FormControl variant="filled" fullWidth>
                                <TextField
                                    variant="filled"
                                    id="name"
                                    label="Nombre"
                                    value={bookingData.name}
                                    onChange={handleChange}
                                    onBlur={validate}
                                    error={!validationError.name.success}
                                    placeholder="Nombre"
                                    required
                                    disabled={loading}
                                />
                                <FormHelperText error={!validationError.name.success} id="error_name">{validationError.name.message}</FormHelperText>
                            </FormControl>

                            <FormControl variant="filled" fullWidth> 
                                <TextField
                                    variant="filled"
                                    id="email"
                                    label="E-mail"
                                    value={bookingData.email}
                                    onChange={handleChange}
                                    onBlur={validate}
                                    error={!validationError.email.success}
                                    placeholder="Email"
                                    required
                                    disabled={loading}
                                />
                                <FormHelperText error={!validationError.email.success} id="error_email">{validationError.email.message}</FormHelperText>
                            </FormControl>    

                            <FormControl variant="filled" fullWidth>
                                <TextField
                                    variant="filled"
                                    id="phone"
                                    label="Teléfono"
                                    value={bookingData.phone}
                                    onChange={handleChange}
                                    onBlur={validate}
                                    error={!validationError.phone.success}
                                    placeholder="Teléfono"
                                    required
                                    disabled={loading}
                                />
                                <FormHelperText error={!validationError.phone.success} id="error_phone">{validationError.phone.message}</FormHelperText>
                            </FormControl>

                            <FormControl variant="filled" fullWidth>
                                <TextField
                                    variant="filled"
                                    id="notes"
                                    label="Notas (opcional)"
                                    value={bookingData.notes}
                                    onChange={handleChange}
                                    placeholder="Comentarios adicionales..."
                                    multiline
                                    rows={4}
                                    disabled={loading}
                                />
                            </FormControl>    
                       
                       
                            <Button 
                                size={'large'} 
                                variant="contained" 
                                color="primary" 
                                type="submit"
                                disabled={loading}
                            >
                                Reservar
                            </Button>
                        </Stack>
                        </>
                        )}
                    </Stack>

            </form>
        </div>
  );    
};

export default Booking;