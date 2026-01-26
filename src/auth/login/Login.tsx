import React, { useState } from 'react';
import { AuthService } from '../AuthService';
import { LoginCredentials } from '../../users/UserModel';
import './Login.css';
import { useNavigate } from 'react-router-dom';

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
    <div className="login-container">
      <form className="login-form contained" onSubmit={handleSubmit}>
        <h2>Acceso</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label>E-mail</label>
          <input
            type="email"
            value={credentials.email}
            onChange={(e) => setCredentials({
              ...credentials,
              email: e.target.value
            })}
            placeholder="admin@escapebooking.com"
            required
          />
        </div>

        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({
              ...credentials,
              password: e.target.value
            })}
            placeholder="password"
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Identificando...' : 'Acceder'}
          </button>
        </div>

        <div className="test-credentials">
          <h4>Cuentas de prueba:</h4>
          {/* <p><strong>Admin:</strong> admin@escapebooking.com / password</p> */}
          <p><strong>Owner:</strong> madrid@escaperooms.com / password</p>
          {/* <p><strong>Customer:</strong> juan.perez@gmail.com / password</p> */}
        </div>
      </form>
    </div>
  );
};

export default Login;