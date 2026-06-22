import express from 'express';
import * as storeLocationController from '../controllers/storeLocationController.js';

const router = express.Router();

router.get('/', storeLocationController.getStoreLocations);
router.get('/:id', storeLocationController.getStoreLocationById);
router.get('/:id/inventory', storeLocationController.getStoreInventory);

export default router;
