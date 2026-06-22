import * as loyaltyModel from '../models/loyaltyModel.js';

export const getLoyaltyPrograms = async (req, res) => {
  try {
    const programs = await loyaltyModel.getLoyaltyPrograms();
    res.json({ success: true, data: programs });
  } catch (error) {
    console.error('Error fetching loyalty programs:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch loyalty programs' });
  }
};

export const getCustomerPoints = async (req, res) => {
  try {
    const points = await loyaltyModel.getCustomerPoints(req.params.id);
    res.json({ success: true, data: points });
  } catch (error) {
    console.error(`Error fetching loyalty points for customer ${req.params.id}:`, error);
    res.status(500).json({ success: false, error: 'Failed to fetch loyalty points' });
  }
};
