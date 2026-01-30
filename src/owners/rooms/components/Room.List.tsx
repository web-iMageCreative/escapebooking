import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Room.List.css';
import { RoomService } from '../Room.Service';
import { RoomModel } from '../Room.Model';
import { useParams } from 'react-router-dom';
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
  Alert
  } from '@mui/material';


const RoomList: React.FC<any> = ( {id} ) => {
    const params = useParams();
    const [rooms, setRooms] = useState<RoomModel[]>([]);
    const [loading, setLoading] = useState(false);
    const escaperoom_id = params.escaperoom_id || id;
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [idToDelete, setIdToDelete] = useState<number>(0);
    const nav = useNavigate();
    const location = useLocation();
    const [alertData, setAlertData] = useState<any>(location.state?.alert || {});
    


    useEffect(() => {
        getRooms();

        if (alertData.type) {
            setOpenSnackbar(true);
            window.history.replaceState({}, document.title);
        }
        }, []);

    const getRooms = async () => {
        setLoading(true);
        try {
            const res = await RoomService.getRooms( parseInt(escaperoom_id!) );
            setRooms(res.data);
        } catch(err: any) {
            setAlertData( { 'message': err?.message, 'type': 'error' } );
            setOpenSnackbar(true);
        } finally {
            setLoading(false);
            return;
        }
    }

    const handleReadClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        nav('/owner/room/' + e.currentTarget.dataset.id);
      }
    
      const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        nav('/owner/rooms/edit/' + e.currentTarget.dataset.id);
      }
    
      const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => { 
        setIdToDelete( parseInt( e.currentTarget.dataset.id! ) );
        setOpenDialog(true) ;
      }

      const handleDelete = async () => {
          handleDialogClose();
          
          if (idToDelete !== 0) {
            const res = await RoomService.delete(idToDelete);
            
            if ( res.success ) {
              setIdToDelete(0);
              getRooms();
              setAlertData( { 'message': res.message , 'type': 'info' } );
              setOpenSnackbar(true);
            }
        }
    }

    const handleSnackbarClose = () => { setOpenSnackbar(false); }
    const handleDialogClose = () => { setOpenDialog(false); }

    return (
        <div className='contenido-rooms contained'>
        <h2>Salas del Escaperoom</h2>
        { ! loading && 
            <div className='lista-rooms'>
            {rooms.map(room => (
                <Card key={room.id} sx={{ maxWidth: 345 }}>
                    <CardMedia
                        component="img"
                        alt="logo"
                        height="140"
                        image="/assets/imgs/escaperooms/generic.jpg"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {room.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {room.description}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small" data-id={room.id} onClick={handleReadClick}>Ver</Button>
                        <Button size="small" data-id={room.id} onClick={handleEditClick}>Editar</Button>
                        <Button size="small" data-id={room.id} onClick={handleDeleteClick}>Eliminar</Button>
                    </CardActions>
                </Card>
                ))}
            </div>
        }
    
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
        </div>
    );
};

export default RoomList;
