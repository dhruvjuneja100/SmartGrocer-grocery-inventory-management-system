import * as storeLocationModel from '../models/storeLocationModel.js';

export const getStoreLocations = async (req, res) => {
  try {
    const locations = await storeLocationModel.getStoreLocations();
    res.json({ success: true, data: locations });
  } catch (error) {
    console.error('Error fetching store locations:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch store locations' });
  }
};

export const getStoreLocationById = async (req, res) => {
  try {
    const location = await storeLocationModel.getStoreLocationById(req.params.id);
    if (!location) {
      return res.status(404).json({ success: false, error: 'Store location not found' });
    }
    res.json({ success: true, data: location });
  } catch (error) {
    console.error(`Error fetching store location ${req.params.id}:`, error);
    res.status(500).json({ success: false, error: 'Failed to fetch store location' });
  }
};

export const getStoreInventory = async (req, res) => {
  try {
    const inventory = await storeLocationModel.getStoreInventory(req.params.id);
    res.json({ success: true, data: inventory });
  } catch (error) {
    console.error(`Error fetching inventory for store ${req.params.id}:`, error);
    res.status(500).json({ success: false, error: 'Failed to fetch store inventory' });
  }
};
