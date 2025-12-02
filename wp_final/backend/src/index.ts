import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { PORT, CLIENT_ORIGIN } from './config/env';
import { initDb } from './db';
import authRoutes from './routes/auth';
import studentRoutes from './routes/students';
import classRoutes from './routes/classes';
import { errorHandler } from './middleware/errorHandler';

initDb();

const app = express();

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/students', studentRoutes);
app.use('/classes', classRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Backend server listening on http://localhost:${PORT}`);
});



