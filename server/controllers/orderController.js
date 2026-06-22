import * as orderModel from '../models/orderModel.js';
import { pool } from '../config/db.js';

export const getOrders = async (req, res) => {
  try {
    const orders = await orderModel.getOrders();
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { status, total_amount } = req.body;
    
    if (!status || total_amount === undefined) {
      return res.status(400).json({ 
        success: false, 
        error: 'Required fields: status, total_amount' 
      });
    }
    
    const newOrder = await orderModel.createOrder(req.body);
    res.status(201).json({ success: true, data: newOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getOrderItems = async (req, res) => {
  try {
    const items = await orderModel.getOrderItems(req.params.orderId);
    res.json({ success: true, data: items });
  } catch (error) {
    console.error(`Error fetching items for order ${req.params.orderId}:`, error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createOrderItem = async (req, res) => {
  try {
    const { order_id, product_id, quantity, unit_price } = req.body;
    
    const parsedOrderId = parseInt(order_id);
    const parsedProductId = parseInt(product_id);
    const parsedQuantity = parseInt(quantity);
    const parsedUnitPrice = parseFloat(unit_price);
    
    if (!order_id || !product_id || !quantity || unit_price === undefined) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing fields',
      });
    }
    
    if (isNaN(parsedOrderId) || isNaN(parsedProductId) || isNaN(parsedQuantity) || isNaN(parsedUnitPrice)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid number values',
      });
    }
    
    // Check if product exists and has enough stock
    const [productRows] = await pool.query(
      'SELECT id, name, stock_quantity FROM products WHERE id = ?',
      [parsedProductId]
    );
    
    if (productRows.length === 0) {
      return res.status(404).json({
        success: false,
        error: `Product with ID ${parsedProductId} not found`
      });
    }
    
    const product = productRows[0];
    
    if (product.stock_quantity < parsedQuantity) {
      return res.status(400).json({
        success: false,
        error: `Not enough stock for product ${product.name}. Requested: ${parsedQuantity}, Available: ${product.stock_quantity}`
      });
    }
    
    const newItem = await orderModel.createOrderItem(req.body);
    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    console.error('Error creating order item:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
