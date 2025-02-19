import mongoose from 'mongoose';
import variables from './env.js';

export async function dbconnect() {
  try {
    await mongoose.connect(variables.MONGO_URI);
    console.log('Database Connect');
  } catch (error) {
    console.error('Error to Connect Database: ', error.message);
    process.exit(1);
  }
}