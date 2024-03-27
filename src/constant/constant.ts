import * as dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file
export const APP_CONFIG = {
  jwt_key: process.env.JWT_KEY,
  user_name: process.env.USER_NAME,
  password: process.env.PASSWORD,
  port: process.env.PORT,
};
