import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { EscapeRoomModel } from '../EscapeRoom.Model';
import { EscapeRoomService } from '../EscapeRoom.Service';
import { User } from '../../../users/UserModel';
import { AuthService } from '../../../auth/AuthService';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Card, CardActions, CardContent, Typography, Snackbar, Alert, Fab} from '@mui/material';
import Helper from '../../../shared/components/Helpers';
import EscapeRoomUpdate from './EscapeRoom.Update';
import EscapeRoomCreate from './EscapeRoom.Create';
import NotchedContainer from '../../../shared/components/CircularNotchedBox';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import AddIcon from '@mui/icons-material/Add';

const EscapeRoomList: React.FC = () => {
  const [data, setData] = useState<EscapeRoomModel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', type: 'info' as 'success' | 'error' | 'info' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number>(0);
  const [editId, setEditId] = useState<number | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  
  const currentUser: User = AuthService.getCurrentUser();
  const nav = useNavigate();
  const location = useLocation();
  const alertState = location.state?.alert || {};

  useEffect(() => {
    getEscapeRooms();
    if (alertState.type) {
      showSnackbar(alertState.message, alertState.type);
      window.history.replaceState({}, document.title);
    }
  }, []);

  const getEscapeRooms = async () => {
    setLoading(true);
    //console.log('currentUser: ', currentUser);

    try {
      const res = await EscapeRoomService.getEscaperooms(currentUser.id);

      if (!res.success) {
        showSnackbar(res.message, 'info' );
      }

      setData(Array.isArray(res.data) ? res.data : []);
    } catch(err: any) {
      showSnackbar(err?.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, type: 'success' | 'error' | 'info') => {
    setSnackbar({ open: true, message, type });
  };

  const handleModalClose = (type: 'edit' | 'add', canceled: boolean = true) => {
    if (canceled) showSnackbar(`${type === 'edit' ? 'Edición' : 'Creación'} cancelada`, 'info');

    if (type === 'edit') setEditId(null);
    else setAddOpen(false);
  };

  const handleModalSuccess = (type: 'edit' | 'add') => {
    showSnackbar(`Escaperoom ${type === 'edit' ? 'modificado' : 'creado'} correctamente`, 'success');

    if (type === 'edit') setEditId(null);
    else setAddOpen(false);

    getEscapeRooms();
  };

  const handleDelete = async () => {
    setDialogOpen(false);

    if (idToDelete !== 0) {
      const res = await EscapeRoomService.delete(idToDelete);

      if (res.success) {
        setIdToDelete(0);
        getEscapeRooms();
        showSnackbar(res.message, 'success');
      }
    }
  };

  return (
    <div className='escaperoom-list contained'>

      <div className="info">
        <p>
          A continuación puede ver sus negocios de Escaperooms.
          Si aún no ha definido ninguno, haga clic en el botón flotante "+".
        </p>
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
          <div className='title' style={{ width: 'calc(80%)'}}><h3>Mis Escaperooms</h3></div>
          <div className="actions">
            <Fab color="primary" aria-label="add" sx={{width: '50px', height: '50px'}}  onClick={() => setAddOpen(true)}>
              <AddIcon />
            </Fab>
          </div>
          <div style={{ width: 'calc(20%)' }}></div>
        </header>

        <div className='list'>
        {!loading && data.length > 0 &&
            data.map(escaperoom => (
              <>
              <Card key={escaperoom.id} elevation={5}>
                <CardContent>
                  <Typography gutterBottom variant="subtitle2" component="div" data-id={escaperoom.id} onClick={() => nav('/owner/escape-room/' + escaperoom.id)}>
                    <span className='card-title'>{escaperoom.name}</span>
                  </Typography>
                  <p>
                    <EmailOutlinedIcon sx={{color: '#888', fontSize: '16px', verticalAlign: 'middle'}} /> {escaperoom.email}<br />
                    <LocalPhoneOutlinedIcon sx={{color: '#888', fontSize: '16px', verticalAlign: 'middle'}} /> { Helper.formatPhone(escaperoom.phone)}<br />
                    <LocationOnOutlinedIcon sx={{color: '#888', fontSize: '16px', verticalAlign: 'middle'}} /> {escaperoom.address} {escaperoom.postal_code}
                  </p>
                </CardContent>
                <CardActions>
                  <Button startIcon={<ArticleOutlinedIcon />} size="small" onClick={() => nav('/owner/escape-room/' + escaperoom.id)}>Ver</Button>
                  <Button startIcon={<EditOutlinedIcon />} size="small" onClick={() => { setEditId(escaperoom.id); }}>Editar</Button>
                  <Button startIcon={<DeleteOutlineOutlinedIcon />} size="small" onClick={() => { setIdToDelete(escaperoom.id); setDialogOpen(true); }} color="error">Eliminar</Button>
                </CardActions>
              </Card>
              </>
            ))}
          </div>
      </div>

      {addOpen && (
        <div className='pop-overlayCreate' onClick={() => handleModalClose('add')}>
          <div className='pop-contentCreate' style={{backgroundColor: '#f4f4f4'}} onClick={(e) => e.stopPropagation()}>
            <EscapeRoomCreate onCancel={() => handleModalClose('add')} onSuccess={() => handleModalSuccess('add')}/>
          </div>
        </div>
      )}

      {editId && (
        <div className='pop-overlayCreate' onClick={() => handleModalClose('edit')}>
          <div className='pop-contentCreate' onClick={(e) => e.stopPropagation()}>
            <EscapeRoomUpdate id={editId} onCancel={() => handleModalClose('edit')} onSuccess={() => handleModalSuccess('edit')} />
          </div>
        </div>
      )}

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} severity={snackbar.type} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} aria-labelledby="delete-dialog-title" aria-describedby="delete-dialog-description">
        <DialogTitle id="delete-dialog-title">Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Estás apunto de <strong>eliminar</strong> este Escape Room y todos sus horarios y reservas. ¿Estás seguro?. Esta decisión no puede deshacerse.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleDelete} color="error" autoFocus>Eliminar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EscapeRoomList;