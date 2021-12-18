import { dbAccess } from '../repository/database.js';

export const getProductos = async () => {
    const dbResponse = await dbAccess('r', 'productos', {});
    return dbResponse;
};