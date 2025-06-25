import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://fitness-tracker-sfug.vercel.app';

const getLast7Days = () => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
};

const Progress = ({ user }) => {
  const [workouts, setWorkouts] = useState([]);
  const [food, setFood] = useState([]);
  const [walks, setWalks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const days = getLast7Days();

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError('');
      try {
        const [wRes, fRes, walkRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/workouts/${user._id}`),
          axios.get(`${API_BASE_URL}/api/food/${user._id}`),
          axios.get(`${API_BASE_URL}/api/walks/${user._id}`)
        ]);
        setWorkouts(wRes.data);
        setFood(fRes.data);
        setWalks([{ date: days[days.length-1], distanceWalked: walkRes.data.distanceWalked }]); // Only today's walk
      } catch (err) {
        setError('Failed to fetch progress data.');
      }
      setLoading(false);
    };
    if (user && user._id) fetchAll();
    // eslint-disable-next-line
  }, [user]);

  // Prepare data for charts
  const workoutData = days.map(day =>
    workouts.filter(w => w.date && w.date.startsWith(day)).reduce((sum, w) => sum + (w.duration || 0), 0)
  );
  const foodData = days.map(day =>
    food.filter(f => f.intakeDate && f.intakeDate.startsWith(day)).reduce((sum, f) => sum + (f.calories || 0), 0)
  );
  // For walks, only today's distance is available in this model
  const walkData = days.map((day, idx) => idx === days.length-1 ? (walks[0]?.distanceWalked || 0) : 0);

  if (loading) return <div style={{ textAlign: 'center', marginTop: 40 }}>Loading progress...</div>;

  return (
    <div className="container" style={{ maxWidth: 900, margin: '40px auto' }}>
      <h2 style={{ marginBottom: 24 }}>Progress & History</h2>
      {error && <div style={{ color: 'crimson', marginBottom: 16 }}>{error}</div>}
      <div className="card" style={{ marginBottom: 32 }}>
        <h3>Workouts (minutes per day)</h3>
        <Line
          data={{
            labels: days.map(d => d.slice(5)),
            datasets: [{
              label: 'Workout Duration',
              data: workoutData,
              borderColor: '#2563eb',
              backgroundColor: 'rgba(37,99,235,0.1)',
              tension: 0.3,
              fill: true
            }]
          }}
          options={{ responsive: true, plugins: { legend: { display: false } } }}
        />
      </div>
      <div className="card" style={{ marginBottom: 32 }}>
        <h3>Calories Consumed (per day)</h3>
        <Line
          data={{
            labels: days.map(d => d.slice(5)),
            datasets: [{
              label: 'Calories',
              data: foodData,
              borderColor: '#22c55e',
              backgroundColor: 'rgba(34,197,94,0.1)',
              tension: 0.3,
              fill: true
            }]
          }}
          options={{ responsive: true, plugins: { legend: { display: false } } }}
        />
      </div>
      <div className="card">
        <h3>Walk Distance (km, today)</h3>
        <Line
          data={{
            labels: days.map(d => d.slice(5)),
            datasets: [{
              label: 'Distance Walked',
              data: walkData,
              borderColor: '#f59e42',
              backgroundColor: 'rgba(245,158,66,0.1)',
              tension: 0.3,
              fill: true
            }]
          }}
          options={{ responsive: true, plugins: { legend: { display: false } } }}
        />
      </div>
    </div>
  );
};

export default Progress; 