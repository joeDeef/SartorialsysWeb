import dotenv from "dotenv";
dotenv.config();

const variables = {
  MONGO_URI: process.env.MONGO_URI,
  PORT: process.env.PORT,
  CLOUD_NAME: process.env.CLOUD_NAME,
  API_KEY: process.env.API_KEY,
  API_SECRET: process.env.API_SECRET,
  SECRET_KEY: process.env.SECRET_KEY,
};

export default variables;
