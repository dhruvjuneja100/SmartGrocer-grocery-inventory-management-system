import express from 'express';
import * as deliveryController from '../controllers/deliveryController.js';

const router = express.Router();

router.get('/zones', deliveryController.getDeliveryZones);
router.get('/vehicles', deliveryController.getDeliveryVehicles);
router.get('/assignments', deliveryController.getDeliveryAssignments);

export default router;
