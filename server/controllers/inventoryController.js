import * as inventoryModel from '../models/inventoryModel.js';

export const getTransactions = async (req, res) => {
  try {
    const transactions = await inventoryModel.getTransactions();
    res.json({ success: true, data: transactions });
  } catch (error) {
    console.error('Error fetching inventory transactions:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const { product_id, transaction_type, quantity } = req.body;
    
    if (!product_id || !transaction_type || quantity === undefined) {
      return res.status(400).json({ 
        success: false, 
        error: 'Required fields: product_id, transaction_type, quantity' 
      });
    }
    
    const validTypes = ['purchase', 'sale', 'adjustment', 'return'];
    if (!validTypes.includes(transaction_type)) {
      return res.status(400).json({ 
        success: false, 
        error: `Invalid transaction type. Must be one of: ${validTypes.join(', ')}` 
      });
    }
    
    const newTransaction = await inventoryModel.createTransaction(req.body);
    res.status(201).json({ success: true, data: newTransaction });
  } catch (error) {
    console.error('Error creating inventory transaction:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
