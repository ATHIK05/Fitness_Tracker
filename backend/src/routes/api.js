const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// User signup with OTP
router.post('/users/request-otp', userController.requestSignupOTP);
router.post('/users/verify-otp', userController.verifySignupOTP);

// User login
router.post('/users/login', userController.loginUser);

// Fetch user data by ID (after login)
router.get('/users/:id', userController.getUserData);
router.patch('/users/:id', userController.updateCalories);

// Workout routes
router.post('/workouts', userController.logWorkout);
router.get('/workouts/:userId', userController.getUserWorkouts);

// Food routes
router.post('/food', userController.logFood);
router.get('/food/:userId', userController.getUserFoodIntake);

// Streak routes
router.post('/streak', userController.updateStreak);
router.get('/streak/:userId', userController.getUserStreak);

// Walk routes
router.post('/walks', userController.addWalk);
router.get('/walks/:userId', userController.getWalks);

// Profile routes
router.get('/users/:id/profile', userController.getProfile);
router.patch('/users/:id/profile', userController.updateProfile);

// Goal routes
router.post('/goals', userController.createGoal);
router.get('/goals/:userId', userController.getGoals);
router.patch('/goals/:goalId', userController.updateGoal);
router.delete('/goals/:goalId', userController.deleteGoal);

module.exports = router;