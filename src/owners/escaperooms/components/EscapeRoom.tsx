import React, { useEffect, useState } from 'react';
import { EscapeRoomModel } from '../EscapeRoom.Model';
import { EscapeRoomService } from '../EscapeRoom.Service';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Helper from '../../../shared/components/Helpers';
import RoomList from '../../rooms/components/Room.List';
import { Alert, Fab, Snackbar } from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const EscapeRoom: React.FC = () => {
  const params = useParams();
  const id: number = parseInt(params.id!);
  const location = useLocation();
  const nav = useNavigate();
  const alertData = location.state?.alert || {};
  const [snackbar, setSnackbar] = useState({ open: false, message: '', type: 'info' as 'success' | 'error' | 'info' });
  const [escapeRoom, setEscapeRoom] = useState<EscapeRoomModel>({
    id: 0,
    name: '',
    owner: 0,
    address: '',
    postal_code: '',
    cif: '',
    email: '',
    phone: ''
  });


  useEffect(() => {
    if (alertData.type) {
      showSnackbar(alertData.message, alertData.type);
      window.history.replaceState({}, document.title);
    }

    getEscaperoom();
  }, []);

  const getEscaperoom = async () => {
    try {
      const res = await EscapeRoomService.getEscaperoom(id);

      if (!res.success) {
        showSnackbar(res.message, 'error');
        return;
      }

      setEscapeRoom(res.data);
    } catch(err: any) {
      nav('/owner/dashboard/', { state: { alert: { message: err.message, type: 'error' } } });
    } finally {
      return;
    }
  }

  const showSnackbar = (message: string, type: 'success' | 'error' | 'info') => {
    setSnackbar({ open: true, message, type });
  };

  return (
    <div className='escaperoom contained'>
      <div className='escaperoom-content'>
        <div className="info">
          <div className="title">
            <Fab aria-label="add" sx={{width: '36px', height: '36px', fontSize: '12px', backgroundColor: 'white'}}  onClick={() =>nav('/owner/escape-rooms')}>
              <ArrowBackIosNewIcon />
            </Fab>
            <h2>{escapeRoom.name}</h2>
          </div>
          <div className="escaperoom-data">
            <p>CIF: {escapeRoom.cif}</p>
            <p><EmailOutlinedIcon sx={{ color: '#888', fontSize: '16px', verticalAlign: 'middle' }} /> {escapeRoom.email}</p>
            <p><LocalPhoneOutlinedIcon sx={{ color: '#888', fontSize: '16px', verticalAlign: 'middle' }} /> { Helper.formatPhone(escapeRoom.phone)}</p>
            <p><LocationOnOutlinedIcon sx={{ color: '#888', fontSize: '16px', verticalAlign: 'middle' }} /> {escapeRoom.address} {escapeRoom.postal_code}</p>
          </div>
        </div>
      </div>

      {escapeRoom &&
        <RoomList id={params.id} escapeRoomName={escapeRoom.name} />
      }

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
      
    </div>
  );
}

export default EscapeRoom;