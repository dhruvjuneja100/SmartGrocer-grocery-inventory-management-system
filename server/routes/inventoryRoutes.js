import express from 'express';
import * as inventoryController from '../controllers/inventoryController.js';

const router = express.Router();

router.get('/transactions', inventoryController.getTransactions);
router.post('/transactions', inventoryController.createTransaction);

export default router;
