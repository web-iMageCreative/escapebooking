import React, { useState } from 'react';
import { AuthService } from '../AuthService';
import { LoginCredentials } from '../../users/UserModel';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Icon, Stack, TextField } from '@mui/material';
import LockPersonOutlinedIcon from '@mui/icons-material/LockPersonOutlined';
import NotchedContainer from '../../shared/components/CircularNotchedBox';

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await AuthService.login(credentials);

      if (res.success) {
        localStorage.setItem('auth_token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));

        if (res.data.user.role_name === 'owner') {
          nav('/owner/dashboard', { state: { alert: { type: 'info', message: 'Usuario identificado correctamente' } } });
        } else if (res.data.user.role_name === 'admin') {
          window.location.href = '/admin/dashboard';
        } else {
          window.location.href = '/customer/dashboard';
        }
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('Error de identificación. Por favor, inténtelo nuevamente.');
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

            <h2>Mi perfil</h2>

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

            <Button 
              type="submit"
              variant="contained"
              disabled={loading}
              color="primary"
              size="large"
            >
              {loading ? 'Identificando...' : 'Acceder'}
            </Button>

          </Stack>
        </Box>
      </Container>

      <div className="test-credentials">
        <h4>Cuentas de prueba:</h4>
        {/* <p><strong>Admin:</strong> admin@escapebooking.com / password</p> */}
        <p><strong>Owner:</strong> madrid@escaperooms.com / password</p>
        {/* <p><strong>Customer:</strong> juan.perez@gmail.com / password</p> */}
      </div>
    </>
  );
};

export default Login;