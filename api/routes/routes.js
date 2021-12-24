import express from 'express';
import * as controllers from '../controller/controller.js';

const router = express.Router();

router.get('/productos', controllers.getProductos);
/*
router.get('/producto', controllers);
router.get('/producto/:id', controllers);
router.get('/productos/stock-mayor-igual/:qtty', controllers);

router.post('/:collection/insertar', controllers);
router.post('/insert', controllers);
router.post('/insertar', controllers);

router.put('/producto/:id/set-stock/:qtty', controllers);
router.put('/producto/:id/renombrar', controllers);
router.put('/productos/ajustar-precio/:qtty', controllers);
router.put('/productos/:producto/renombrar', controllers);

router.delete('/producto/eliminar/:id', controllers);
*/

export default router;
