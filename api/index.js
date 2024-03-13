import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import globalErrorHandler from './controllers/errorController.js';
import AppError from './utils/AppError.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config({ path: './.env' });

const corsOptions = {
  origin: 'https://task-manager2-client.vercel.app/',
};

const app = express();
app.use(cors(corsOptions));

app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/task', taskRoutes);

app.all('*', (req, _, next) => {
  next(
    new AppError(
      `the route ${req.originalUrl} does not exist on this server`,
      404
    )
  );
});

mongoose.connect(process.env.MONGO).then(() => {
  console.log('DB connection successfull 🎉');
});

const port = process.env.PORT || 4100;
app.listen(port, () => {
  console.log(`Sever is running on port:${port}`);
});

app.use(globalErrorHandler);
