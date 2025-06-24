const mongoose = require('mongoose');

const streakSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    loginDates: {
        type: [Date],
        default: []
    },
    currentStreak: {
        type: Number,
        default: 0
    },
    longestStreak: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Streak', streakSchema);