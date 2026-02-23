import React, { useEffect, useState } from "react";
import { BookingModel } from "../../widget/Booking.Model";
import { BookingService } from "../../widget/Booking.Service";
import { RoomModel } from "../rooms/Room.Model";
import { RoomService } from "../rooms/Room.Service";
import { EscapeRoomModel } from "../escaperooms/EscapeRoom.Model";
import { EscapeRoomService } from "../escaperooms/EscapeRoom.Service";
import { AuthService } from "../../auth/AuthService";
import dayjs from "dayjs";
import "./OwnerBookings.css";


const OwnerBookings: React.FC = () => {
    const ownerId = AuthService.getCurrentUser()?.id;
    const [escaperooms, setEscaperooms] = useState<EscapeRoomModel[]>([]);
    const [rooms, setRooms] = useState<RoomModel[]>([]);
    const [bookings, setBookings] = useState<BookingModel[]>([]);
    const [selectedEscaperoom, setSelectedEscaperoom] = useState<number>(0);
    const [selectedRoom, setSelectedRoom] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getEscaperooms();
    }, []);

    useEffect(() => {
        if (selectedEscaperoom === 0) return;
        getRooms();
    }, [selectedEscaperoom]);

    useEffect(() => {
        if (selectedRoom === 0) return;
        getBookings();
    }, [selectedRoom]);

    const getEscaperooms = async () => {
        try {
            const res = await EscapeRoomService.getEscaperooms(ownerId);
            setEscaperooms(res.data);
            if (res.data.length > 0) setSelectedEscaperoom(res.data[0].id!);
        } catch {
            setError('Error al obtener los escaperooms.');
        }
    };

    const getRooms = async () => {
        try {
            const res = await RoomService.getRooms(selectedEscaperoom);
            setRooms(res.data ?? []);
            setSelectedRoom(res.data.length > 0 ? res.data[0].id! : 0);
        } catch {
            setError('Error al obtener las salas.');
        }
    };

    const getBookings = async () => {
        try {
            const res = await BookingService.getOwnerBookings(selectedRoom);
            setBookings(res.data ?? []);
        } catch {
            setError('Error al obtener las reservas.');
        }
    };

    const handleEscaperoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedEscaperoom(parseInt(e.target.value));
        setRooms([]);
        setBookings([]);
    };

    const handleRoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedRoom(parseInt(e.target.value));
        setBookings([]);
    };

    return (
        <div className='contained'>
            <div className='header-file'>
                <h2>Mis Reservas</h2>
            </div>
            <div className='actions'>
                <select value={selectedEscaperoom} onChange={handleEscaperoomChange}>
                    {escaperooms.map(escaperoom => (
                        <option key={escaperoom.id} value={escaperoom.id}>{escaperoom.name}</option>
                    ))}
                </select>
                <select value={selectedRoom} onChange={handleRoomChange}>
                    {rooms.length === 0 && <option value={0}>Sin salas</option>}
                    {rooms.map(room => (
                        <option key={room.id} value={room.id}>{room.name}</option>
                    ))}
                </select>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Nombre Sala</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.length === 0 &&
                        <tr>
                            <td colSpan={4}>No hay reservas.</td>
                        </tr>
                    }
                    {bookings.map(booking => (
                        <tr key={booking.id}>
                            <td>{booking.room_name}</td>
                            <td>{dayjs(booking.date).format('dddd DD MMMM')}</td>
                            <td>{dayjs(booking.date).format('HH:mm')}</td>
                            <td>
                                <button>Ver</button>
                                <button>Modificar</button>
                                <button>Cancelar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OwnerBookings;