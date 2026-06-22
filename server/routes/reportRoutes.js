import express from 'express';
import * as reportController from '../controllers/reportController.js';

const router = express.Router();

router.get('/sales-summary', reportController.getSalesSummary);
router.get('/inventory-summary', reportController.getInventorySummary);
router.get('/financial-summary', reportController.getFinancialSummary);
router.get('/employee-summary', reportController.getEmployeeSummary);
router.get('/customer-summary', reportController.getCustomerSummary);

export default router;
