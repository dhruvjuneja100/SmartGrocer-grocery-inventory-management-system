import express from 'express';
import * as orderController from '../controllers/orderController.js';

const router = express.Router();

router.get('/', orderController.getOrders);
router.post('/', orderController.createOrder);

router.get('/:orderId/items', orderController.getOrderItems);
router.post('/items', orderController.createOrderItem);

export default router;
