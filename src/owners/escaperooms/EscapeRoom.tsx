import React, { useEffect, useState } from 'react';
import './EscapeRoom.css';
import { EscapeRoomModel } from './EscapeRoom.Model';
import { EscapeRoomService } from './EscapeRoom.Service';
import { User } from '../../users/UserModel';
import { AuthService } from '../../auth/AuthService';
import { ROUTES } from '../../routes';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import  { Snackbar, Alert } from '@mui/material';

const EscapeRoom: React.FC = () => {
  const [data, setData] = useState<EscapeRoomModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const currentUser: User = AuthService.getCurrentUser();
  const nav = useNavigate();
  const location = useLocation();
  const alertData = location.state?.alert || {};

  useEffect(() => {
    getEscaperooms();

    if (alertData.type) {
      setOpen(true);
      window.history.replaceState({}, document.title);
    }
  }, []);

  const getEscaperooms = async () => {
    try {
      const res = await EscapeRoomService.getEscaperooms(currentUser.id);
      setData(res.data);
    } catch(err: any) {
      const errMessage = err?.message || 'Error en la carga de Escaperooms';
      setError(errMessage);
    } finally {
      return;
    }
  }

  const handleReadClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    nav('/owner/escape-room/' + e.currentTarget.dataset.id);
  }

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    nav('/owner/escape-rooms/edit/' + e.currentTarget.dataset.id);
  }
  
  const handleSnackbarClose = () => { setOpen(false); }

  return (<>
    <div className='contenido-escaperooms contained'>
      <h2>Todos los EscapeRooms</h2>
      <div className='lista-escaperooms'>
        {data.map(escaperoom => (
          <Card sx={{ maxWidth: 345 }}>
          <CardMedia
            component="img"
            alt="logo"
            height="140"
            image="/assets/imgs/escaperooms/generic.jpg"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {escaperoom.name}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {escaperoom.description}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" data-id={escaperoom.id} onClick={handleReadClick}>Ver</Button>
            <Button size="small" data-id={escaperoom.id} onClick={handleEditClick}>Editar</Button>
          </CardActions>
        </Card>
        ))}
      </div>

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={open}
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
  </>
  );
};

export default EscapeRoom;