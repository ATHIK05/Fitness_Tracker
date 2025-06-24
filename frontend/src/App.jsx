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

  return (
    <Router>
      <header>
        <span style={{ fontWeight: 700, fontSize: '1.5rem', letterSpacing: '1px' }}>
          <span role="img" aria-label="dumbbell">🏋️‍♂️</span> FitTrack Pro
        </span>
      </header>

      <nav>
        <div>
          <Link to="/">Dashboard</Link>
          {user && <Link to="/profile">Profile</Link>}
          {user && <Link to="/progress">Progress</Link>}
          {user && <Link to="/goals">Goals</Link>}
        </div>
        <div>
          {!user ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
            </>
          ) : (
            <>
              <span style={{ color: 'var(--color-muted)', fontWeight: 500, marginRight: 16 }}>
                Welcome, {user.email}
              </span>
              <Link to="/profile" style={{ marginRight: 8, color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500 }}>Profile</Link>
              <button
                onClick={handleLogout}
                style={{
                  background: 'var(--color-primary)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '8px 18px',
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: 'pointer',
                  marginLeft: 8,
                  transition: 'background 0.2s',
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
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
