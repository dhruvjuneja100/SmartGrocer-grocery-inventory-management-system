import * as customerModel from '../models/customerModel.js';

export const getCustomers = async (req, res) => {
  try {
    const customers = await customerModel.getCustomers();
    res.json({ success: true, data: customers });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const customerId = parseInt(req.params.id, 10);
    if (isNaN(customerId)) {
      return res.status(400).json({ success: false, error: 'Invalid customer ID' });
    }
    
    const customer = await customerModel.getCustomerById(customerId);
    if (!customer) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }
    
    res.json({ success: true, data: customer });
  } catch (error) {
    console.error(`Error fetching customer ${req.params.id}:`, error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createCustomer = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Required fields: name, email' 
      });
    }
    
    const newCustomer = await customerModel.createCustomer(req.body);
    res.status(201).json({ success: true, data: newCustomer });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Required fields: name, email' 
      });
    }
    
    const customerId = parseInt(req.params.id, 10);
    if (isNaN(customerId)) {
      return res.status(400).json({ success: false, error: 'Invalid customer ID' });
    }
    
    const customer = await customerModel.getCustomerById(customerId);
    if (!customer) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }
    
    const updatedCustomer = await customerModel.updateCustomer(customerId, req.body);
    res.json({ success: true, data: updatedCustomer });
  } catch (error) {
    console.error(`Error updating customer ${req.params.id}:`, error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const customerId = parseInt(req.params.id, 10);
    if (isNaN(customerId)) {
      return res.status(400).json({ success: false, error: 'Invalid customer ID' });
    }
    
    const customer = await customerModel.getCustomerById(customerId);
    if (!customer) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }
    
    const hasOrders = await customerModel.checkCustomerHasOrders(customerId);
    if (hasOrders) {
      return res.status(400).json({ 
        success: false, 
        error: 'Cannot delete customer as they have existing orders. Consider deactivating the account instead.' 
      });
    }
    
    await customerModel.deleteCustomer(customerId);
    res.json({ success: true, message: 'Customer deleted successfully' });
  } catch (error) {
    console.error(`Error deleting customer ${req.params.id}:`, error);
    res.status(500).json({ success: false, error: error.message });
  }
};
