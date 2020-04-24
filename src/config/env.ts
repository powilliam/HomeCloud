import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({
  path: resolve(__dirname, '..', '..', 'production.env'),
});

export const POSTGRES_USER = process.env.POSTGRES_USER;
export const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
export const POSTGRES_DB = process.env.POSTGRES_DB;
export const HTTP_ADDRESS = process.env.HTTP_ADDRESS;
export const HTTP_STATICFOLDER = process.env.HTTP_STATICFOLDER;
