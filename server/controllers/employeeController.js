import * as employeeModel from '../models/employeeModel.js';

export const getEmployees = async (req, res) => {
  try {
    const employees = await employeeModel.getEmployees();
    res.json({ success: true, data: employees });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const { name, position, email } = req.body;
    
    if (!name || !position || !email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Required fields: name, position, email' 
      });
    }
    
    const newEmployee = await employeeModel.createEmployee(req.body);
    res.status(201).json({ success: true, data: newEmployee });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
