import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';

import './auth/google';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import taskRoutes from './routes/task.routes'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Root Route
app.get('/', (req, res) => {
  res.send('API is running...');
});
app.use('/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/tasks',taskRoutes)

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('Mongo error:', err));
