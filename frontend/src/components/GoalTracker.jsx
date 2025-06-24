import React, { useEffect, useState } from 'react';
import axios from 'axios';

const typeOptions = [
  { value: 'workout', label: 'Workout (minutes)', icon: '🏋️‍♂️', color: '#2563eb' },
  { value: 'walk', label: 'Walk (km)', icon: '🚶‍♂️', color: '#22c55e' },
  { value: 'food', label: 'Calories', icon: '🍎', color: '#f59e42' },
  { value: 'custom', label: 'Custom', icon: '🎯', color: '#a855f7' }
];

const getTypeMeta = (type) => typeOptions.find(opt => opt.value === type) || typeOptions[3];

const GoalTracker = ({ user }) => {
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState({ type: 'workout', target: '', unit: '', endDate: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const logoutAndRedirect = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const fetchGoals = async (isMounted = true) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`/api/goals/${user._id}`);
      if (isMounted) setGoals(res.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        logoutAndRedirect();
        return;
      }
      if (isMounted) setError('Failed to fetch goals.');
    }
    if (isMounted) setLoading(false);
  };

  useEffect(() => {
    let isMounted = true;
    if (user && user._id) fetchGoals(isMounted);
    return () => { isMounted = false; };
    // eslint-disable-next-line
  }, [user]);

  const handleFormChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddGoal = async e => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const payload = {
        ...form,
        userId: user._id,
        target: Number(form.target),
        unit: form.unit || (form.type === 'workout' ? 'min' : form.type === 'walk' ? 'km' : form.type === 'food' ? 'kcal' : ''),
      };
      await axios.post('/api/goals', payload);
      setForm({ type: 'workout', target: '', unit: '', endDate: '', description: '' });
      setMessage('Goal added!');
      fetchGoals();
    } catch (err) {
      if (err.response && err.response.status === 404) {
        logoutAndRedirect();
        return;
      }
      setError('Failed to add goal.');
    }
  };

  const handleDelete = async goalId => {
    setError('');
    try {
      await axios.delete(`/api/goals/${goalId}`);
      fetchGoals();
    } catch (err) {
      if (err.response && err.response.status === 404) {
        logoutAndRedirect();
        return;
      }
      setError('Failed to delete goal.');
    }
  };

  const handleMarkComplete = async goal => {
    setError('');
    try {
      await axios.patch(`/api/goals/${goal._id}`, { status: 'completed' });
      fetchGoals();
    } catch (err) {
      if (err.response && err.response.status === 404) {
        logoutAndRedirect();
        return;
      }
      setError('Failed to update goal.');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: 40 }}>Loading goals...</div>;

  return (
    <div className="container" style={{ maxWidth: 900, margin: '40px auto' }}>
      <h2 style={{ marginBottom: 24, textAlign: 'center', letterSpacing: 1 }}>🎯 Your Fitness Goals</h2>
      <div className="card" style={{ marginBottom: 32, boxShadow: '0 4px 24px rgba(34,197,94,0.08)' }}>
        <h3 style={{ marginBottom: 18, color: '#2563eb' }}>Add New Goal</h3>
        <form onSubmit={handleAddGoal} style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
          <select name="type" value={form.type} onChange={handleFormChange} style={{ padding: 10, borderRadius: 8, border: '1.5px solid #e5e7eb', fontWeight: 500, minWidth: 140 }}>
            {typeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.icon} {opt.label}</option>)}
          </select>
          <input name="target" type="number" placeholder="Target" value={form.target} onChange={handleFormChange} required style={{ padding: 10, borderRadius: 8, border: '1.5px solid #e5e7eb', width: 100 }} />
          {form.type === 'custom' && (
            <input name="unit" placeholder="Unit" value={form.unit} onChange={handleFormChange} style={{ padding: 10, borderRadius: 8, border: '1.5px solid #e5e7eb', width: 90 }} />
          )}
          <input name="endDate" type="date" value={form.endDate} onChange={handleFormChange} style={{ padding: 10, borderRadius: 8, border: '1.5px solid #e5e7eb' }} />
          <input name="description" placeholder="Description (optional)" value={form.description} onChange={handleFormChange} style={{ padding: 10, borderRadius: 8, border: '1.5px solid #e5e7eb', minWidth: 180, flex: 1 }} />
          <button type="submit" className="button" style={{ padding: '10px 24px', fontWeight: 600, fontSize: 16 }}>Add Goal</button>
        </form>
        {message && <div style={{ color: 'var(--color-accent)', marginTop: 10, textAlign: 'center' }}>{message}</div>}
        {error && <div style={{ color: 'crimson', marginTop: 10, textAlign: 'center' }}>{error}</div>}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28 }}>
        {goals.length === 0 && <div className="card" style={{ color: 'var(--color-muted)', textAlign: 'center' }}>No goals set yet.</div>}
        {goals.map(goal => {
          const meta = getTypeMeta(goal.type);
          const progress = Math.min((goal.current / goal.target) * 100, 100);
          return (
            <div
              key={goal._id}
              className="card"
              style={{
                borderLeft: `6px solid ${meta.color}`,
                boxShadow: '0 2px 16px rgba(30,41,59,0.07)',
                marginBottom: 0,
                transition: 'box-shadow 0.2s',
                position: 'relative',
                overflow: 'hidden',
                minHeight: 170,
                background: goal.status === 'completed' ? 'linear-gradient(90deg, #e0ffe7 0%, #f0fdf4 100%)' : undefined
              }}
              onMouseOver={e => e.currentTarget.style.boxShadow = '0 8px 32px rgba(34,197,94,0.13)'}
              onMouseOut={e => e.currentTarget.style.boxShadow = '0 2px 16px rgba(30,41,59,0.07)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
                <span style={{ fontSize: 32 }}>{meta.icon}</span>
                <div style={{ fontWeight: 700, fontSize: 18, color: meta.color }}>{meta.label}</div>
                {goal.status === 'completed' && <span style={{ color: '#22c55e', fontWeight: 600, marginLeft: 10 }}>✔ Completed</span>}
              </div>
              <div style={{ fontSize: 15, marginBottom: 6 }}>
                <b>Target:</b> {goal.target} {goal.unit}
                {goal.endDate && <span style={{ color: '#2563eb', marginLeft: 10 }}>by {new Date(goal.endDate).toLocaleDateString()}</span>}
              </div>
              {goal.description && <div style={{ color: '#64748b', fontSize: 14, marginBottom: 6 }}>{goal.description}</div>}
              <div style={{ margin: '10px 0 6px 0' }}>
                <div style={{ height: 12, background: '#e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
                  <div style={{ width: `${progress}%`, background: meta.color, height: '100%', borderRadius: 8, transition: 'width 0.4s' }}></div>
                </div>
                <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>Progress: {goal.current} / {goal.target} {goal.unit}</span>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                {goal.status === 'active' && <button className="button" style={{ background: '#22c55e', color: '#fff', fontWeight: 600 }} onClick={() => handleMarkComplete(goal)}>Mark Complete</button>}
                <button className="button" style={{ background: '#e5e7eb', color: '#222', fontWeight: 600 }} onClick={() => handleDelete(goal._id)}>Delete</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GoalTracker; 