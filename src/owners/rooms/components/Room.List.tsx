import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { RoomService } from '../Room.Service';
import { AuthService } from '../../../auth/AuthService';
import { RoomModel } from '../Room.Model';
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";
import NotchedContainer from '../../../shared/components/CircularNotchedBox';
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
  CardMedia,
  Typography,
  Snackbar,
  Alert,
  Fab
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import Groups2OutlinedIcon from '@mui/icons-material/Groups2Outlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import BeachAccessOutlinedIcon from '@mui/icons-material/BeachAccessOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CodeIcon from '@mui/icons-material/Code';


const RoomList: React.FC<any> = ({ id, escapeRoomName }) => {
  const params = useParams();
  const [viewCode, setViewCode] = useState<boolean>(false);
  const [selectedRoomCodeId, setSelectedRoomCodeId] = useState<number>(0);
  const [rooms, setRooms] = useState<RoomModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [idToDelete, setIdToDelete] = useState<number>(0);
  const escaperoom_id = params.escaperoom_id || id;
  const nav = useNavigate();
  const location = useLocation();
  const [alertData, setAlertData] = useState<any>(location.state?.alert || {});

  
  useEffect(() => {
    getRooms();
  }, []);

  const getRooms = async () => {
    setLoading(true);

    try {
      const res = await RoomService.getRooms(parseInt(escaperoom_id!));

      if (!res.success) {
        setAlertData({ 'message': res.message, 'type': 'info' });
        setOpenSnackbar(true);
      }
      
      setRooms(res.data);
    } catch (err: any) {
      setAlertData({ 'message': err?.message, 'type': 'error' });
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
      return;
    }
  }

  const handleViewCodeClick = (roomId: number) => {
    setSelectedRoomCodeId(roomId);
    setViewCode(true);
  }

  const handleReadClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    nav('/owner/room/' + e.currentTarget.dataset.id);
  }

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    nav('/owner/rooms/edit/' + e.currentTarget.dataset.id);
  }

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIdToDelete(parseInt(e.currentTarget.dataset.id!));
    setOpenDialog(true);
  }

  const handleDelete = async () => {
    handleDialogClose();

    if (idToDelete !== 0) {
      const res = await RoomService.delete(idToDelete);

      if (res.success) {
        setIdToDelete(0);
        getRooms();
        setAlertData({ 'message': res.message, 'type': 'info' });
        setOpenSnackbar(true);
      }
    }
  }

  const handleCopyCode = () => {
    const code = `<iframe src="https://dev3.icreative.es/booking/${selectedRoomCodeId}" frameborder="0"></iframe>`;
    navigator.clipboard.writeText(code);
    setAlertData({ 'message': 'Código copiado al portapapeles', 'type': 'success' });
    setOpenSnackbar(true);
  }

  const handleSnackbarClose = () => { setOpenSnackbar(false); }
  const handleDialogClose = () => { setOpenDialog(false); }

  return (
    <div className='room contained'>

      <div className="info">
        <p>Aquí puede gestionar las salas que contiene {escapeRoomName}. Si aún no ha definido ninguna, haga clic en el botón flotante "+".</p>
      </div>

      <div className="list-container">
        
        <NotchedContainer 
          width={60}
          cornerRadius={20}
          bgColor="#f8f8f8"
          side="top"
          pos="end"
        />

        <header className='header-section'>
          <div className='title' style={{ width: 'calc(80%)'}}><h3>Salas en {escapeRoomName}</h3></div>
          <div className="actions">
            <Fab color="primary" aria-label="add" sx={{width: '50px', height: '50px'}}  onClick={() => nav('/owner/rooms/new/' + params.id)}>
              <AddIcon />
            </Fab>
          </div>
          <div style={{ width: 'calc(20%)' }}></div>
        </header>

        {!loading &&
          <div className='list'>
            {rooms.map(room => (
              <Card key={room.id} elevation={5}>
                <CardActions>
                  <Button startIcon={<CalendarMonthOutlinedIcon />} size="small" onClick={() => nav('/booking/' + room.id)}>Reservar</Button>
                  <Button startIcon={<BeachAccessOutlinedIcon />} size="small" onClick={() => nav('/owner/rooms/holidays/' + room.id)}>Vacaciones</Button>
                  <Button startIcon={<CodeIcon />} size="small" onClick={() => handleViewCodeClick(room.id)}>Código</Button>
                </CardActions>
                <CardContent>
                  <Typography gutterBottom variant="subtitle2" component="h3" onClick={() => nav('/owner/room/' + room.id)}>
                    {room.name}
                  </Typography>
                  <p><AccessTimeOutlinedIcon sx={{color: '#888', fontSize: '16px', verticalAlign: 'middle'}} /> <strong>Duración:</strong> {room.duration} minutos.</p>
                  <p><Groups2OutlinedIcon sx={{color: '#888', fontSize: '16px', verticalAlign: 'middle'}} /> <strong>Jugadores:</strong> de {room.min_players} a {room.max_players}.</p>
                </CardContent>
                <CardActions>
                  <Button startIcon={<ArticleOutlinedIcon />} size="small" data-id={room.id} onClick={handleReadClick}>Ver</Button>
                  <Button startIcon={<EditOutlinedIcon />} size="small" data-id={room.id} onClick={handleEditClick}>Editar</Button>
                  <Button startIcon={<DeleteOutlineOutlinedIcon />} size="small" data-id={room.id} onClick={handleDeleteClick} color="error">Eliminar</Button>
                </CardActions>
              </Card>
            ))}
          </div>
        }
      </div>

      {viewCode && (
        <div className='pop-overlay' onClick={() => setViewCode(false)}>
          <div className='pop-content' onClick={(e) => e.stopPropagation()} style={{maxWidth: '400px'}}>
            <div className="code-wrapper">
              <h3>Instrucciones para integrar el widget de reservas en su web</h3>
              <p>Para integrar el widget de reservas en su web, copie y pegue el siguiente código en la sección de su página donde desea que aparezca el formulario de reservas.</p>
              <p style={{wordBreak: 'break-word', padding: '10px', backgroundColor: 'rgba(0,0,0,.08)', margin: '15px 0', fontFamily: 'monospace', fontSize: '14px'}}>
                &lt;iframe src="https://dev3.icreative.es/booking/{selectedRoomCodeId}" frameborder="0"&gt;&lt;/iframe&gt;
              </p>
              <Button startIcon={<ContentCopyIcon />} size="small" onClick={handleCopyCode}>
                Copiar Código
              </Button>
              <div className="form-actions">
                <Button
                  sx={{marginRight: '20px'}}
                  type="button"
                  color='primary'
                  size='large'
                  variant="contained"
                  onClick={() => setViewCode(false)}
                >
                  Cerrar
                </Button>
              </div>
            </div>
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
            Estás apunto de <strong>eliminar</strong> esta Sala y todos sus horarios y reservas. ¿Estás seguro?. Esta decisión no puede deshacerse.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* {user.email === 'madrid@escaperooms.com' && ( */}
      { false && (
        <div className="promo-card">
          <div className="promo-card-content">
            <h3>¿Quieres hacer crecer tu negocio?</h3>
            <Link to={'/register'}>Empezar Ahora</Link>
          </div>
        </div>
      )}

    </div>
  );
};

export default RoomList;
