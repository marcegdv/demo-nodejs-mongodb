import express, { json } from 'express';
import cors from 'cors';
import router from '../routes/routes.js';
import * as middlewares from '../utils/middlewares.js';
import { mdbSetAtlas } from '../services/database.js';

mdbSetAtlas();

const server = express();
server.use(cors());
server.use(json());

server.get('*', middlewares.onGet);
server.post('*', middlewares.onPost);
server.put('*', middlewares.onPut);
server.delete('*', middlewares.onDelete);
server.use(middlewares.onRequestInfo);

server.get('/', (req, res) => {
    res.status(200).send('API v1 service is Up!');
});

server.use('/api/v1', router);

export default server;