import dotenv from 'dotenv';
import server from './server/server.js';
import { environment } from './configuration/environment.js';

dotenv.config();
const PORT = environment.PORT;
const HOST = environment.HOST;

server.listen(PORT, HOST, function () {
    console.log(`API listening on http://${HOST}:${PORT}/`);
});