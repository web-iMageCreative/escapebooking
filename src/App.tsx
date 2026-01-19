import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './Router';
import Navigation from './shared/navigation/Navigation';
import './App.css';

function App() {
  return (
    <Router>
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
          <AppRouter />
        </main>
        <footer className="app-footer">
          <p className="contained">© {new Date().getFullYear()} EscapeBooking. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
