import express from 'express';
import * as loyaltyController from '../controllers/loyaltyController.js';

const router = express.Router();

router.get('/programs', loyaltyController.getLoyaltyPrograms);
router.get('/customers/:id/points', loyaltyController.getCustomerPoints);

export default router;
