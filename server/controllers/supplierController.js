import * as supplierModel from '../models/supplierModel.js';

export const getSuppliers = async (req, res) => {
  try {
    const suppliers = await supplierModel.getSuppliers();
    res.json({ success: true, data: suppliers });
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createSupplier = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Required fields: name, email' 
      });
    }
    
    const newSupplier = await supplierModel.createSupplier(req.body);
    res.status(201).json({ success: true, data: newSupplier });
  } catch (error) {
    console.error('Error creating supplier:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateSupplier = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Required fields: name, email' 
      });
    }
    
    const supplier = await supplierModel.getSupplierById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ success: false, error: 'Supplier not found' });
    }
    
    const updatedSupplier = await supplierModel.updateSupplier(req.params.id, req.body);
    res.json({ success: true, data: updatedSupplier });
  } catch (error) {
    console.error(`Error updating supplier ${req.params.id}:`, error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteSupplier = async (req, res) => {
  try {
    const supplier = await supplierModel.getSupplierById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ success: false, error: 'Supplier not found' });
    }
    
    await supplierModel.deleteSupplier(req.params.id);
    res.json({ success: true, message: 'Supplier deleted successfully' });
  } catch (error) {
    console.error(`Error deleting supplier ${req.params.id}:`, error);
    res.status(500).json({ success: false, error: error.message });
  }
};
