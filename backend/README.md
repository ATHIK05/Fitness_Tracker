# Fitness Tracker Backend

This is the backend for the Fitness Tracker application, built using the MERN stack (MongoDB, Express, React, Node.js). The backend is responsible for handling user authentication, workout tracking, food intake logging, and streak management.

## Features

- User registration and login
- Daily workout tracking
- Food intake logging
- Calorie tracking
- Daily login streak tracking
- RESTful API for frontend integration

## Technologies Used

- Node.js
- Express.js
- MongoDB (via MongoDB Atlas)
- Mongoose (for MongoDB object modeling)
- dotenv (for environment variable management)

## Getting Started

### Prerequisites

- Node.js installed on your machine
- MongoDB Atlas account for database hosting

### Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   ```

2. Navigate to the backend directory:

   ```
   cd fitness-tracker-app/backend
   ```

3. Install the dependencies:

   ```
   npm install
   ```

4. Create a `.env` file in the backend directory and add your MongoDB connection string:

   ```
   MONGODB_URI=<your-mongodb-connection-string>
   ```

### Running the Application

To start the backend server, run:

```
npm start
```

The server will run on `http://localhost:5000` by default.

### API Endpoints

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Log in an existing user
- `GET /api/users/:id` - Get user data
- `POST /api/workouts` - Log a new workout
- `GET /api/workouts/:userId` - Get workouts for a user
- `POST /api/food` - Log food intake
- `GET /api/food/:userId` - Get food intake for a user
- `POST /api/streak` - Log a daily login streak
- `GET /api/streak/:userId` - Get streak data for a user

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.

## License

This project is licensed under the MIT License.