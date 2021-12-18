import dotenv from 'dotenv';
dotenv.config();

//export const NODE_ENV = process.env.NODE_ENV || 'development';
export const HOST = process.env.HOST || '127.0.0.1';
export const PORT = process.env.PORT || 3001;
export const DB_USER = process.env.DB_USER_NAME || '<user_name>';
export const DB_PASS = process.env.DB_USER_PASSWORD || '<user_password>';
export const DB_CLUSTER = process.env.DB_CLUSTER_NAME || '<cluster_name>';
export const DB_CLUSTER_URL = process.env.DB_CLUSTER_URL || '<cluster_url';
export const DB_NAME = process.env.DB_NAME || '<database_name>';
export const DB_OPTIONS = process.env.DB_OPTIONS || '<database_options>';