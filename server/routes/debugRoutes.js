import express from 'express';
import * as debugController from '../controllers/debugController.js';

const router = express.Router();

router.get('/products', debugController.getProducts);
router.post('/add-product', debugController.addProduct);

export default router;
