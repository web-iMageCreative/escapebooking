import React, { useState } from 'react';
import { AuthService } from '../AuthService';
import { RegisterCredentials } from '../../users/UserModel';
import { useLocation, useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Container, Snackbar, Stack, TextField } from '@mui/material';
import LockPersonOutlinedIcon from '@mui/icons-material/LockPersonOutlined';
import NotchedContainer from '../../shared/components/CircularNotchedBox';
import Paypal from '../paypal/Paypal';

const Register: React.FC = () => {
  const [credentials, setCredentials] = useState<RegisterCredentials>({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const location = useLocation();
  const [alertData, setAlertData] = useState<any>( location.state?.alert || {} );

  const handleSnackbarClose = () => { setOpen(false); }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
        if (credentials.password !== credentials.confirmPassword) {
            setAlertData({ type: 'error', message: 'Las contraseñas no coinciden' });
            setOpen(true);
            setLoading(false);
            return;
            }

            const res = await AuthService.register(credentials);

            if (res.success) {
                localStorage.setItem('auth_token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                nav('/owner/dashboard', { state: { alert: { type: 'info', message: 'Cuenta creada correctamente.' } } });
            } else {
                setAlertData({ type: 'error', message: res.message });
                setOpen(true);
            }
        } catch (err) {
            setAlertData({ type: 'error', message: 'Error al registrarse. Por favor, inténtelo nuevamente.' });
            setOpen(true);
        } finally {
            setLoading(false);
        }
    };

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
          className="form-container"
          component="form"
          onSubmit={handleSubmit}
          sx={{ 
            p: 4,
            bgcolor: '#FFF'
          }}
          noValidate
          autoComplete="off"
        >
          <Stack spacing={4}>

            <h2>Crear Cuenta</h2>

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
              id="ConfirmPassword" 
              label="Confirmar Contraseña"
              variant="outlined" 
              value={credentials.confirmPassword}
              onChange={(e) => setCredentials({
                ...credentials,
                confirmPassword: e.target.value
              })}
              required
            />

            <Paypal />

            <Button 
              type="submit"
              variant="contained"
              disabled={loading}
              color="primary"
              size="large"
            >
              {loading ? 'Registrando...' : 'Registrarse'}
            </Button>

          </Stack>
        </Box>
      </Container>

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