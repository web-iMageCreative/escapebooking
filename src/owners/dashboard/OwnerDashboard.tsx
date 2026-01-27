import React, { useEffect, useState } from 'react';
import { AuthService } from '../../auth/AuthService';
import { Owner } from '../../users/UserModel';
import { ROUTES } from '../../routes';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import  { Snackbar, Alert } from '@mui/material';
import './OwnerDashboard.css';


const OwnerDashboard: React.FC = () => {
  const [user, setUser] = useState<Owner | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<boolean>(false);
  const nav = useNavigate();
  const location = useLocation();
  const alertData = location.state?.alert || {};

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
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="user-info">
          <span>Bienvenido, <strong>{user.email}</strong></span>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="dashboard-card">
          <h3>Acciones rápidas</h3>
          <div className="actions">
            <Link to={ROUTES.OWNER_ESCAPE_ROOMS_CREATE}>Crear nuevo negocio</Link>
            <Link to={ROUTES.OWNER_ESCAPE_ROOMS}>Ver Escaperooms</Link>
          </div>
        </div>

        <div className="debug-card">
          <h3>Debug</h3>
          <pre className="debug-info">
            {JSON.stringify(user, null, 2)}
          </pre>
          <p>Existe token: {AuthService.isAuthenticated() ? '✅ SI' : '❌ NO'}</p>
        </div>
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
  );
};

export default OwnerDashboard;