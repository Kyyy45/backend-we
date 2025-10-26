import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import protectedRoutes from './routes/protectedRoutes.js';

const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use("/api/protected", protectedRoutes);

export default app;