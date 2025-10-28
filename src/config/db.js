import mongoose from 'mongoose';
import winston from 'winston';

const logger = winston.createLogger({
  transports: [new winston.transports.Console()]
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info('MongoDB Connected');
  } catch (error) {
    logger.error('MongoDB Connection Failed:', error.message);
    process.exit(1);
  }

  mongoose.connection.on('disconnected', () => logger.warn('MongoDB Disconnected'));
  mongoose.connection.on('reconnected', () => logger.info('MongoDB Reconnected'));
  mongoose.connection.on('error', (err) => logger.error('MongoDB Error:', err));
};

export default connectDB;