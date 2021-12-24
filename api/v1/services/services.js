import { dbAccess } from '../repository/database.js';
import  { logResponse } from '../utils/functions.js';

//---------------------------------------------------------------------------------[ POST ] ----- [ Create ]
export const postCollectionInsertar = async (req) => {
    const collection = req.params.collection;
    const documents = req.body;
    const dbResponse = await dbAccess('c', collection, documents);
    console.log(logResponse(collection, documents));
    console.log('Response:\n',dbResponse);
    return dbResponse;
};

export const postHeaderInsert = async (req) => {
    const collection = req.header('collection');
    const documents = req.body;
    const dbResponse = await dbAccess('c', collection, documents);
    console.log(logResponse(collection, documents));
    console.log('Response:\n',dbResponse);
    return dbResponse;
};

export const postBodyInsertar = async (req) => {
    const collection = req.body.collection;
    const documents = req.body.products;
    const dbResponse = await dbAccess('c', collection, documents);
    console.log(logResponse(collection, documents));
    console.log('Response:\n',dbResponse);
    return dbResponse;
};

//---------------------------------------------------------------------------------[ GET ] ----- [ Read ]
export const getProductos = async () => {
    return await dbAccess('r', 'productos', {});
};

export const getProducto = async (req) => {
    return await dbAccess('r', 'productos', req.query);
};

export const getProductoById = async (req) => {
    return await dbAccess('rid','productos', req.params.id);
};

export const getProductosStockGTE = async (req) => {
    return await dbAccess(
        'r',
        'productos',
        { stock: { $gte: Number(req.params.qtty) } }
    );
};

//---------------------------------------------------------------------------------[ PUT ] ----- [ Update ]
export const putProductoByIdStock = async (req) => {
    return await dbAccess(
        'uid',
        'productos',
        req.params.id,
        { $set: { stock: Number(req.params.qtty) } }
    );
};

export const putProductoByIdRename = async (req) => {
    return await dbAccess(
        'uid',
        'productos',
        req.params.id,
        { $set: { nombre: req.query.nombre } }
    );
};

export const putProductosAjustarPrecios = async (req) => {
    return await dbAccess(
        'u',
        'productos',
        {},
        { $inc: { precio: Number(req.params.qtty) } }
    );
};

export const putProductosRenombrar = async (req) => {
    return await dbAccess(
        'u',
        'productos',
        { nombre: req.params.producto },
        { $set: { nombre: req.query.nombre } }
    );
};

//---------------------------------------------------------------------------------[ DELETE ] ----- [ Delete ]
export const deleteProductoById = async (req) => {
    return await dbAccess(
        'did',
        'productos',
        req.params.id
    );
};