import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Signup from './components/Signup';
import Login from './components/Login';
import Profile from './components/Profile';
import Progress from './components/Progress';
import GoalTracker from './components/GoalTracker';
import './styles/main.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  // Persist user in localStorage
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  // Keep user logged in unless they log out
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Logout handler
  const handleLogout = () => {
    setUser(null);
  };

  const [navOpen, setNavOpen] = useState(false);
  const handleNavToggle = () => setNavOpen(open => !open);
  const handleNavLinkClick = () => setNavOpen(false);

  // Close nav on route change (optional, for better UX)
  useEffect(() => {
    const closeNav = () => setNavOpen(false);
    window.addEventListener('resize', closeNav);
    return () => window.removeEventListener('resize', closeNav);
  }, []);

  return (
    <Router>
      <header>
        <span style={{ fontWeight: 700, fontSize: '1.5rem', letterSpacing: '1px' }}>
          <span role="img" aria-label="dumbbell">🏋️‍♂️</span> FitTrack Pro
        </span>
      </header>

      <nav className={navOpen ? 'nav-mobile-open' : ''}>
        <button className="nav-toggle" aria-label="Toggle navigation" onClick={handleNavToggle}>
          <span className="nav-hamburger"></span>
        </button>
        <div className={`nav-links${navOpen ? ' show' : ''}`}>
          <Link to="/" onClick={handleNavLinkClick}>Dashboard</Link>
          {user && <Link to="/profile" onClick={handleNavLinkClick}>Profile</Link>}
          {user && <Link to="/progress" onClick={handleNavLinkClick}>Progress</Link>}
          {user && <Link to="/goals" onClick={handleNavLinkClick}>Goals</Link>}
        </div>
        {user && (
          <div className={`nav-user${navOpen ? ' show' : ''}`} style={{ width: '100%' }}>
            <div style={{ color: 'var(--color-muted)', fontWeight: 500, margin: '12px 0 8px 0', textAlign: 'center' }}>
              Welcome, {user.email}
            </div>
            <button
              onClick={() => { handleLogout(); handleNavLinkClick(); }}
              style={{
                background: 'var(--color-primary)',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '10px 0',
                fontWeight: 600,
                fontSize: 16,
                cursor: 'pointer',
                width: '90%',
                margin: '0 auto 10px auto',
                display: 'block',
                transition: 'background 0.2s',
              }}
            >
              Logout
            </button>
          </div>
        )}
        {!user && (
          <div className={`nav-auth${navOpen ? ' show' : ''}`}>
            <Link to="/login" onClick={handleNavLinkClick}>Login</Link>
            <Link to="/signup" onClick={handleNavLinkClick}>Sign Up</Link>
          </div>
        )}
      </nav>

      <div style={{ minHeight: 'calc(100vh - 160px)' }}>
        <Switch>
          <Route
            path="/profile"
            render={() =>
              user ? <Profile user={user} /> : <Redirect to="/login" />
            }
          />
          <Route path="/signup" component={Signup} />
          <Route
            path="/login"
            render={() =>
              user ? <Redirect to="/" /> : <Login onLogin={setUser} />
            }
          />
          <Route
            path="/progress"
            render={() =>
              user ? <Progress user={user} /> : <Redirect to="/login" />
            }
          />
          <Route
            path="/goals"
            render={() =>
              user ? <GoalTracker user={user} /> : <Redirect to="/login" />
            }
          />
          <Route
            exact
            path="/"
            render={() =>
              user ? <Dashboard user={user} /> : <Redirect to="/login" />
            }
          />
        </Switch>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <footer className="footer">
        &copy; {new Date().getFullYear()} FitTrack Pro &mdash; Your Fitness Journey, Upgraded
      </footer>
    </Router>
  );
};

export default App;
