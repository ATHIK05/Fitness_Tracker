import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StreakTracker = ({ user }) => {
    const [streak, setStreak] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user && user._id) {
            updateAndFetchStreak();
        }
        // eslint-disable-next-line
    }, [user]);

    const updateAndFetchStreak = async () => {
        setLoading(true);
        setError('');
        try {
            // Update streak (should be called on login/activity)
            await axios.post('/api/streak', { userId: user._id });
            // Fetch streak
            const res = await axios.get(`/api/streak/${user._id}`);
            setStreak(res.data);
        } catch (err) {
            setError('Failed to fetch streak.');
        }
        setLoading(false);
    };

    if (loading) return <div className="streak-tracker">Loading...</div>;
    if (error) return <div className="streak-tracker" style={{ color: 'crimson' }}>{error}</div>;
    if (!streak) return null;

    const currentStreak = streak.currentStreak || 0;
    const bestStreak = streak.longestStreak || 0;
    const history = streak.loginDates || [];

    let message = '';
    if (currentStreak === 0) {
        message = 'Start your streak today!';
    } else if (currentStreak < 3) {
        message = 'Keep going! Every day counts.';
    } else if (currentStreak < 7) {
        message = 'Great job! You are building a healthy habit.';
    } else {
        message = 'Amazing! You are on fire!';
    }

    return (
        <div className="streak-tracker">
            <h2>Streak Details</h2>
            <div style={{ margin: '12px 0', fontSize: '1.2rem', fontWeight: 600 }}>
                Current Streak: <span style={{ color: 'var(--color-streak)' }}>{currentStreak} days</span>
            </div>
            <div style={{ color: 'var(--color-muted)', marginBottom: 8 }}>
                Best Streak: <b>{bestStreak}</b> days
            </div>
            {history.length > 0 && (
                <div style={{ marginBottom: 8 }}>
                    <span style={{ color: 'var(--color-primary-dark)', fontWeight: 500 }}>Recent Activity:</span>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', gap: 6 }}>
                        {history.slice(-7).map((day, idx) => (
                            <li key={idx} style={{
                                width: 18, height: 18, borderRadius: '50%',
                                background: day ? 'var(--color-accent)' : '#e5e7eb',
                                display: 'inline-block',
                                border: '1px solid #d1d5db',
                                transition: 'background 0.3s'
                            }} title={day ? 'Active' : 'Missed'}></li>
                        ))}
                    </ul>
                </div>
            )}
            <div style={{ marginTop: 12, color: 'var(--color-accent)', fontWeight: 600 }}>{message}</div>
        </div>
    );
};

export default StreakTracker;