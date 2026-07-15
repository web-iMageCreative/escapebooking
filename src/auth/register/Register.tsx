import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { RegisterCredentials } from '../../users/UserModel';
import { Alert, Box, Button, Container, Snackbar, Stack, TextField } from '@mui/material';
import LockPersonOutlinedIcon from '@mui/icons-material/LockPersonOutlined';
import NotchedContainer from '../../shared/components/CircularNotchedBox';
import { AuthService } from '../AuthService';
import { ROUTES } from '../../routes';

const Register: React.FC = () => {
  const [credentials, setCredentials] = useState<RegisterCredentials>({
    businessName: '',
    address: '',
    phone: '',
    city: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const location = useLocation();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState<boolean>(!!location.state?.alert);
  const [alertData, setAlertData] = useState<any>(location.state?.alert || {});

  const handleSnackbarClose = () => { setOpen(false); }

  const handlePasswordMismatch = () => {
    if (credentials.password && credentials.confirmPassword && credentials.password !== credentials.confirmPassword) {
      setAlertData({ type: 'error', message: 'Las contraseñas no coinciden' });
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
  
      try {
        const res = await AuthService.register(credentials);
  
        if (res.success) {
          localStorage.setItem('auth_token', res.data.token);
          localStorage.setItem('user', JSON.stringify(res.data.user));
  
          if (res.data.user.role_name === 'owner') {
            nav('/owner/dashboard', { state: { alert: { type: 'info', message: 'Usuario identificado. Bienvenido.' } } });
          } else if (res.data.user.role_name === 'admin') {
            window.location.href = '/admin/dashboard';
          } else {
            window.location.href = '/customer/dashboard';
          }
        } else {
          setAlertData({type: 'error', message: res.message});
          setOpen(true);
        }
      } catch (err) {
        setAlertData({type: 'error', message: 'Error de Registro. Por favor, inténtelo nuevamente. ERROR: ' + (err as Error).message});
        setOpen(true);
      } finally {
        setLoading(false);
      }
    };

  const passwordsMatch = !credentials.confirmPassword || credentials.password === credentials.confirmPassword;

  return (
    <>
      <Container maxWidth='xs' className="login-container">
        <Box style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: -70
        }}>
          <LockPersonOutlinedIcon sx={{
            fontSize: 30,
            width: 30,
            height: 30,
            bgcolor: 'primary.main',
            color: 'common.white',
            p: 2,
            borderRadius: '50%'
          }}
          />
        </Box>
        <NotchedContainer 
          width={80}
          cornerRadius={20}
          bgColor="#fff"
        />
        <Box
          component="form"
          onSubmit={handleSubmit}
          autoComplete={'off'}
          className="form-container"
          sx={{ 
            p: 4,
            bgcolor: '#FFF'
          }}
        >
          <Stack spacing={4}>
            <h2>Crear Cuenta</h2>

            <TextField
              sx={{ minWidth:"100%" }} 
              type="text"
              id="businessName" 
              label="Nombre de Empresa"
              variant="outlined" 
              value={credentials.businessName}
              onChange={(e) => setCredentials({
                ...credentials,
                businessName: e.target.value
              })}
              required
            />

            <TextField
              sx={{ minWidth:"100%" }} 
              type="text"
              id="address" 
              label="Dirección"
              variant="outlined" 
              value={credentials.address}
              onChange={(e) => setCredentials({
                ...credentials,
                address: e.target.value
              })}
              required
            />

            <TextField
              sx={{ minWidth:"100%" }} 
              type="text"
              id="city" 
              label="Ciudad"
              variant="outlined" 
              value={credentials.city}
              onChange={(e) => setCredentials({
                ...credentials,
                city: e.target.value
              })}
              required
            />

            <TextField
              sx={{ minWidth:"100%" }} 
              type="text"
              id="phone" 
              label="Teléfono"
              variant="outlined" 
              value={credentials.phone}
              onChange={(e) => setCredentials({
                ...credentials,
                phone: e.target.value
              })}
              required
            />

            <TextField
              sx={{ minWidth:"100%" }} 
              type="email"
              id="email" 
              label="E-mail"
              variant="outlined" 
              value={credentials.email}
              onChange={(e) => setCredentials({
                ...credentials,
                email: e.target.value
              })}
              required
            />

            <TextField
              sx={{ minWidth:"100%" }} 
              type="password"
              id="password" 
              label="Contraseña"
              variant="outlined" 
              value={credentials.password}
              onChange={(e) => setCredentials({
                ...credentials,
                password: e.target.value
              })}
              required
            />

            <TextField
              sx={{ minWidth:"100%" }} 
              type="password"
              id="confirmPassword" 
              label="Confirmar Contraseña"
              variant="outlined" 
              value={credentials.confirmPassword}
              onChange={(e) => setCredentials({ ...credentials, confirmPassword: e.target.value })}
              onBlur={handlePasswordMismatch}
              error={!passwordsMatch}
              helperText={!passwordsMatch ? 'Las contraseñas no coinciden' : ''}
              required
            />

            <Button 
              type="submit"
              variant="contained"
              disabled={loading}
              color="primary"
              size="large"
            >
              {loading ? 'Registrando...' : 'Registrar'}
            </Button>
          </Stack>
        </Box>
      </Container>

       <div className="register-link">
        <h2>¿Ya tienes cuenta?</h2>
        <div><Link to={ROUTES.LOGIN}>Inicia sesión</Link></div>
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

    </>
  );
};

export default Register;