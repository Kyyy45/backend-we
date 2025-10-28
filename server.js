import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import connectDB from './src/config/db.js';
import errorHandler from './src/middlewares/errorHandler.js';
import { logger } from "./src/middlewares/logger.js";

connectDB();

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});