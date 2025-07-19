import { createConnection } from 'typeorm';
import { SuperAdmin } from '../models/SuperAdmin';
import { Admin } from '../models/Admin';
import { DeviceCode } from '../models/DeviceCode';
import { Device } from '../models/Device';
import { Payment } from '../models/Payment';

export const initDatabase = async () => {
  try {
    const connection = await createConnection({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [SuperAdmin, Admin, DeviceCode, Device, Payment],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV !== 'production'
    });
    console.log('Database connected successfully');
    return connection;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};
