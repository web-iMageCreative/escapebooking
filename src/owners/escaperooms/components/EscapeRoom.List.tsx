import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { EscapeRoomModel } from '../EscapeRoom.Model';
import { EscapeRoomService } from '../EscapeRoom.Service';
import { User } from '../../../users/UserModel';
import { AuthService } from '../../../auth/AuthService';
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
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EscapeRoomUpdate from './EscapeRoom.Update';

const EscapeRoomList: React.FC = () => {
  const [data, setData] = useState<EscapeRoomModel[]>([]);
  const [user, setUser] = useState(AuthService.getCurrentUser());
  const [loading, setLoading] = useState<boolean>(false);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [idToDelete, setIdToDelete] = useState<number>(0);
  const currentUser: User = AuthService.getCurrentUser();
  const nav = useNavigate();
  const location = useLocation();
  const [alertData, setAlertData] = useState<any>(location.state?.alert || {});
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [idToEdit, setIdToEdit] = useState<number | null>(0);

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
    const id = parseInt(e.currentTarget.dataset.id!);
    setIdToEdit(id);
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
    setIdToEdit(null);
    getEscaperooms(); 
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
      <h3>Mis Escape Rooms</h3>
      { ! loading && 
        <div className='list'>
          {data.map(escaperoom => (
            <Card key={escaperoom.id} sx={{ maxWidth: 345 }}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {escaperoom.name}
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


      {openEdit && idToEdit && (
        <div className='pop-overlayCreate' onClick={handleEditClose}>
          <div className='pop-contentCreate' onClick={(e) => e.stopPropagation()}>
            <EscapeRoomUpdate 
              id={idToEdit}
              onCancel={handleEditClose}
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default EscapeRoomList;