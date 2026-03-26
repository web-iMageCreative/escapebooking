import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { EscapeRoomModel } from '../EscapeRoom.Model';
import { EscapeRoomService } from '../EscapeRoom.Service';
import { User } from '../../../users/UserModel';
import { AuthService } from '../../../auth/AuthService';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EscapeRoomUpdate from './EscapeRoom.Update';
import EscapeRoomCreate from './EscapeRoom.Create';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Card, CardActions, CardContent, Typography, Snackbar, Alert} from '@mui/material';

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
    fetchEscapeRooms();
    if (alertState.type) {
      showSnackbar(alertState.message, alertState.type);
      window.history.replaceState({}, document.title);
    }
  }, []);

  const fetchEscapeRooms = async () => {
    setLoading(true);
    try {
      const res = await EscapeRoomService.getEscaperooms(currentUser.id);
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
    fetchEscapeRooms();
  };

  const handleDelete = async () => {
    setDialogOpen(false);
    if (idToDelete !== 0) {
      const res = await EscapeRoomService.delete(idToDelete);
      if (res.success) {
        setIdToDelete(0);
        fetchEscapeRooms();
        showSnackbar(res.message, 'success');
      }
    }
  };

  const formatPhone = (num: string) => {
    let cleanNum = num.replace(/\s/g, '');
    let anyElse = cleanNum.startsWith('+');
    let pref = anyElse ? '+' : '';
    let nums = anyElse ? cleanNum.substring(1) : cleanNum;
    if (nums.length === 0) return num;
    
    let groups = [];
    for (let i = nums.length; i > 0; i -= 3) {
      groups.unshift(nums.substring(Math.max(0, i - 3), i));
    }
    return pref + groups.join(' ');
  };

  return (
    <div className='contained'>
      <h3>Mis Escape Rooms</h3>

      <div className="actions">
        <button type="button" className='buttonLink' onClick={() => setAddOpen(true)}>Añadir Nuevo Negocio</button>
      </div>

      {!loading && 
        <div className='list'>
          {data.map(escaperoom => (
            <Card key={escaperoom.id} sx={{ maxWidth: 345 }}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div" data-id={escaperoom.id} onClick={() => nav('/owner/escape-room/' + escaperoom.id)}>
                  <span className='card-title'>{escaperoom.name}</span>
                </Typography>
                <p>{escaperoom.cif}<br />{escaperoom.email} · {formatPhone(escaperoom.phone)}<br />{escaperoom.address} {escaperoom.postal_code}</p>
              </CardContent>
              <CardActions>
                <Button startIcon={<ArticleOutlinedIcon />} size="small" onClick={() => nav('/owner/escape-room/' + escaperoom.id)}>Ver</Button>
                <Button startIcon={<EditOutlinedIcon />} size="small" onClick={() => { setEditId(escaperoom.id); }}>Editar</Button>
                <Button startIcon={<DeleteOutlineOutlinedIcon />} size="small" onClick={() => { setIdToDelete(escaperoom.id); setDialogOpen(true); }} color="error">Eliminar</Button>
              </CardActions>
            </Card>
          ))}
        </div>
      }

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