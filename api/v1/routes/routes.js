import express from 'express';
import * as controllers from '../controller/controller.js';

const router = express.Router();

router.get('/productos', controllers.getProductos);
router.get('/producto', controllers.getProducto);
router.get('/producto/:id', controllers.getProductoById);
router.get('/productos/stock-mayor-igual/:qtty', controllers.getProductosStockGTE);

router.post('/:collection/insertar', controllers.postCollectionInsertar);
router.post('/insert', controllers.postHeaderInsert);
router.post('/insertar', controllers.postBodyInsertar);

router.put('/producto/:id/set-stock/:qtty', controllers.putProductoByIdStock);
router.put('/producto/:id/renombrar', controllers.putProductoByIdRename);
router.put('/productos/ajustar-precio/:qtty', controllers.putProductosAjustarPrecios);
router.put('/productos/:producto/renombrar', controllers.putProductosRenombrar);

router.delete('/producto/eliminar/:id', controllers.deleteProductoById);

export default router;
