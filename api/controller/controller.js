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