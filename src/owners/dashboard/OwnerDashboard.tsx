import React, { useEffect, useState } from 'react';
import { AuthService } from '../../auth/AuthService';
import { Owner } from '../../users/UserModel';
import { useNavigate, useLocation } from 'react-router-dom';
import  { Snackbar, Alert } from '@mui/material';
import './OwnerDashboard.css';
import EscapeRoomList from '../escaperooms/components/EscapeRoom.List';
import EscapeRoomCreate from '../escaperooms/components/EscapeRoom.Create';
import calendar from '../calendar/Calendar';


const OwnerDashboard: React.FC = () => {
  const [user, setUser] = useState<Owner | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<boolean>(false);
  const nav = useNavigate();
  const location = useLocation();
  const alertData = location.state?.alert || {};
  const [openAdd, setOpenAdd] = useState<boolean>(false)
  const [myseed, setMyseed] = useState<number>(0)


  useEffect(() => {
    if (alertData.type) {
      setOpen(true);
      window.history.replaceState({}, document.title);
    }

    if (!AuthService.isAuthenticated()) {
      nav('/login');
      return;
    }

    const currentUser = AuthService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const handleSnackbarClose = () => { setOpen(false); }
  const handlePopupClose = () => {
    setOpenAdd(false);
    setMyseed( Math.random());
  }

  if (loading) {
    return <div className="loading">Cargando datos de usuario...</div>;
  }

  if (!user) {
    return <div>No se encuentran datos de usuario. <a href="/login">Identifíquese de nuevo</a></div>;
  }

  return (
    <div className="dashboard-container contained">
      <header className="dashboard-header">
        <div className="user-info">
          <span>Bienvenido, <strong>{user.email}</strong></span>
        </div>
        <div className="actions">
          <button type="button" className='buttonLink' onClick={() => setOpenAdd(true)}>Añadir Nuevo Negocio</button>
        </div>
      </header>          
      <div className="dashboard-content">

        <EscapeRoomList key={myseed}/>

        <div className="debug-card">
          <h3>Debug</h3>
          <pre className="debug-info">
            {JSON.stringify(user, null, 2)}
          </pre>
          <p>Existe token: {AuthService.isAuthenticated() ? '✅ SI' : '❌ NO'}</p>
        </div>
      </div>

      {openAdd && (
        <div className='pop-overlayCreate' onClick={() => setOpenAdd(false)}>
            <div className='pop-contentCreate' onClick={(e) => e.stopPropagation()}>
                  <EscapeRoomCreate onCancel={handlePopupClose}/>
            </div>
      </div>
      )}

      <div>
        
      </div>

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
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
  );
};

export default OwnerDashboard;