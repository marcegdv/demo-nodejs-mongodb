import express, { json } from 'express';
import cors from 'cors';
import router from '../routes/routes.js';
import * as middlewares from '../utils/middlewares.js';
import { mdbSetAtlas } from '../repository/database.js';

const PATH = process.env.API_PATH;
const VERSION = process.env.API_VERSION;

mdbSetAtlas();

const server = express();
server.use(cors());
server.use(json());

server.get(`${PATH}/*`, middlewares.onGet);
server.post(`${PATH}/*`, middlewares.onPost);
server.put(`${PATH}/*`, middlewares.onPut);
server.delete(`${PATH}/*`, middlewares.onDelete);
server.use(middlewares.onRequestInfo);

server.get('/', (req, res) => {
    res.status(200).send(`API ${VERSION} service running!`);
});

server.use(`${PATH}/${VERSION}`, router);

server.use('*', middlewares.onResponse);

export default server;