# Fitness Tracker App

## Overview
The Fitness Tracker App is a web application designed to help users track their fitness activities, including workouts, food intake, calories burned, and daily walking distance. The application provides a user-friendly dashboard that allows users to monitor their progress and maintain their fitness goals.

## Features
- **User Authentication**: Users can create accounts, log in, and manage their profiles.
- **Workout Tracking**: Users can log their workouts, including type, duration, and calories burned.
- **Food Intake Logging**: Users can track their food intake, including calorie counts.
- **Calorie Tracking**: The app calculates and displays total calories consumed and burned.
- **Daily Streak Tracking**: Users can see their daily login streak to encourage consistent usage.
- **Walking Distance Tracking**: Users can log the distance they walk daily.

## Tech Stack
- **Frontend**: React (MERN Stack)
- **Backend**: Node.js, Express
- **Database**: MongoDB Atlas

## Project Structure
```
fitness-tracker-app
├── backend
│   ├── src
│   │   ├── controllers
│   │   ├── models
│   │   ├── routes
│   │   └── app.js
│   ├── .env
│   ├── package.json
│   └── README.md
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── App.jsx
│   │   └── index.js
│   ├── package.json
│   └── README.md
└── README.md
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the backend directory and install dependencies:
   ```
   cd fitness-tracker-app/backend
   npm install
   ```
3. Set up your MongoDB connection string in the `.env` file.
4. Navigate to the frontend directory and install dependencies:
   ```
   cd ../frontend
   npm install
   ```
5. Start the backend server:
   ```
   cd ../backend
   npm start
   ```
6. Start the frontend application:
   ```
   cd ../frontend
   npm start
   ```

## Usage
- Access the application in your web browser at `http://localhost:3000`.
- Create an account or log in to start tracking your fitness activities.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.