import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { BookingModel } from "../../widget/Booking.Model";
import { BookingService } from "../../widget/Booking.Service";
import { RoomModel } from "../rooms/Room.Model";
import { RoomService } from "../rooms/Room.Service";
import { EscapeRoomModel } from "../escaperooms/EscapeRoom.Model";
import { EscapeRoomService } from "../escaperooms/EscapeRoom.Service";
import { AuthService } from "../../auth/AuthService";
import dayjs from "dayjs";
import "./OwnerBookings.css";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Card,
  CardActions,
  CardContent,
  Typography,
  Snackbar,
  Alert
  } from '@mui/material';


const OwnerBookings: React.FC = () => {
    const ownerId = AuthService.getCurrentUser()?.id;
    const [escaperooms, setEscaperooms] = useState<EscapeRoomModel[]>([]);
    const [rooms, setRooms] = useState<RoomModel[]>([]);
    const [bookings, setBookings] = useState<BookingModel[]>([]);
    const [selectedEscaperoom, setSelectedEscaperoom] = useState<number>(0);
    const [selectedRoom, setSelectedRoom] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [selectedBooking, setSelectedBooking] = useState<BookingModel | null>(null);
    const [idToDelete, setIdToDelete] = useState<number>(0);
    const [openRead, setOpenRead] = useState<boolean>(false);
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const location = useLocation();
    const [alertData, setAlertData] = useState<any>(location.state?.alert || {});
    const [user, setUser] = useState(AuthService.getCurrentUser());

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
        setSelectedRoom(0);
        setRooms([]);
        setBookings([]);
    };

    const handleRoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedRoom(parseInt(e.target.value));
        setBookings([]);
    };

    const handleRead = (booking: BookingModel) => {
        setSelectedBooking(booking);
        setOpenRead(true);
    };

    const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => { 
        setIdToDelete( parseInt( e.currentTarget.dataset.id! ) );
        setOpenDialog(true) ;
      }
    
      const handleDelete = async () => {
        handleDialogClose();
        
        if (idToDelete !== 0) {
          const res = await EscapeRoomService.delete(idToDelete);
          
          if ( res.success ) {
            setIdToDelete(0);
            getEscaperooms();
            setAlertData( { 'message': res.message , 'type': 'info' } );
            setOpenSnackbar(true);
          }
        }
    }

    const handleSnackbarClose = () => { setOpenSnackbar(false); }
    const handleDialogClose = () => { setOpenDialog(false); }

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
                        <th>Notas</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.length === 0 &&
                        <tr>
                            <td colSpan={5}>No hay reservas.</td>
                        </tr>
                    }
                    {bookings.map(booking => (
                        <tr key={booking.id}>
                            <td>{booking.room_name}</td>
                            <td>{dayjs(booking.date).format('dddd DD MMMM')}</td>
                            <td>{dayjs(booking.date).format('HH:mm')}</td>
                            <td>{booking.notes ? booking.notes : <span style={{ color: '#838383' }}>———————</span>}</td>
                            <td>
                                <button onClick={() => handleRead(booking)}>Ver</button>
                                <button data-id={booking.id} onClick={handleDeleteClick}>Cancelar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {openRead && selectedBooking && (
                <div className='pop-overlayCreate' onClick={() => setOpenRead(false)}>
                    <div className='pop-contentCreate' onClick={(e) => e.stopPropagation()}>
                        <h3>Detalles de la reserva</h3>
                        <p>Hora: {dayjs(selectedBooking.date).format('HH:mm')}</p>
                        <p>Nombre: {selectedBooking.name}</p>
                        <p>Email: {selectedBooking.email}</p>
                        <p>Teléfono: {selectedBooking.phone}</p>
                        <p>Jugadores: {selectedBooking.num_players}</p>
                        <p>Precio: {selectedBooking.price} €</p>
                        <p>Sala: {selectedBooking.room_name}</p>
                        <p>Fecha: {dayjs(selectedBooking.date).format('dddd DD MMMM')}</p>
                        {selectedBooking.notes && (
                            <p>Notas: {selectedBooking.notes}</p>
                        )}
                        <button onClick={() => setOpenRead(false)}>Cerrar</button>
                    </div>
                </div>
            )}

            {user.email === 'madrid@escaperooms.com' && (
                <div className="promo-card">
                <div className="promo-card-content">
                    <h3>¿Quieres hacer crecer tu negocio?</h3>
                    <button type="button" className="buttonLink">Contratar Ahora</button>
                </div>
                </div>
            )}

            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                open={openSnackbar}
                autoHideDuration={5000}
                onClose={handleSnackbarClose}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={alertData.type}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {alertData.message}
                </Alert>
            </Snackbar>
            
            <Dialog
                open={openDialog}
                onClose={handleDialogClose}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">
                    Confirmar Eliminación
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        Estás apunto de <strong>eliminar</strong> esta reserva. ¿Estás seguro?. Esta decisión no puede deshacerse.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Cancelar</Button>
                    <Button onClick={handleDelete} color="error" autoFocus>
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default OwnerBookings;
