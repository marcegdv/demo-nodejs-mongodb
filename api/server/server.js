import express, { json } from 'express';
import cors from 'cors';
import router from '../routes/routes';

const server = express();
server.use(cors());
server.use(json());
server.get('/', (req, res) => {
    res.status(200).send('API service is Up!');
});

server.use('/api/v1', router);

export default server;