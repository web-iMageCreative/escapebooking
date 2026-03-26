import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthService } from '../../auth/AuthService';
import { ROUTES } from '../../routes';
import './Navigation.css'

interface NavigationProps {
  onNavigate?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onNavigate }) => {
    const navigate = useNavigate();
    const user = AuthService.getCurrentUser();
    
    const handleLogout = () => {
        AuthService.logout();
        navigate(ROUTES.LOGIN);
    };
    
    return (
        <nav className="navigation">            
            <div className="nav-links">
                {AuthService.isAuthenticated() ? (
                    <>
                        <Link to={ROUTES.OWNER_DASHBOARD} onClick={onNavigate} >Dashboard</Link>
                        
                        {user?.role_name === 'admin' && (
                            <>
                                <a href="#">Lorem</a>
                            </>
                        )}
                        
                        {user?.role_name === 'owner' && (
                            <>
                                <Link to={ROUTES.OWNER_BOOKINGS} onClick={onNavigate} >Reservas</Link>
                                <Link to={ROUTES.OWNER_ESCAPE_ROOMS} onClick={onNavigate} >EscapeRooms</Link>
                            </>
                        )}
                        
                        {user?.role_name === 'customer' && (
                            <>
                                <a href="#">Ipsum</a>
                            </>
                        )}
                        
                        <button onClick={handleLogout} className="logout-btn">
                            Salir
                        </button>
                    </>
                ) : (
                    <Link to={ROUTES.LOGIN} onClick={onNavigate} >Login</Link>
                )}
            </div>
        </nav>
    );
};

export default Navigation;