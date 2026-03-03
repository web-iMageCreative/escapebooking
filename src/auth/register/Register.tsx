import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { RegisterCredentials } from '../../users/UserModel';
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
  const location = useLocation();
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
              onChange={(e) => setCredentials({ ...credentials, confirmPassword: e.target.value })}
              onBlur={handlePasswordMismatch}
              error={!passwordsMatch}
              helperText={!passwordsMatch ? 'Las contraseñas no coinciden' : ''}
              required
            />

            <Paypal credentials={credentials} />
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