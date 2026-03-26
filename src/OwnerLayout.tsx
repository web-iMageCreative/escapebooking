import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Navigation from './shared/navigation/Navigation';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const MainLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-wrap contained">
          <div className="branding">
            <div>Escape<span>Booking</span></div>
          </div>
          <div className="app-nav">
            <Navigation />
          </div>
          <button
            className="hamburger-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
          >
            <MenuIcon />
          </button>
        </div>

        {menuOpen && (
          <div
            className="mobile-menu-overlay"
            onClick={() => setMenuOpen(false)}
          >
            <div
              className="mobile-menu-panel"
              onClick={e => e.stopPropagation()}
            >
              <button
                className="mobile-menu-close"
                onClick={() => setMenuOpen(false)}
                aria-label="Cerrar menú"
              >
                <CloseIcon />
              </button>
              <Navigation onNavigate={() => setMenuOpen(false)} />
            </div>
          </div>
        )}

      </header>
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="app-footer">
        <p className="contained">© {new Date().getFullYear()} EscapeBooking. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MainLayout;