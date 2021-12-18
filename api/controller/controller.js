import { getProductos as serviceGetProductos} from '../services/services.js';

export const getProductos = async (req, res) => {
    try {
        const dbResponse = await serviceGetProductos();
        res.send(dbResponse);
    } catch (error) {
        console.log(error);
    };
};