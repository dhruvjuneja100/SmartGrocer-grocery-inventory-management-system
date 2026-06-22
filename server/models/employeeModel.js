import { pool } from '../config/db.js';

export const getEmployees = async () => {
  const [rows] = await pool.query('SELECT * FROM employees');
  return rows;
};

export const createEmployee = async (employeeData) => {
  const { name, position, email, phone, hire_date } = employeeData;
  const [result] = await pool.query(
    'INSERT INTO employees (name, position, email, phone, hire_date) VALUES (?, ?, ?, ?, ?)',
    [name, position, email, phone || null, hire_date || new Date()]
  );
  
  const [newEmployee] = await pool.query('SELECT * FROM employees WHERE id = ?', [result.insertId]);
  return newEmployee[0];
};
