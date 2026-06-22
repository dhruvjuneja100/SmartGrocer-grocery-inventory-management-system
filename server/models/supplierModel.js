import { pool } from '../config/db.js';

export const getSuppliers = async () => {
  const [rows] = await pool.query('SELECT * FROM suppliers');
  return rows;
};

export const createSupplier = async (supplierData) => {
  const { name, contact_person, email, phone, address } = supplierData;
  const [result] = await pool.query(
    'INSERT INTO suppliers (name, contact_person, email, phone, address) VALUES (?, ?, ?, ?, ?)',
    [name, contact_person || null, email, phone || null, address || null]
  );
  
  const [newSupplier] = await pool.query('SELECT * FROM suppliers WHERE id = ?', [result.insertId]);
  return newSupplier[0];
};

export const updateSupplier = async (id, supplierData) => {
  const { name, contact_person, email, phone, address } = supplierData;
  await pool.query(
    'UPDATE suppliers SET name = ?, contact_person = ?, email = ?, phone = ?, address = ? WHERE id = ?',
    [name, contact_person || null, email, phone || null, address || null, id]
  );
  
  const [updatedSupplier] = await pool.query('SELECT * FROM suppliers WHERE id = ?', [id]);
  return updatedSupplier[0];
};

export const deleteSupplier = async (id) => {
  await pool.query('DELETE FROM suppliers WHERE id = ?', [id]);
};

export const getSupplierById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM suppliers WHERE id = ?', [id]);
  return rows.length > 0 ? rows[0] : null;
};
