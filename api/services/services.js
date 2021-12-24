import { dbAccess } from '../repository/database.js';

export const getProductos = async () => {
    return await dbAccess('r', 'productos', {});
};

export const getProducto = async (req) => {
    return await dbAccess('r', 'productos', req.query);
};

export const getProductoById = async (req) => {
    return await dbAccess('rid', 'productos', req.params.id);
};

export const getProductosStockGTE = async (req) => {
    return await dbAccess('r', 'productos', { stock: { $gte: Number(req.params.qtty) } });
};
