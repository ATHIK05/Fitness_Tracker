const User = require('../models/User');
const Workout = require('../models/Workout');
const Food = require('../models/Food');
const Streak = require('../models/Streak');
const nodemailer = require('nodemailer');
const Goal = require('../models/Goal');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mohamedathikr.22msc@kongu.edu',
        pass: 'jydu rtbm trgs vuvo'
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Generate a 6-digit OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP email
async function sendOTPEmail(email, otp) {
    await transporter.sendMail({
        from: '"Fitness Tracker" <mohamedathikr.22msc@kongu.edu>',
        to: email,
        subject: 'Your OTP for Fitness Tracker Registration',
        text: `Your OTP is: ${otp}`
    });
}

// Signup - Step 1: Request OTP
exports.requestSignupOTP = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user && user.isVerified) {
            return res.status(400).json({ message: 'Email already registered and verified.' });
        }
        const otp = generateOTP();
        if (!user) {
            user = new User({ email, password, otp, isVerified: false });
        } else {
            user.password = password;
            user.otp = otp;
        }
        await user.save();
        await sendOTPEmail(email, otp);
        res.status(200).json({ message: 'OTP sent to email.' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ message: 'Error sending OTP', error });
    }
};

// Signup - Step 2: Verify OTP
exports.verifySignupOTP = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found.' });
        if (user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP.' });
        user.isVerified = true;
        user.otp = undefined;
        await user.save();
        res.status(200).json({ message: 'Email verified. Account created.', user });
    } catch (error) {
        res.status(500).json({ message: 'Error verifying OTP', error });
    }
};

// Login (only allow if verified)
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        if (!user.isVerified) {
            return res.status(403).json({ message: 'Email not verified. Please verify your email.' });
        }
        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};

// Fetch user data by ID
exports.getUserData = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId)
            .populate('workouts')
            .populate('foodIntake')
            .populate('streak');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user data', error });
    }
};

// Update user calories
exports.updateCalories = async (req, res) => {
    const userId = req.params.id;
    const { calories } = req.body;
    try {
        const user = await User.findByIdAndUpdate(userId, { calories }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'Calories updated', user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating calories', error });
    }
};

// Log a workout
exports.logWorkout = async (req, res) => {
    const { userId, workoutType, duration, caloriesBurned } = req.body;
    try {
        // Validate input
        if (!userId || !workoutType || !duration || !caloriesBurned) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }
        // Create workout
        const workout = new Workout({ userId, workoutType, duration, caloriesBurned });
        await workout.save();
        // Add workout to user's workouts array
        await User.findByIdAndUpdate(userId, { $push: { workouts: workout._id } });
        res.status(201).json({ message: 'Workout logged successfully', workout });
    } catch (error) {
        res.status(500).json({ message: 'Error logging workout', error });
    }
};

// Get user workouts
exports.getUserWorkouts = async (req, res) => {
    const { userId } = req.params;
    try {
        const workouts = await Workout.find({ userId }).sort({ date: -1 });
        res.status(200).json(workouts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching workouts', error });
    }
};

// Log food intake
exports.logFood = async (req, res) => {
    const { userId, name, calories, intakeDate } = req.body;
    try {
        if (!userId || !name || !calories) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }
        const food = new Food({ userId, name, calories, intakeDate: intakeDate || Date.now() });
        await food.save();
        await User.findByIdAndUpdate(userId, { $push: { foodIntake: food._id } });
        res.status(201).json({ message: 'Food logged successfully', food });
    } catch (error) {
        res.status(500).json({ message: 'Error logging food', error });
    }
};

// Get user food intake
exports.getUserFoodIntake = async (req, res) => {
    const { userId } = req.params;
    try {
        const foodEntries = await Food.find({ userId }).sort({ intakeDate: -1 });
        res.status(200).json(foodEntries);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching food intake', error });
    }
};

// Update streak
exports.updateStreak = async (req, res) => {
    const { userId } = req.body;
    try {
        if (!userId) {
            return res.status(400).json({ message: 'Missing userId.' });
        }
        let streak = await Streak.findOne({ userId });
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (!streak) {
            streak = new Streak({ userId, loginDates: [today], currentStreak: 1, longestStreak: 1 });
        } else {
            // Check if already logged in today
            const lastLogin = streak.loginDates.length > 0 ? new Date(streak.loginDates[streak.loginDates.length - 1]) : null;
            if (lastLogin && lastLogin.getTime() === today.getTime()) {
                return res.status(200).json({ message: 'Already updated for today', streak });
            }
            // Check if yesterday was last login
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);
            if (lastLogin && lastLogin.getTime() === yesterday.getTime()) {
                streak.currentStreak += 1;
            } else {
                streak.currentStreak = 1;
            }
            streak.loginDates.push(today);
            if (streak.currentStreak > streak.longestStreak) {
                streak.longestStreak = streak.currentStreak;
            }
        }
        await streak.save();
        // Link streak to user if not already
        await User.findByIdAndUpdate(userId, { streak: streak._id });
        res.status(200).json({ message: 'Streak updated', streak });
    } catch (error) {
        res.status(500).json({ message: 'Error updating streak', error });
    }
};

// Get user streak
exports.getUserStreak = async (req, res) => {
    const { userId } = req.params;
    try {
        const streak = await Streak.findOne({ userId });
        if (!streak) {
            return res.status(404).json({ message: 'Streak not found.' });
        }
        res.status(200).json(streak);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching streak', error });
    }
};

// Update walk distance
exports.addWalk = async (req, res) => {
    const { userId, distance } = req.body;
    try {
        if (!userId || !distance) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        user.distanceWalked += Number(distance);
        await user.save();
        res.status(200).json({ message: 'Walk added', distanceWalked: user.distanceWalked });
    } catch (error) {
        res.status(500).json({ message: 'Error adding walk', error });
    }
};

// Get walk distance
exports.getWalks = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json({ distanceWalked: user.distanceWalked });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching walk distance', error });
    }
};

// Get user profile
exports.getProfile = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId).select('email name age weight height avatar');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    const userId = req.params.id;
    const { name, age, weight, height, avatar } = req.body;
    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { name, age, weight, height, avatar },
            { new: true, runValidators: true, fields: 'email name age weight height avatar' }
        );
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'Profile updated', user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error });
    }
};

// Create a new goal
exports.createGoal = async (req, res) => {
    const { userId, type, target, unit, startDate, endDate, description } = req.body;
    try {
        const goal = new Goal({ userId, type, target, unit, startDate, endDate, description });
        await goal.save();
        res.status(201).json({ message: 'Goal created', goal });
    } catch (error) {
        res.status(500).json({ message: 'Error creating goal', error });
    }
};

// Get all goals for a user
exports.getGoals = async (req, res) => {
    const { userId } = req.params;
    try {
        const goals = await Goal.find({ userId });
        res.status(200).json(goals);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching goals', error });
    }
};

// Update a goal
exports.updateGoal = async (req, res) => {
    const { goalId } = req.params;
    const updates = req.body;
    try {
        const goal = await Goal.findByIdAndUpdate(goalId, updates, { new: true });
        if (!goal) return res.status(404).json({ message: 'Goal not found' });
        res.status(200).json({ message: 'Goal updated', goal });
    } catch (error) {
        res.status(500).json({ message: 'Error updating goal', error });
    }
};

// Delete a goal
exports.deleteGoal = async (req, res) => {
    const { goalId } = req.params;
    try {
        const goal = await Goal.findByIdAndDelete(goalId);
        if (!goal) return res.status(404).json({ message: 'Goal not found' });
        res.status(200).json({ message: 'Goal deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting goal', error });
    }
};