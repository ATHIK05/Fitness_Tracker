import React, { useState, useEffect } from 'react';
import axios from 'axios';

const workoutIcons = {
    Running: '🏃‍♂️',
    Cycling: '🚴‍♂️',
    Swimming: '🏊‍♂️',
    Yoga: '🧘‍♂️',
    Gym: '🏋️‍♂️',
    Other: '💪',
};

const WorkoutTracker = ({ user }) => {
    const [workouts, setWorkouts] = useState([]);
    const [workoutType, setWorkoutType] = useState('Running');
    const [duration, setDuration] = useState('');
    const [caloriesBurned, setCaloriesBurned] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user && user._id) {
            fetchWorkouts();
        }
        // eslint-disable-next-line
    }, [user]);

    const fetchWorkouts = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.get(`/api/workouts/${user._id}`);
            setWorkouts(res.data);
        } catch (err) {
            setError('Failed to fetch workouts.');
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        try {
            await axios.post('/api/workouts', {
                userId: user._id,
                workoutType,
                duration: Number(duration),
                caloriesBurned: Number(caloriesBurned)
            });
            setMessage('Workout added!');
            setWorkoutType('Running');
            setDuration('');
            setCaloriesBurned('');
            fetchWorkouts();
        } catch (err) {
            setError('Failed to add workout.');
        }
        setLoading(false);
    };

    // Summary
    const totalWorkouts = workouts.length;
    const totalCalories = workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);

    return (
        <div className="workout-tracker">
            <h2>Workout Tracker</h2>
            <div style={{ marginBottom: 12, color: 'var(--color-muted)' }}>
                <span style={{ marginRight: 16 }}>Total: <b>{totalWorkouts}</b> sessions</span>
                <span>Total Calories: <b>{totalCalories}</b></span>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                <select value={workoutType} onChange={e => setWorkoutType(e.target.value)} style={{ flex: 1, padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}>
                    {Object.keys(workoutIcons).map(type => (
                        <option key={type} value={type}>{workoutIcons[type]} {type}</option>
                    ))}
                </select>
                <input
                    type="number"
                    placeholder="Duration (min)"
                    value={duration}
                    onChange={e => setDuration(e.target.value)}
                    style={{ flex: 1, padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                    required
                />
                <input
                    type="number"
                    placeholder="Calories Burned"
                    value={caloriesBurned}
                    onChange={e => setCaloriesBurned(e.target.value)}
                    style={{ flex: 1, padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                    required
                />
                <button type="submit" className="button" disabled={loading}>Add Workout</button>
            </form>
            {message && <div style={{ color: 'var(--color-accent)', marginBottom: 8 }}>{message}</div>}
            {error && <div style={{ color: 'crimson', marginBottom: 8 }}>{error}</div>}
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <h3 style={{ margin: '16px 0 8px 0', color: 'var(--color-primary-dark)' }}>Recent Workouts</h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {workouts.length === 0 && <li style={{ color: 'var(--color-muted)' }}>No workouts logged yet.</li>}
                        {workouts.map((workout, index) => (
                            <li key={workout._id || index} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                                <span style={{ fontSize: '1.5rem', marginRight: 10 }}>{workoutIcons[workout.workoutType] || workoutIcons.Other}</span>
                                <span style={{ fontWeight: 500 }}>{workout.workoutType}</span>
                                <span style={{ margin: '0 8px', color: 'var(--color-muted)' }}>•</span>
                                <span>{workout.duration} min</span>
                                <span style={{ margin: '0 8px', color: 'var(--color-muted)' }}>•</span>
                                <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>{workout.caloriesBurned} kcal</span>
                                <span style={{ marginLeft: 8, color: '#888', fontSize: 13 }}>{workout.date ? new Date(workout.date).toLocaleDateString() : ''}</span>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default WorkoutTracker;