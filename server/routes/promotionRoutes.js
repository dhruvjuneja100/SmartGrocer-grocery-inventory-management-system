import express from 'express';
import * as promotionController from '../controllers/promotionController.js';

const router = express.Router();

router.get('/', promotionController.getPromotions);
router.post('/', promotionController.createPromotion);
router.get('/:id', promotionController.getPromotionById);

router.get('/:id/products', promotionController.getPromotionProducts);
router.post('/:id/products', promotionController.addPromotionProduct);

export default router;
