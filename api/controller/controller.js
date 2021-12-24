import * as services from '../services/services.js';

export const getProductos = async (req, res, next) => {
    try {
        const dbResponse = await services.getProductos();
        res.send(dbResponse);
    } catch (error) {
        console.log(error);
    };
    next();
};

export const getProducto = async (req, res, next) => {
    try {
        const dbResponse = await services.getProducto(req);
        res.send(dbResponse);
    } catch (error) {
        console.log(error);
    };
    next();
};

export const getProductoById = async (req, res, next) => {
    try {
        const dbResponse = await services.getProductoById(req);
        res.send(dbResponse);
    } catch (error) {
        console.log(error);
    }
};

export const getProductosStockGTE = async (req, res, next) => {
    try {
        const dbResponse = await services.getProductosStockGTE(req);
        res.send(dbResponse);
    } catch (error) {
        console.log(error);
    }
};

export const postCollectionInsertar = async (req, res, next) => {
    try {
        const collection = req.params.collection;
        const documents = req.body;
        const response = logResponse(collection, documents)
        dbAccess('c', collection, documents);
        res.send(response);
    } catch (error) {
        console.log(error);
    }
};