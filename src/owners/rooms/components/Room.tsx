import React, { useEffect, useState } from 'react';
import { RoomModel } from '../Room.Model';
import { RoomService } from '../Room.Service';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Alert, Button, Fab, Snackbar } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import BeachAccessOutlinedIcon from '@mui/icons-material/BeachAccessOutlined';

const Room: React.FC = () => {
  const nav = useNavigate();
  const params = useParams();
  const id: string | undefined = params.id;
  const location = useLocation();
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [alertData, setAlertData] = useState<any>(location.state?.alert || {});
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
  const [error, setError] = useState<string | null>(null);
  const dayWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  useEffect(() => { getRoom() }, []);

  const getRoom = async () => {
    try {
      const res = await RoomService.getRoom(parseInt(params.id!));
      setRoom(res.data);
    } catch(err: any) {
      setAlertData({ 'message': err?.message, 'type': 'error' });
      setOpenSnackbar(true);
    } finally {
      return;
    }
  }

  const handleSnackbarClose = () => { setOpenSnackbar(false); }

  return (
    <div className="rooms contained">

      <div className="title">
        <Fab aria-label="add" sx={{width: '36px', height: '36px', fontSize: '12px', backgroundColor: 'white'}}  onClick={() => nav('/owner/escape-room/' + room.escaperoom_id)}>
          <ArrowBackIosNewIcon />
        </Fab>
        <h2>{room.name}</h2>
      </div>

      <div className="roomsheet">
        <div className="actions">
          <Button startIcon={<EditOutlinedIcon />} size="small" onClick={() => nav('/owner/rooms/edit/' + id)}>Editar</Button>
          <Button startIcon={<CalendarMonthOutlinedIcon />} size="small" onClick={() => nav('/booking/' + id)}>Reservar</Button>
          <Button startIcon={<BeachAccessOutlinedIcon />} size="small" onClick={() => nav('/owner/rooms/holidays/' + id)}>Vacaciones</Button>
        </div>
        <div className="form-group">
          <div className="col-label"><label>Duración</label></div>
          <div className="col-value"><p>{room.duration} min</p></div>
        </div>

        <div className="form-group">
          <div className="col-label"><label>Mínimo de jugadores</label></div>
          <div className="col-value"><p>{room.min_players}</p></div>
        </div>

        <div className="form-group">
          <div className="col-label"><label>Máximo de jugadores</label></div>
          <div className="col-value"><p>{room.max_players}</p></div>
        </div>

        <div className="form-group">
          <div className="col-label"><label>Precios</label></div>
          <div className="col-value">
            {room.prices.length == 0
              ? <p>No hay precios</p> : room.prices.map((price, i) => (
                <p key={i}>{price.num_players} {price.num_players == 1 ? 'jugador    ' : 'jugadores'} &#9;&#9;&#9; {price.price} €</p>
              ))
            }
          </div>
        </div>

        <div>
          <div className="col-label" style={{padding: '10px 0'}}><label>Horarios</label></div>
          <div className="schedules">
            {room.schedule.length == 0
              ? <p>No hay horarios</p> : dayWeek.map((dayWeek, i) => (
                <div key={i} className='schedule-day'>
                  <h5>{dayWeek}</h5>
                  {room.schedule.filter((schedule) => schedule.day_week == i).map((schedule, j) => (
                    <p key={j}>{schedule.strHour}</p>
                  ))}
                </div>
              ))
            }
          </div>
        </div>

        {room.notes && (
          <div className="form-group">
            <div className="col-label"><label>Notas</label></div>
            <div className="col-value"><p>{room.notes}</p></div>
          </div>
        )}
      </div>

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
    </div>
  );
}

export default Room;