import React, { useEffect, useState } from 'react';
import axios from 'axios';
import WorkoutTracker from './WorkoutTracker';
import FoodTracker from './FoodTracker';
import CalorieTracker from './CalorieTracker';
import StreakTracker from './StreakTracker';
import WalkTracker from './WalkTracker';
// import { Chart } from 'react-chartjs-2'; // Placeholder for future chart integration

const Dashboard = ({ user }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/users/${user._id}`);
                setUserData(response.data);
                console.log('Fetched userData:', response.data); // Debug log
            } catch (error) {
                setError('Error fetching user data.');
            } finally {
                setLoading(false);
            }
        };

        if (user && user._id) {
            fetchUserData();
        }
    }, [user]);

    if (loading) {
        return <div style={{textAlign: 'center', marginTop: 60}}>Loading your dashboard...</div>;
    }
    if (error) {
        return <div style={{color: 'red', textAlign: 'center', marginTop: 60}}>{error}</div>;
    }
    if (!userData) {
        return null;
    }

    // Streak card logic
    const streak = userData.streak?.currentStreak || 0;
    const streakMessage = streak > 0
        ? `🔥 ${streak} day${streak > 1 ? 's' : ''} streak! Keep it up!`
        : 'Start your streak today!';

    return (
        <div className="container">
            <div className="dashboard">
                {/* Streak Card */}
                <div className="streak-card card">
                    <span className="fire" role="img" aria-label="fire">🔥</span>
                    <h2>Streak</h2>
                    <div style={{ fontSize: '2.2rem', fontWeight: 700, margin: '8px 0' }}>{streak} days</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 500 }}>{streakMessage}</div>
                </div>
                {/* Workout Tracker */}
                <div className="card">
                    <WorkoutTracker user={userData} />
                </div>
                {/* Food Tracker */}
                <div className="card">
                    <FoodTracker user={userData} />
                </div>
                {/* Walk Tracker */}
                <div className="card">
                    <WalkTracker user={userData} />
                </div>
                {/* Placeholder for future: Progress/Charts */}
                {/* <div className="card">
                    <h2>Progress</h2>
                    <Chart ... />
                </div> */}
            </div>
        </div>
    );
};

export default Dashboard;
