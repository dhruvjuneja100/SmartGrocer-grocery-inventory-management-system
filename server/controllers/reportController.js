import * as reportModel from '../models/reportModel.js';

export const getSalesSummary = async (req, res) => {
  try {
    const summary = await reportModel.getSalesSummary();
    res.json({ success: true, data: summary });
  } catch (error) {
    console.error('Error fetching sales summary:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch sales summary' });
  }
};

export const getInventorySummary = async (req, res) => {
  try {
    const summary = await reportModel.getInventorySummary();
    res.json({ success: true, data: summary });
  } catch (error) {
    console.error('Error fetching inventory summary:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch inventory summary' });
  }
};

export const getFinancialSummary = async (req, res) => {
  try {
    const summary = await reportModel.getFinancialSummary();
    res.json({ success: true, data: summary });
  } catch (error) {
    console.error('Error fetching financial summary:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch financial summary' });
  }
};

export const getEmployeeSummary = async (req, res) => {
  try {
    const summary = await reportModel.getEmployeeSummary();
    res.json({ success: true, data: summary });
  } catch (error) {
    console.error('Error fetching employee summary:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch employee summary' });
  }
};

export const getCustomerSummary = async (req, res) => {
  try {
    const summary = await reportModel.getCustomerSummary();
    res.json({ success: true, data: summary });
  } catch (error) {
    console.error('Error fetching customer summary:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch customer summary' });
  }
};
