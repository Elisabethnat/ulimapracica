import 'dotenv/config.js';
import mongoose from 'mongoose';
import { logger } from './utils/logger.js';

export default async function mongoConnect() {
   try {
      await mongoose.connect(process.env.MONGO_URL);
      logger.info("DB conectada");
   } catch (error) {
      logger.info("Error en conexión a Mongo Atlas", error);
   };
};