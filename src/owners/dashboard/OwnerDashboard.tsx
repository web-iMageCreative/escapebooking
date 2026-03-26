import React, { useEffect, useState } from 'react';
import { AuthService } from '../../auth/AuthService';
import { Owner } from '../../users/UserModel';
import { useNavigate, useLocation } from 'react-router-dom';
import  { Snackbar, Alert } from '@mui/material';
import './OwnerDashboard.css';
import EscapeRoomList from '../escaperooms/components/EscapeRoom.List';


const OwnerDashboard: React.FC = () => {
  const [user, setUser] = useState<Owner | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<boolean>(false);
  const nav = useNavigate();
  const location = useLocation();
  const [alertData, setAlertData] = useState<any>(location.state?.alert || {});

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
  
  if (loading) {
    return <div className="loading">Cargando datos de usuario...</div>;
  }

  if (!user) {
    return <div>No se encuentran datos de usuario. <a href="/login">Identifíquese de nuevo</a></div>;
  }

  return (
    <div className="dashboard-container contained">
      <div className="dashboard-content">
        <div className="info">
          <p className="user-info"><span>Bienvenido, <strong>{user.email}</strong></span></p>
          <p>
            En esta aplicación podrá gestionar sus locales de Escape Rooms.
            Cree sus negocios y defina sus salas de juego.
          </p>
          <p>
            A continuación puede ver sus negocios de Escape Rooms.
            Si aún no ha definido ninguno, haga clic en "Añadir nuevo negocio".
          </p>
        </div>

        <EscapeRoomList />

        <div className="debug-card">
          <h3>Debug</h3>
          <pre className="debug-info">
            {JSON.stringify(user, null, 2)}
          </pre>
          <p>Existe token: {AuthService.isAuthenticated() ? '✅ SI' : '❌ NO'}</p>
        </div>
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