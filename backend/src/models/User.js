const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    calories: { type: Number, default: 0 },
    workouts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workout' }],
    foodIntake: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Food' }],
    streak: { type: mongoose.Schema.Types.ObjectId, ref: 'Streak' },
    distanceWalked: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    // Profile fields
    name: { type: String },
    age: { type: Number },
    weight: { type: Number },
    height: { type: Number },
    avatar: { type: String },
});

module.exports = mongoose.model('User', userSchema);