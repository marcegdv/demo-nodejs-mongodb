import express from 'express';
import * as controllers from '../controller/controller.js';

const router = express.Router();

router.get('/productos', controllers.getProductos);
router.get('/producto', controllers.getProducto);
router.get('/producto/:id', controllers.getProductoById);
router.get('/productos/stock-mayor-igual/:qtty', controllers.getProductosStockGTE);

router.post('/:collection/insertar', controllers.postCollectionInsertar);
/*
router.post('/insert', controllers);
router.post('/insertar', controllers);

router.put('/producto/:id/set-stock/:qtty', controllers);
router.put('/producto/:id/renombrar', controllers);
router.put('/productos/ajustar-precio/:qtty', controllers);
router.put('/productos/:producto/renombrar', controllers);

router.delete('/producto/eliminar/:id', controllers);
*/

export default router;
