import React, { useEffect, useState } from 'react';
import { AuthService } from '../../auth/AuthService';
import { User } from '../../users/UserModel';
import './Dashboard.css';
import { ROUTES } from '../../routes';
import { Link, useNavigate } from 'react-router-dom';


const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      window.location.href = '/login';
      return;
    }

    const currentUser = AuthService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    window.location.href = '/login';
  };

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
    </div>
  );
};

export default Dashboard;