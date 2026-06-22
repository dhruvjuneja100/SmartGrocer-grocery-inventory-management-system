import * as feedbackModel from '../models/feedbackModel.js';

export const getFeedback = async (req, res) => {
  try {
    const feedback = await feedbackModel.getFeedback();
    res.json({ success: true, data: feedback });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch feedback' });
  }
};

export const getProductFeedback = async (req, res) => {
  try {
    const feedback = await feedbackModel.getProductFeedback(req.params.id);
    res.json({ success: true, data: feedback });
  } catch (error) {
    console.error(`Error fetching feedback for product ${req.params.id}:`, error);
    res.status(500).json({ success: false, error: 'Failed to fetch product feedback' });
  }
};
