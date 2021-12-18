import { environment as env } from './configuration/environment.js';
import server from './server/server.js';

const PORT = env.PORT;
const HOST = env.HOST;
const PATH =  env.API_PATH;
const VERSION = env.API_VERSION;

server.listen(PORT, HOST, function () {
    console.log(`API ${VERSION} listening on http://${HOST}:${PORT}${PATH}/${VERSION}`);
});