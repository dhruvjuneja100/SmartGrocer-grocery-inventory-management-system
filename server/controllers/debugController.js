import * as debugModel from '../models/debugModel.js';

export const getProducts = async (req, res) => {
  try {
    const products = await debugModel.getProducts();
    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    console.error('Error getting products for debug:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const addProduct = async (req, res) => {
  try {
    const result = await debugModel.addProduct(req.body);
    
    if (result.exists) {
      return res.json({ success: true, message: 'Product already exists', data: result.product });
    }
    
    res.status(201).json({ success: true, data: result.product });
  } catch (error) {
    console.error('Error adding debug product:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
