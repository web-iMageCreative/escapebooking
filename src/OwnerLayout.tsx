import { Outlet } from 'react-router-dom';
import Navigation from './shared/navigation/Navigation';

const MainLayout = () => {
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
        </div>
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