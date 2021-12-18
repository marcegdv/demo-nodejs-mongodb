import { dbAccess } from '../services/database.js';

export const getProductos = async (req, res) => {
    try {
        const dbResponse = await dbAccess('r', 'productos', {});
        res.send(dbResponse);
    } catch (error) {
        console.log(error);
    };
};