import * as deliveryModel from '../models/deliveryModel.js';

export const getDeliveryZones = async (req, res) => {
  try {
    const zones = await deliveryModel.getDeliveryZones();
    res.json({ success: true, data: zones });
  } catch (error) {
    console.error('Error fetching delivery zones:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch delivery zones' });
  }
};

export const getDeliveryVehicles = async (req, res) => {
  try {
    const vehicles = await deliveryModel.getDeliveryVehicles();
    res.json({ success: true, data: vehicles });
  } catch (error) {
    console.error('Error fetching delivery vehicles:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch delivery vehicles' });
  }
};

export const getDeliveryAssignments = async (req, res) => {
  try {
    const assignments = await deliveryModel.getDeliveryAssignments();
    res.json({ success: true, data: assignments });
  } catch (error) {
    console.error('Error fetching delivery assignments:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch delivery assignments' });
  }
};
