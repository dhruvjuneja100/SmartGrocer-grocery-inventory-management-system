import { pool } from '../config/db.js';

export const getTransactions = async () => {
  const [rows] = await pool.query(`
    SELECT it.id, it.product_id, it.quantity, it.transaction_type, 
           it.notes, it.created_at, p.name as product_name, p.sku
    FROM inventory_transactions it
    JOIN products p ON it.product_id = p.id
    ORDER BY it.created_at DESC
  `);
  return rows;
};

export const createTransaction = async (txData) => {
  const { product_id, transaction_type, quantity, reference_id, notes } = txData;
  
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    // 1. Add the inventory transaction
    const [result] = await connection.query(
      'INSERT INTO inventory_transactions (product_id, transaction_type, quantity, reference_id, notes) VALUES (?, ?, ?, ?, ?)',
      [product_id, transaction_type, quantity, reference_id || null, notes || null]
    );
    
    // 2. Update the product stock quantity
    let stockChange = 0;
    switch (transaction_type) {
      case 'purchase':
      case 'return':
        stockChange = quantity;
        break;
      case 'sale':
        stockChange = -quantity;
        break;
      case 'adjustment':
        stockChange = quantity;
        break;
    }
    
    await connection.query(
      'UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?',
      [stockChange, product_id]
    );
    
    await connection.commit();
    
    const [newTransaction] = await connection.query(
      `SELECT it.*, p.name as product_name
       FROM inventory_transactions it
       JOIN products p ON it.product_id = p.id
       WHERE it.id = ?`, 
      [result.insertId]
    );
    
    return newTransaction[0];
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
