import express from 'express';
import * as operations from '../controller/controller.js';

const router = express.Router();

router.get('/productos', operations.getProductos);
/*
router.get('/producto', operations);
router.get('/producto/:id', operations);
router.get('/productos/stock-mayor-igual/:qtty', operations);

router.post('/:collection/insertar', operations);
router.post('/insert', operations);
router.post('/insertar', operations);

router.put('/producto/:id/set-stock/:qtty', operations);
router.put('/producto/:id/renombrar', operations);
router.put('/productos/ajustar-precio/:qtty', operations);
router.put('/productos/:producto/renombrar', operations);

router.delete('/producto/eliminar/:id', operations);
*/

export default router;
