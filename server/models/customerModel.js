import { pool } from '../config/db.js';

export const getCustomers = async () => {
  const [rows] = await pool.query(`
    SELECT c.*, 
           IFNULL((SELECT COUNT(*) FROM orders WHERE customer_id = c.id), 0) as total_orders
    FROM customers c
  `);
  return rows;
};

export const getCustomerById = async (id) => {
  const [rows] = await pool.query(`
    SELECT c.*, 
           IFNULL((SELECT COUNT(*) FROM orders WHERE customer_id = c.id), 0) as total_orders
    FROM customers c
    WHERE c.id = ?
  `, [id]);
  return rows.length > 0 ? rows[0] : null;
};

export const createCustomer = async (customerData) => {
  const { name, email, phone, address } = customerData;
  const [result] = await pool.query(
    'INSERT INTO customers (name, email, phone, address) VALUES (?, ?, ?, ?)',
    [name, email, phone || null, address || null]
  );
  return await getCustomerById(result.insertId);
};

export const updateCustomer = async (id, customerData) => {
  const { name, email, phone, address } = customerData;
  await pool.query(
    'UPDATE customers SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?',
    [name, email, phone || null, address || null, id]
  );
  return await getCustomerById(id);
};

export const checkCustomerHasOrders = async (id) => {
  const [rows] = await pool.query('SELECT COUNT(*) as count FROM orders WHERE customer_id = ?', [id]);
  return rows[0].count > 0;
};

export const deleteCustomer = async (id) => {
  await pool.query('DELETE FROM customers WHERE id = ?', [id]);
};
