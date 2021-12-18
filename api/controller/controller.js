import { dbAccess, mdbSetAtlas } from '../database.js';

export const getProductos = async (req, res ,next) => {
    mdbSetAtlas();
    try {
        const dbResponse = await dbAccess('r', 'productos', {});
        res.send(dbResponse);
    } catch (error) {
        console.log(error);
    };
    next();
};