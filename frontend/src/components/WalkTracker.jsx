import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://fitness-tracker-sfug.vercel.app';

const DAILY_GOAL_KM = 5;

const WalkTracker = ({ user }) => {
    const [distanceWalked, setDistanceWalked] = useState(0);
    const [distance, setDistance] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user && user._id) {
            fetchWalks();
        }
        // eslint-disable-next-line
    }, [user]);

    const fetchWalks = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.get(`${API_BASE_URL}/api/walks/${user._id}`);
            setDistanceWalked(res.data.distanceWalked || 0);
        } catch (err) {
            setError('Failed to fetch walk distance.');
        }
        setLoading(false);
    };

    const handleAddWalk = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        try {
            await axios.post(`${API_BASE_URL}/api/walks`, {
                userId: user._id,
                distance: Number(distance)
            });
            setMessage('Walk added!');
            setDistance('');
            fetchWalks();
        } catch (err) {
            setError('Failed to add walk.');
        }
        setLoading(false);
    };

    const progress = Math.min((distanceWalked / DAILY_GOAL_KM) * 100, 100);
    let motivational = '';
    if (distanceWalked < DAILY_GOAL_KM * 0.5) {
        motivational = 'A little walk goes a long way!';
    } else if (distanceWalked < DAILY_GOAL_KM) {
        motivational = 'Almost at your daily goal!';
    } else {
        motivational = 'Goal reached! Great job!';
    }

    return (
        <div className="walk-tracker">
            <h2>Walk Tracker</h2>
            <div style={{ marginBottom: 12, color: 'var(--color-muted)' }}>
                <span>Today's Distance: <b>{distanceWalked} km</b> / {DAILY_GOAL_KM} km</span>
            </div>
            <div style={{ width: '100%', background: '#e5e7eb', borderRadius: 8, height: 16, margin: '16px 0' }}>
                <div style={{ width: `${progress}%`, background: 'var(--color-primary)', height: '100%', borderRadius: 8, transition: 'width 0.4s' }}></div>
            </div>
            <form onSubmit={handleAddWalk} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                <input
                    type="number"
                    value={distance}
                    onChange={e => setDistance(e.target.value)}
                    placeholder="Distance in km"
                    style={{ flex: 1, padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                    required
                />
                <button type="submit" className="button" disabled={loading}>Add Walk</button>
            </form>
            {message && <div style={{ color: 'var(--color-accent)', marginBottom: 8 }}>{message}</div>}
            {error && <div style={{ color: 'crimson', marginBottom: 8 }}>{error}</div>}
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div style={{ marginTop: 12, color: 'var(--color-accent)', fontWeight: 600 }}>{motivational}</div>
            )}
        </div>
    );
};

export default WalkTracker;