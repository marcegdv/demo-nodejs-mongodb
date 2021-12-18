import { environment as env } from './configuration/environment.js';
import server from './server/server.js';

const PORT = env.PORT;
const HOST = env.HOST;
const API_VERSION = env.API_VERSION;

server.listen(PORT, HOST, function () {
    console.log(`API ${API_VERSION} listening on http://${HOST}:${PORT}/`);
});