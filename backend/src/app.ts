import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import morgan from 'morgan';
import { initDatabase } from './config/database';
import { specs } from './config/swagger';
import { requestLogger } from './middleware/logging';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import deviceCodeRoutes from './routes/deviceCodes';
import deviceRoutes from './routes/devices';
import paymentRoutes from './routes/payments';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(requestLogger);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/device-codes', deviceCodeRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/payments', paymentRoutes);

// Error handling
app.use(errorHandler);

// Database initialization
initDatabase().then(() => {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`API Documentation available at http://localhost:${port}/api-docs`);
  });
}).catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

export default app;
