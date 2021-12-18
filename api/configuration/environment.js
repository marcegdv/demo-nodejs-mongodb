import dotenv from 'dotenv';

dotenv.config();

export const environment = {
    HOST: process.env.HOST || '127.0.0.1',
    PORT: process.env.PORT || 3001,
    API_VERSION: process.env.API_VERSION || 'v1',
    DB_USER: process.env.DB_USER_NAME || '<user_name>',
    DB_PASS: process.env.DB_USER_PASSWORD || '<user_password>',
    DB_CLUSTER: process.env.DB_CLUSTER_NAME || '<cluster_name>',
    DB_CLUSTER_URL: process.env.DB_CLUSTER_URL || '<cluster_url',
    DB_NAME: process.env.DB_NAME || '<database_name>',
    DB_OPTIONS: process.env.DB_OPTIONS || '<database_options>',
};