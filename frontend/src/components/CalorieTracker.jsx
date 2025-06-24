import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DAILY_GOAL = 2000;

const CalorieTracker = ({ user }) => {
    const [caloriesConsumed, setCaloriesConsumed] = useState(0);
    const [inputCalories, setInputCalories] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user && user._id) {
            fetchCalories();
        }
        // eslint-disable-next-line
    }, [user]);

    const fetchCalories = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.get(`/api/users/${user._id}`);
            setCaloriesConsumed(res.data.calories || 0);
        } catch (err) {
            setError('Failed to fetch calories.');
        }
        setLoading(false);
    };

    const handleUpdateCalories = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        try {
            await axios.patch(`/api/users/${user._id}`, { calories: Number(inputCalories) });
            setMessage('Calories updated!');
            setInputCalories('');
            fetchCalories();
        } catch (err) {
            setError('Failed to update calories.');
        }
        setLoading(false);
    };

    const progress = Math.min((caloriesConsumed / DAILY_GOAL) * 100, 100);
    let messageText = '';
    if (caloriesConsumed < DAILY_GOAL * 0.8) {
        messageText = 'You have plenty of calories left. Keep fueling your body!';
    } else if (caloriesConsumed < DAILY_GOAL) {
        messageText = 'Almost at your goal. Great job!';
    } else {
        messageText = 'You reached your goal! Stay active and healthy!';
    }

    return (
        <div className="calorie-tracker">
            <h2>Calorie Tracker</h2>
            <div style={{ margin: '16px 0' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)' }}>{caloriesConsumed} kcal</div>
                <div style={{ color: 'var(--color-muted)', fontWeight: 500 }}>of {DAILY_GOAL} kcal goal</div>
            </div>
            <div style={{ width: '100%', background: '#e5e7eb', borderRadius: 8, height: 16, margin: '16px 0' }}>
                <div style={{ width: `${progress}%`, background: 'var(--color-accent)', height: '100%', borderRadius: 8, transition: 'width 0.4s' }}></div>
            </div>
            <form onSubmit={handleUpdateCalories} style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <input
                    type="number"
                    placeholder="Update calories"
                    value={inputCalories}
                    onChange={e => setInputCalories(e.target.value)}
                    style={{ flex: 1, padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                    required
                />
                <button type="submit" className="button" disabled={loading}>Update</button>
            </form>
            {message && <div style={{ color: 'var(--color-accent)', marginTop: 8 }}>{message}</div>}
            {error && <div style={{ color: 'crimson', marginTop: 8 }}>{error}</div>}
            <div style={{ marginTop: 12, color: 'var(--color-accent)', fontWeight: 600 }}>{messageText}</div>
        </div>
    );
};

export default CalorieTracker;