import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { EscapeRoomModel } from '../EscapeRoom.Model';
import { EscapeRoomService } from '../EscapeRoom.Service';
import { User } from '../../../users/UserModel';
import { AuthService } from '../../../auth/AuthService';
import '../styles/EscapeRoom.List.css';
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
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

const EscapeRoomList: React.FC = () => {
  const [data, setData] = useState<EscapeRoomModel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [idToDelete, setIdToDelete] = useState<number>(0);
  const currentUser: User = AuthService.getCurrentUser();
  const nav = useNavigate();
  const location = useLocation();
  const [alertData, setAlertData] = useState<any>(location.state?.alert || {});

  useEffect(() => {
    getEscaperooms();

    // if (alertData.type) {
    //   setOpenSnackbar(true);
    //   window.history.replaceState({}, document.title);
    // }
  }, []);

  const getEscaperooms = async () => {
    setLoading(true);
    try {
      const res = await EscapeRoomService.getEscaperooms(currentUser.id);
      setData(res.data);
    } catch(err: any) {
      setAlertData( { 'message': err?.message, 'type': 'error' } );
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
      return;
    }
  }

  const handleReadClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    nav('/owner/escape-room/' + e.currentTarget.dataset.id);
  }

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    nav('/owner/escape-rooms/edit/' + e.currentTarget.dataset.id);
  }

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
    <div className='contenido-escaperooms contained'>
      <h3>Mis Negocios de Escape Rooms</h3>
      { ! loading && 
        <div className='lista-escaperooms'>
          {data.map(escaperoom => (
            <Card key={escaperoom.id} sx={{ boxShadow: 4 }}>
              <CardMedia
                component="img"
                alt="logo"
                height="200"
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
                <Button startIcon={<ArticleOutlinedIcon />} size="small" data-id={escaperoom.id} onClick={handleReadClick}>Ver</Button>
                <Button startIcon={<EditOutlinedIcon />} size="small" data-id={escaperoom.id} onClick={handleEditClick}>Editar</Button>
                <Button startIcon={<DeleteOutlineOutlinedIcon />} size="small" data-id={escaperoom.id} onClick={handleDeleteClick} color="error">Eliminar</Button>
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
            Estás apunto de <strong>eliminar</strong> este Escape Room y todos sus horarios y reservas. ¿Estás seguro?. Esta decisión no puede deshacerse.
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

export default EscapeRoomList;