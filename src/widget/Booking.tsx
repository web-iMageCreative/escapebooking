import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { RoomModel, Schedule } from '../owners/rooms/Room.Model';
import { BookingModel } from './Booking.Model';
import { BookingService } from './Booking.Service';
import { RoomService } from '../owners/rooms/Room.Service';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';


const Booking: React.FC = () => {
    const params = useParams();
    const id:string | undefined = params.id;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [clickDay, setClickDay] = useState<dayjs.Dayjs | null>(null);
    const [hours, setHours] = useState<Schedule[]>([]);
    const [clickHour, setClickHour] = useState<Schedule | null>(null);
    
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
        name: '',
        email: '',
        phone: 0,
        num_players: 0,
        date: new Date(),
        id_room: 0
    });

    useEffect(() => {
        getRoom();
    }, []);

    const getRoom = async () => {
        try {
            const res = await BookingService.getRoom(parseInt(id!));
            setRoom(res.data);
        } catch {
            console.log('Error cargando sala');
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
        const dayOfWeek = value?.get('day');

        try {
            const res = await BookingService.getHours(room.id, dayOfWeek!);
            setHours(res.data);
        } catch {
            setError('Error al recuperar las horas.')
        } finally {
            setLoading(false);
        }

        setBookingData({
            ...bookingData,
            date: value!.toDate()
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            await BookingService.createBooking({
                ...bookingData,
                id_room: room.id
            });
        } catch {
            setError('Error al realizar la reserva.')
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="form contained">
            <h3>Reservar {room.name}</h3>
                <form onSubmit={handleSubmit}>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateCalendar sx={{ border: 1, borderColor: '#141414' }}
                        onChange={handleClickDay}
                        value={clickDay}
                        />
                    </LocalizationProvider>

                    <div className='form contained'>
                        <p>Horas disponibles:</p>
                        <div>
                            {hours?.map((h) => ( 
                                <button
                                    key={`${h.id_room}-${h.strHour}`} 
                                    type="button"

                                >
                                    {h.strHour} 
                                </button>
                            )) || <span>No hay horas disponibles</span>}
                        </div>

                    </div>

                    <div className="form-group">
                        <div className="col-label">
                            <label htmlFor="name">Nombre</label>
                        </div>
                        <div className="col-value">
                                <input
                                    type="text"
                                    id="name"
                                    value={bookingData.name}
                                    onChange={handleChange}
                                    placeholder="Nombre"
                                    required
                                    disabled={loading}
                                />
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="col-label">
                            <label htmlFor="email">Email</label>
                        </div>
                        <div className="col-value">
                                <input
                                    type="text"
                                    id="email"
                                    value={bookingData.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    required
                                    disabled={loading}
                                />
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="col-label">
                            <label htmlFor="phone">Teléfono</label>
                        </div>
                        <div className="col-value">
                                <input
                                    type="number"
                                    id="phone"
                                    value={bookingData.phone}
                                    onChange={handleChange}
                                    placeholder="Teléfono"
                                    required
                                    disabled={loading}
                                />
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="col-label">
                            <label htmlFor="num_players">Número de Juagdores</label>
                        </div>
                        <div className="col-value">
                                <input
                                    type="number"
                                    id="phone"
                                    value={bookingData.num_players}
                                    onChange={handleChange}
                                    placeholder="Jugadores"
                                    required
                                    disabled={loading}
                                />
                        </div>
                    </div>

                <button type="submit">
                    Reservar
                </button>

            </form>
        </div>
  );    
};

export default Booking;