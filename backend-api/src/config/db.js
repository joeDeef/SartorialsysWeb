import mongoose from 'mongoose';
import { MONGO_URI } from './env.js';

export async function dbconnect() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Database Connect');
  } catch (error) {
    console.error('Error to Connect Database: ', error.message);
    process.exit(1);
  }
}