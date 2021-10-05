import express, { json } from 'express';
//import cors from 'cors';
import { PORT, HOST } from './environment.js';
import { dbAccess } from './database.js';

const app = express();

//app.use(cors());
app.use(json());

console.log('Initializing...');

//---------------------------------------------------------------------------------[ Middlewares: Req ] -----
app.post('*', (req, res, next) => {
    console.log('Middleware: POST! ->', req.path);
    next();
});
app.get('*', (req, res, next) => {
    console.log('Middleware: GET! ->', req.path);
    next();
});
app.put('*', (req, res, next) => {
    console.log('Middleware: PUT! ->', req.path);
    next();
});
app.delete('*', (req, res, next) => {
    console.log('Middleware: DELETE! ->', req.path);
    next();
});
app.use((req,res,next)=> {
    const myInfo = {
        query: req.query,
        params: req.params,
        headers: req.headers,
        body: req.body,
    };
    console.log('Middleware: Info:\n',myInfo);
    next();
})

//---------------------------------------------------------------------------------[ Utilities ] -----
const logResponse = (collection, documents) => {
    const respuesta = collection.toString() + ': +' + JSON.stringify(documents);
    console.log('DB response:',documents);
    return respuesta;
}

//---------------------------------------------------------------------------------[ POST ] ----- [ C ]
app.post('/:collection/insertar', (req, res) => {
    const collection = req.params.collection;
    const documents = req.body;
    const response = logResponse(collection, documents)
    dbAccess('c', collection, documents);
    res.send(response);
});
app.post('/insert', (req, res) => {
    const collection = req.header('collection');
    const documents = req.body;
    const response = logResponse(collection, documents)
    dbAccess('c', collection, documents);
    res.send(response);
});
app.post('/insertar', (req, res) => {
    const collection = req.body.collection;
    const documents = req.body.products;
    const response = logResponse(collection, documents)
    dbAccess('c', collection, documents);
    res.send(response);
});

//---------------------------------------------------------------------------------[ GET ] ----- [ R ]
app.get('/productos', async (req, res) => {
    const dbResponse = await dbAccess('r', 'productos', {});
    res.send(dbResponse);
});
app.get('/producto', async (req, res) => {
    const dbResponse = await dbAccess('r', 'productos', req.query);
    res.send(dbResponse);
});
app.get('/producto/:id', async (req, res) => {
    const dbResponse = await dbAccess('rid', 'productos', req.params.id);
    res.send(dbResponse);
});
app.get('/productos/stock-mayor-igual/:qtty', async (req, res) => {
    const dbResponse = await dbAccess('r', 'productos', { stock: { $gte: Number(req.params.qtty) } });
    res.send(dbResponse);
});

//---------------------------------------------------------------------------------[ PUT ] ----- [ U ]
app.put('/producto/:id/set-stock/:qtty', async (req, res) => {
    const dbResponse = await dbAccess('uid', 'productos', req.params.id, { $set: { stock: Number(req.params.qtty) } });
    res.send(dbResponse);
});
app.put('/producto/:id/renombrar', async (req, res) => {
    const dbResponse = await dbAccess('uid', 'productos', req.params.id, { $set: { nombre: req.query.nombre } });
    res.send(dbResponse);
});
app.put('/productos/ajustar-precio/:qtty', async (req, res) => {
    const dbResponse = await dbAccess('u', 'productos', {}, { $inc: { precio: Number(req.params.qtty) } });
    res.send(dbResponse);
});
app.put('/productos/:producto/renombrar', async (req, res) => {
    const dbResponse = await dbAccess('u', 'productos', { nombre: req.params.producto }, { $set: { nombre: req.query.nombre } });
    res.send(dbResponse);
});

//---------------------------------------------------------------------------------[ DELETE ] ----- [ D ]
app.delete('/producto/eliminar/:id', async (req, res) => {
    const dbResponse = await dbAccess('did', 'productos', req.params.id);
    res.send(dbResponse);
});


//---------------------------------------------------------------------------------[ Middlewares: Res ] -----
app.use('*', (req, res, next) => {
    console.log('Middleware: Response:\n',res);
    next();
});

//=================================================================================[MAIN]=====

app.listen(PORT, HOST, function () {
    console.log(`API listening on http://${HOST}:${PORT}/`);
});
