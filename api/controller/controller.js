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
    next();
};

export const getProductosStockGTE = async (req, res, next) => {
    try {
        const dbResponse = await services.getProductosStockGTE(req);
        res.send(dbResponse);
    } catch (error) {
        console.log(error);
    }
    next();
};

export const postCollectionInsertar = async (req, res, next) => {
    try {
        const dbResponse = await services.postCollectionInsertar(req);
        res.send(dbResponse);
    } catch (error) {
        console.log(error);
    }
    next();
};

export const postHeaderInsert = async (req, res, next) => {
    try {
        const dbResponse = await services.postHeaderInsert(req);
        res.send(dbResponse);
    } catch (error) {
        console.log(error);
    }
    next();
};

export const postBodyInsert = async (req, res, next) => {
    try {
        const dbResponse = await services.postBodyInsert(req);
        res.send(dbResponse);
    } catch (error) {
        console.log(error);
    }
    next();
};

export const putProductoByIdStock = async (req, res, next) => {
    try {
        const dbResponse = await services.putProductoByIdStock(req);
        res.send(dbResponse);
    } catch (error) {
        console.log(error);
    }
    next();
};

export const putProductoByIdRename = async (req, res, next) => {
    try {
        const dbResponse = await services.putProductoByIdRename(req);
        res.send(dbResponse);
    } catch (error) {
        console.log(error);
    }
    next();
};

export const putProductosAjustarPrecios = async (req, res, next) => {
    try {
        const dbResponse = await services.putProductosAjustarPrecios(req);
        res.send(dbResponse);
    } catch (error) {
        console.log(error);
    }
    next();
};

export const putProductosRenombrar = async (req,res, next) => {
    try {
        const dbResponse = await services.putProductosRenombrar(req);
        res.send(dbResponse);
    } catch (error) {
        console.log(error);
    }
    next();
};

export const deleteProductoById = async (req, res, next) => {
    try {
        const dbResponse = await services.deleteProductoById(req);
        res.send(dbResponse);
    } catch (error) {
        console.log(error);
    }
    next();
};