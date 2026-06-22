import * as productModel from '../models/productModel.js';

export const getProducts = async (req, res) => {
  try {
    const products = await productModel.getProducts();
    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await productModel.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    console.error(`Error fetching product ${req.params.id}:`, error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, sku, category, price, stock_quantity } = req.body;
    
    if (!name || !sku || !category || price === undefined || stock_quantity === undefined) {
      return res.status(400).json({ 
        success: false, 
        error: 'Required fields: name, sku, category, price, stock_quantity' 
      });
    }
    
    const newProduct = await productModel.createProduct(req.body);
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { name, sku, category, price, stock_quantity } = req.body;
    
    if (!name || !sku || !category || price === undefined || stock_quantity === undefined) {
      return res.status(400).json({ 
        success: false, 
        error: 'Required fields: name, sku, category, price, stock_quantity' 
      });
    }
    
    const product = await productModel.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    const updatedProduct = await productModel.updateProduct(req.params.id, req.body);
    res.json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error(`Error updating product ${req.params.id}:`, error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateProductStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['active', 'inactive'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Required field: status (must be "active" or "inactive")' 
      });
    }
    
    const product = await productModel.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    const updatedProduct = await productModel.updateProductStatus(req.params.id, status);
    res.json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error(`Error updating product status ${req.params.id}:`, error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await productModel.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    const deps = await productModel.checkProductDependencies(req.params.id);
    
    if (deps.hasOrders || deps.hasInventoryTxns) {
      let errorMsg = 'Cannot delete product as it is referenced in ';
      if (deps.hasOrders && deps.hasInventoryTxns) {
        errorMsg += 'orders and inventory transactions';
      } else if (deps.hasOrders) {
        errorMsg += 'orders';
      } else {
        errorMsg += 'inventory transactions';
      }
      errorMsg += '. Consider marking it as inactive instead.';
      
      return res.status(400).json({ 
        success: false, 
        error: errorMsg,
        constraint: true
      });
    }
    
    await productModel.deleteProduct(req.params.id);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error(`Error deleting product ${req.params.id}:`, error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      constraint: error.message.includes('foreign key constraint') 
    });
  }
};
