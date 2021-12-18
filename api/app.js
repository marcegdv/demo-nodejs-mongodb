import dotenv from 'dotenv';
import server from './server/server';
import { environment } from './configuration/environment';

dotenv.config();
const PORT = environment.PORT;
const HOST = environment.HOST;

server.listen(PORT, HOST, function () {
    console.log(`API listening on http://${HOST}:${PORT}/`);
});