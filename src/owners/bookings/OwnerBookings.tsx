import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { BookingModel } from "../../users/widget/Booking.Model";
import { BookingService } from "../../users/widget/Booking.Service";
import { RoomModel } from "../rooms/Room.Model";
import { RoomService } from "../rooms/Room.Service";
import { EscapeRoomModel } from "../escaperooms/EscapeRoom.Model";
import { EscapeRoomService } from "../escaperooms/EscapeRoom.Service";
import { AuthService } from "../../auth/AuthService";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CardActions, Snackbar, Alert, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, TablePagination, Fab } from '@mui/material';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import dayjs from "dayjs";
import 'dayjs/locale/es';
import { esES } from '@mui/x-date-pickers/locales';
dayjs.locale('es');

const OwnerBookings: React.FC = () => {
  const nav = useNavigate();
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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
      
      if (!res.success) {
        setAlertData({ 'message': res.message, 'type': 'info' });
        setOpenSnackbar(true);
        return;
      } else {
        if (res.data.length > 0) {
          setEscaperooms(Array.isArray(res.data) ? res.data : []);
          setSelectedEscaperoom(res.data[0].id!);
        }
      }
    } catch(err: any) {
      setAlertData({ 'message': err.message, 'type': 'error' });
      setOpenSnackbar(true);
    }
  };

  const getRooms = async () => {
    try {
      const res = await RoomService.getRooms(selectedEscaperoom);
      if (!res.success) {
        setAlertData({ 'message': res.message, 'type': 'info' });
        setOpenSnackbar(true);
        return;
      } else {
        setRooms(res.data ?? []);
        setSelectedRoom(res.data.length > 0 ? res.data[0].id! : 0);
      }
    } catch(err: any) {
      setAlertData({ 'message': err.message, 'type': 'info' });
    }
  };

  const getBookings = async () => {
    try {
      const res = await BookingService.getOwnerBookings(selectedRoom);

      if (!res.success) {
        setAlertData({ 'message': res.message, 'type': 'info' });
        setOpenSnackbar(true);
        setBookings([]);
        return;
      } else {
        setBookings(res.data ?? []);
        setPage(0);
      }
    } catch(err: any) {
      setAlertData({ 'message': err.message, 'type': 'error' });
      setOpenSnackbar(true);
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
    setPage(0);
  };

  const handleRead = (booking: BookingModel) => {
    setSelectedBooking(booking);
    setOpenRead(true);
  };

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIdToDelete(parseInt(e.currentTarget.dataset.id!));
    setOpenDialog(true);
  }

  const handleDelete = async () => {
    handleDialogClose();

    if (idToDelete !== 0) {
      const res = await BookingService.delete(idToDelete);

      if (res.success) {
        setIdToDelete(0);
        getBookings();
        setAlertData({ 'message': res.message, 'type': 'success' });
        setOpenSnackbar(true);
      }
    }
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSnackbarClose = () => { setOpenSnackbar(false); }
  const handleDialogClose = () => { setOpenDialog(false); }

  return (
    <div className='contained owner-bookings'>

      <div className="info">
        <div className="title">
          <Fab aria-label="add" sx={{ width: '36px', height: '36px', fontSize: '12px', backgroundColor: 'white' }} onClick={() => nav('/owner/dashboard')}>
            <ArrowBackIosNewIcon />
          </Fab>
          <h2>Mis Reservas</h2>
        </div>
        <p>Consulta aquí tus próximas reservas. Elige el negocio y la sala para el que realizas la consulta en los desplegables a continuación.</p>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', padding: '0 20px' }}>
        <div style={{ flex: '1 1 50%' }}>
          <label htmlFor="select-escaperoom">Escaperoom:</label>
          <select value={selectedEscaperoom} onChange={handleEscaperoomChange} id="select-escaperoom">
            {escaperooms.length === 0 && <option value={0}>Sin Escaperooms</option>}
            {escaperooms.map(escaperoom => (
              <option key={escaperoom.id} value={escaperoom.id}>{escaperoom.name}</option>
            ))}
          </select>
        </div>
        <div style={{ flex: '1 1 50%' }}>
          <label htmlFor="select-room">Sala:</label>
          <select value={selectedRoom} onChange={handleRoomChange} id="select-room" disabled={rooms.length === 0}>
            {rooms.length === 0 && <option value={0}>Sin Salas</option>}
            {rooms.map(room => (
              <option key={room.id} value={room.id}>{room.name}</option>
            ))}
          </select>
        </div>
      </div>

      <TableContainer sx={{ bgcolor: 'white', borderRadius: '4px' }}>
        <Table style={{ padding: '0 20px' }}>
          <TableHead>
            <TableRow>
              <TableCell>Nombre Sala</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Hora</TableCell>
              <TableCell>Notas</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.length == 0
              ? (
                <TableRow>
                  <TableCell colSpan={5}>No hay reservas.</TableCell>
                </TableRow>
              )
              : (() => {
                // Calcula las reservas a mostrar en la página actual
                const startIndex = page * rowsPerPage;
                const endIndex = startIndex + rowsPerPage;
                const currentBookings = bookings.slice(startIndex, endIndex);

                return currentBookings.map(booking => (
                  <TableRow key={booking.id}>
                    <TableCell>{booking.room_name}</TableCell>
                    <TableCell>{dayjs(booking.date).format('dddd DD MMMM')}</TableCell>
                    <TableCell>{dayjs(booking.date).format('HH:mm')}</TableCell>
                    <TableCell>
                      {booking.notes
                        ? booking.notes
                        : <span style={{ color: '#838383' }}>———————</span>
                      }
                    </TableCell>
                    <TableCell>
                      <CardActions>
                        <Button startIcon={<ArticleOutlinedIcon />} size="small" onClick={() => handleRead(booking)}>Ver</Button>
                        <Button startIcon={<DeleteOutlineOutlinedIcon />} size="small" onClick={handleDeleteClick} data-id={booking.id} color="error">Cancelar</Button>
                      </CardActions>
                    </TableCell>
                  </TableRow>
                ));
              })()
            }
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        sx={{ backgroundColor: '#f8f8f8' }}
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={bookings.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Reservas/pág."
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
      />

      {openRead && selectedBooking && (
        <div className='pop-overlayCreate' onClick={() => setOpenRead(false)}>
          <div className='pop-contentCreate' onClick={(e) => e.stopPropagation()}>
            <h3>Detalles de la reserva</h3>
            <div className="row-data"><div>Fecha:</div><div>{dayjs(selectedBooking.date).format('dddd DD MMMM')}</div></div>
            <div className="row-data"><div>Hora:</div><div>{dayjs(selectedBooking.date).format('HH:mm')}</div></div>
            <div className="row-data"><div>Sala:</div><div>{selectedBooking.room_name}</div></div>
            <hr />
            <div className="row-data"><div>Nombre:</div><div>{selectedBooking.name}</div></div>
            <div className="row-data"><div>Email:</div><div>{selectedBooking.email}</div></div>
            <div className="row-data"><div>Teléfono:</div><div>{selectedBooking.phone}</div></div>
            <hr />
            <div className="row-data"><div>Jugadores:</div><div>{selectedBooking.num_players}</div></div>
            <div className="row-data"><div>Precio:</div><div>{selectedBooking.price} €</div></div>
            {selectedBooking.notes && (
              <>
                <hr />
                <p>Notas:<br />{selectedBooking.notes}</p>
              </>
            )}
            <Button
              sx={{ marginTop: '30px' }}
              type="button"
              color='primary'
              size='large'
              variant="contained"
              onClick={() => setOpenRead(false)}
            >
              Cerrar
            </Button>
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