import React, { useEffect, useState } from 'react';
import { AuthService } from '../../auth/AuthService';
import { User } from '../../users/UserModel';
import './Dashboard.css';

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
          <span className="role-badge">{user.role_name}</span>
          <button onClick={handleLogout} className="logout-btn">
            Salir
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="dashboard-card">
          <h3>Información del Usuario</h3>
          <div className="user-details">
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Rol:</strong> {user.role_name}</p>
            <p><strong>Activo:</strong> {user.is_active ? '✅ Yes' : '❌ No'}</p>
            <p><strong>Miembro desde:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Acciones rápidas</h3>
          <div className="actions">

            {user.role_name === 'owner' && (
              <>
                <button className="action-btn">Mis EscapeRooms</button>
                <button className="action-btn">Añadir nueva Sala</button>
                <button className="action-btn">Ver Reservas</button>
              </>
            )}
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