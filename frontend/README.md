# Fitness Tracker App

## Overview
The Fitness Tracker App is a web application designed to help users track their fitness activities, including workouts, food intake, calories burned, and daily walking distance. The application is built using the MERN stack (MongoDB, Express, React, Node.js) and provides a user-friendly interface for managing fitness goals and progress.

## Features
- **User Authentication**: Users can create accounts, log in, and manage their profiles.
- **Workout Tracking**: Users can log their workouts, including type, duration, and calories burned.
- **Food Intake Logging**: Users can track their food intake, including calorie counts.
- **Calorie Tracking**: Users can view their total calories consumed and burned.
- **Daily Streak Tracking**: Users can monitor their daily login streak to encourage consistent usage.
- **Walking Distance Tracking**: Users can log and view the distance they have walked.

## Getting Started

### Prerequisites
- Node.js and npm installed on your machine.
- MongoDB Atlas account for database hosting.

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/fitness-tracker-app.git
   ```

2. Navigate to the frontend directory:
   ```
   cd fitness-tracker-app/frontend
   ```

3. Install frontend dependencies:
   ```
   npm install
   ```

4. Navigate to the backend directory:
   ```
   cd ../backend
   ```

5. Create a `.env` file in the backend directory and add your MongoDB connection string:
   ```
   MONGODB_URI=your_mongodb_connection_string
   ```

6. Install backend dependencies:
   ```
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```
   cd backend
   node src/app.js
   ```

2. In a new terminal, start the frontend application:
   ```
   cd frontend
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000` to view the application.

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License
This project is licensed under the MIT License. See the LICENSE file for details.