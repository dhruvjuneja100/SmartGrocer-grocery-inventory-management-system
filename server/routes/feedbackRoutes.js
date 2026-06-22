import express from 'express';
import * as feedbackController from '../controllers/feedbackController.js';

const router = express.Router();

router.get('/', feedbackController.getFeedback);
router.get('/products/:id', feedbackController.getProductFeedback);

export default router;
