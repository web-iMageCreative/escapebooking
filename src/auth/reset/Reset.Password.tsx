import React, { useState } from 'react';
import { AuthService } from '../AuthService';
import { Alert, Box, Button, Container, Snackbar, Stack, TextField } from '@mui/material';
import { ROUTES } from '../../routes';
import { Link } from 'react-router-dom';
import LockResetIcon from '@mui/icons-material/LockReset';
import NotchedContainer from '../../shared/components/CircularNotchedBox';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState<{ password: string }>({ password: '' });
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState<boolean>(false);
  const [alertData, setAlertData] = useState<any>({});
  const [confirmPassword, setConfirmPassword] = useState<{ confirmPassword: string }>({ confirmPassword: '' });
  const [passwordsMatch, setPasswordsMatch] = useState<boolean>(true);
  const token = window.location.pathname.split('/').pop(); // Get the token from the URL

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await AuthService.resetPassword(password.password, token!); 

      if (res.success) {
        setAlertData({type: 'success', message: res.message});
        setOpen(true);
      }
    } catch (error: any) {
      setAlertData({type: 'error', message: error.message || 'Error al restablecer la contraseña'});
      setOpen(true);
    } finally {
      setLoading(false);
    }
  }

  const handlePasswordMismatch = () => {
    if (password.password && confirmPassword.confirmPassword && password.password !== confirmPassword.confirmPassword) {
      setPasswordsMatch(false);
    } else {
      setPasswordsMatch(true);
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
          <LockResetIcon sx={{
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
          pos="middle"
          side="top"
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

            <h2>Solicitar cambio de contraseña</h2>

            <input type="hidden" name="token" value={token} />

            <TextField
              sx={{ minWidth:"100%" }} 
              type="password"
              id="password" 
              label="Contraseña"
              variant="outlined" 
              value={password.password}
              onChange={(e) => setPassword({
                ...password,
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
              value={confirmPassword.confirmPassword}
              onChange={(e) => setConfirmPassword({ ...confirmPassword , confirmPassword: e.target.value })}
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
              {loading ? 'Solicitando cambio...' : 'Cambiar contraseña'}
            </Button>

          </Stack>
        </Box>
      </Container>

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={open}
        autoHideDuration={5000}
        onClose={() => setOpen(false)}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity={alertData.type}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alertData.message}
        </Alert>
      </Snackbar>

      <div className="register-link">
        <div><Link to={ROUTES.LOGIN}>Volver al Login</Link></div>
      </div>
    </>
  );
};

export default ResetPassword;