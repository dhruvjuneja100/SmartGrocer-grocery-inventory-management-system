import * as promotionModel from '../models/promotionModel.js';

export const getPromotions = async (req, res) => {
  try {
    const promotions = await promotionModel.getPromotions();
    res.json({ success: true, data: promotions });
  } catch (error) {
    console.error('Error fetching promotions:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch promotions' });
  }
};

export const getPromotionById = async (req, res) => {
  try {
    const promotion = await promotionModel.getPromotionById(req.params.id);
    if (!promotion) {
      return res.status(404).json({ success: false, error: 'Promotion not found' });
    }
    res.json({ success: true, data: promotion });
  } catch (error) {
    console.error(`Error fetching promotion ${req.params.id}:`, error);
    res.status(500).json({ success: false, error: 'Failed to fetch promotion' });
  }
};

export const createPromotion = async (req, res) => {
  try {
    const newPromotion = await promotionModel.createPromotion(req.body);
    res.status(201).json({ success: true, data: newPromotion });
  } catch (error) {
    console.error('Error creating promotion:', error);
    res.status(500).json({ success: false, error: 'Failed to create promotion' });
  }
};

export const getPromotionProducts = async (req, res) => {
  try {
    const products = await promotionModel.getPromotionProducts(req.params.id);
    res.json({ success: true, data: products });
  } catch (error) {
    console.error(`Error fetching products for promotion ${req.params.id}:`, error);
    res.status(500).json({ success: false, error: 'Failed to fetch promotion products' });
  }
};

export const addPromotionProduct = async (req, res) => {
  try {
    const { product_id } = req.body;
    const result = await promotionModel.addPromotionProduct(req.params.id, product_id);
    
    if (result.error) {
      return res.status(result.status).json({ success: false, error: result.error });
    }
    
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error('Error adding product to promotion:', error);
    res.status(500).json({ success: false, error: 'Failed to add product to promotion' });
  }
};
