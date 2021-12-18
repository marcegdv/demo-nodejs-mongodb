import express from 'express';
import createOperations from '../controller/post/createOperations';
import readOperations from '../controller/get/readOperations';
import updateOperations from '../controller/put/updateOperations';
import deleteOperations from '../controller/delete/deleteOperations';

const router = express.Router();

router.get('/productos', readOperations);
router.get('/producto', readOperations);
router.get('/producto/:id', readOperations);
router.get('/productos/stock-mayor-igual/:qtty', readOperations);

router.post('/:collection/insertar', createOperations);
router.post('/insert', createOperations);
router.post('/insertar', createOperations);

router.put('/producto/:id/set-stock/:qtty', updateOperations);
router.put('/producto/:id/renombrar', updateOperations);
router.put('/productos/ajustar-precio/:qtty', updateOperations);
router.put('/productos/:producto/renombrar', updateOperations);

router.delete('/producto/eliminar/:id', deleteOperations);

export default router;
