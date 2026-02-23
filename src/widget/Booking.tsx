import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { RoomModel, Schedule } from '../owners/rooms/Room.Model';
import { BookingModel } from './Booking.Model';
import { BookingService } from './Booking.Service';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { RoomService } from '../owners/rooms/Room.Service';


const Booking: React.FC = () => {
    const params = useParams();
    const id:string | undefined = params.id;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [clickDay, setClickDay] = useState<dayjs.Dayjs | null>(null);
    const [hours, setHours] = useState<any[]>([]);
    const [clickDate, setClickDate] = useState<Date | null>(null);
    const [hourSelected, setHourSelected] = useState<boolean>(false);
    
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
        id_room: 0
    });

    useEffect(() => {
        getRoom();
    }, []);

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
        const selectedDate = value;
        const currentDate = dayjs();
        if (currentDate > selectedDate!) {
            setHours([]);
            return;
        }
        
        const dayOfWeek = value?.get('day');
        
        try {
            setLoading(true);
            const res = await BookingService.getHours(room.id, dayOfWeek!);
            setHours(res.data);
        } catch {
            setError('Error al recuperar las horas.')
        } finally {
            setLoading(false);
        }
        
        setClickDate(value!.toDate());
    };

    const handleClickHour = (hour: any) => {
        const [h, m, s] = (hour.hour).split(':').map(Number);

        const dateDefinitive = clickDay!
            .hour(h)
            .minute(m)
            .second(s);

            console.log(dateDefinitive.toDate());

        setHourSelected(true);
        setBookingData({
            ...bookingData,
            date: dateDefinitive.toDate()
        });
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        bookingData.id_room = room.id;

        const formatedDate = {
            ...bookingData,
            date: dayjs(bookingData.date).format('YYYY-MM-DD HH:mm:ss')
        };
        console.log(formatedDate)
        try {
            await BookingService.createBooking(formatedDate as any);
        } catch {
            setError('Error al realizar la reserva.');
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

                    <div className='form-group'>
                        <div className="col-label">
                            <p>Horas disponibles:</p>
                        </div>
                        <div className='col-value'>
                            {hours?.map((h, i) => ( 
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => handleClickHour(h)}
                                >
                                    {h.hour}
                                </button>
                            ))}
                            {hours.length === 0 &&
                                <span>No hay horas disponibles</span>
                            }
                        </div>
                    </div>

                    <div className='form-group'>
                        {hourSelected && (
                            <div className="col-value">                               
                                {room.prices?.map((p, i) => (
                                    <button
                                        key={i}
                                        type='button'
                                        onClick={() =>
                                            setBookingData({
                                                ...bookingData,
                                                num_players: p.num_players,
                                                price: p.price
                                            })
                                        }
                                    >
                                        {p.num_players} jugadores - {p.price}€
                                    </button>
                                ))}
                            </div> 
                        )}
                    </div>

                    {bookingData.num_players > 0 && (
                        <>
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
                        <button type="submit">
                            Reservar
                        </button>
                        </>
                    )}

            </form>
        </div>
  );    
};

export default Booking;