import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://fitness-tracker-sfug.vercel.app';

const FoodTracker = ({ user }) => {
    const [foodIntake, setFoodIntake] = useState([]);
    const [foodName, setFoodName] = useState('');
    const [calories, setCalories] = useState('');
    const [intakeDate, setIntakeDate] = useState(new Date().toISOString().split('T')[0]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user && user._id) {
            fetchFoodIntake();
        }
        // eslint-disable-next-line
    }, [user]);

    const fetchFoodIntake = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.get(`${API_BASE_URL}/api/food/${user._id}`);
            setFoodIntake(res.data);
        } catch (err) {
            setError('Failed to fetch food entries.');
        }
        setLoading(false);
    };

    const handleAddFood = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        const foodCalories = Number(calories);
        if (!user || !user._id || !foodName.trim() || !foodCalories || isNaN(foodCalories) || foodCalories <= 0) {
            setError('Please enter valid food name and calories.');
            setLoading(false);
            return;
        }
        try {
            await axios.post(`${API_BASE_URL}/api/food`, {
                userId: user._id,
                name: foodName,
                calories: foodCalories,
                intakeDate
            });
            setMessage('Food added!');
            setFoodName('');
            setCalories('');
            setIntakeDate(new Date().toISOString().split('T')[0]);
            fetchFoodIntake();
        } catch (err) {
            setError('Failed to add food.');
        }
        setLoading(false);
    };

    // Today's summary
    const today = new Date().toISOString().split('T')[0];
    const todaysFoods = foodIntake.filter(item => item.intakeDate && item.intakeDate.startsWith(today));
    const todaysCalories = todaysFoods.reduce((sum, item) => sum + (item.calories || 0), 0);

    return (
        <div className="food-tracker">
            <h2>Food Tracker</h2>
            <div style={{ marginBottom: 12, color: 'var(--color-muted)' }}>
                <span>Today's Calories: <b>{todaysCalories}</b></span>
            </div>
            <form onSubmit={handleAddFood} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                <input
                    type="text"
                    placeholder="Food Name"
                    value={foodName}
                    onChange={e => setFoodName(e.target.value)}
                    style={{ flex: 2, padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                    required
                />
                <input
                    type="number"
                    placeholder="Calories"
                    value={calories}
                    onChange={e => setCalories(e.target.value)}
                    style={{ flex: 1, padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                    required
                />
                <input
                    type="date"
                    value={intakeDate}
                    onChange={e => setIntakeDate(e.target.value)}
                    style={{ flex: 1, padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                    required
                />
                <button type="submit" className="button" disabled={loading}>Add Food</button>
            </form>
            {message && <div style={{ color: 'var(--color-accent)', marginBottom: 8 }}>{message}</div>}
            {error && <div style={{ color: 'crimson', marginBottom: 8 }}>{error}</div>}
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <h3 style={{ margin: '16px 0 8px 0', color: 'var(--color-primary-dark)' }}>Recent Food Entries</h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {foodIntake.length === 0 && <li style={{ color: 'var(--color-muted)' }}>No food logged yet.</li>}
                        {foodIntake.map((item, index) => (
                            <li key={item._id || index} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                                <span style={{ fontWeight: 500 }}>{item.name}</span>
                                <span style={{ margin: '0 8px', color: 'var(--color-muted)' }}>•</span>
                                <span>{item.calories} kcal</span>
                                <span style={{ margin: '0 8px', color: 'var(--color-muted)' }}>•</span>
                                <span style={{ color: 'var(--color-primary)' }}>{item.intakeDate ? new Date(item.intakeDate).toLocaleDateString() : ''}</span>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default FoodTracker;