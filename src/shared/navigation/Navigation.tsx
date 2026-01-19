import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthService } from '../../auth/AuthService';
import { ROUTES } from '../../routes';

const Navigation: React.FC = () => {
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
                        <Link to={ROUTES.OWNER_DASHBOARD}>Dashboard</Link>
                        
                        {user?.role_name === 'admin' && (
                            <>
                                <a href="#">Lorem</a>
                            </>
                        )}
                        
                        {user?.role_name === 'owner' && (
                            <>
                                <a href="#">Lorem</a>
                                <a href="#">Ipsum</a>
                                <a href="#">Dolor</a>
                            </>
                        )}
                        
                        {user?.role_name === 'customer' && (
                            <>
                                <a href="#">Ipsum</a>
                            </>
                        )}
                        
                        <button onClick={handleLogout} className="logout-btn">
                            Logout ({user?.email})
                        </button>
                    </>
                ) : (
                    <Link to={ROUTES.LOGIN}>Login</Link>
                )}
            </div>
        </nav>
    );
};

export default Navigation;