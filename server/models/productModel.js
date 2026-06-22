import { pool } from '../config/db.js';

export const getProducts = async () => {
  const [rows] = await pool.query(`
    SELECT p.*, c.name as category 
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
  `);
  return rows;
};

export const getProductById = async (id) => {
  const [rows] = await pool.query(`
    SELECT p.*, c.name as category 
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = ?
  `, [id]);
  return rows.length > 0 ? rows[0] : null;
};

export const createProduct = async (productData) => {
  const { name, sku, category, price, stock_quantity } = productData;
  
  let categoryId = null;
  if (category) {
    const [categories] = await pool.query('SELECT id FROM categories WHERE name = ?', [category]);
    if (categories.length > 0) {
      categoryId = categories[0].id;
    } else {
      const [result] = await pool.query('INSERT INTO categories (name) VALUES (?)', [category]);
      categoryId = result.insertId;
    }
  }
  
  const [result] = await pool.query(
    'INSERT INTO products (name, sku, category_id, price, stock_quantity) VALUES (?, ?, ?, ?, ?)',
    [name, sku, categoryId, price, stock_quantity]
  );
  
  return await getProductById(result.insertId);
};

export const updateProduct = async (id, productData) => {
  const { name, sku, category, price, stock_quantity, status } = productData;
  
  let categoryId = null;
  if (category) {
    const [categories] = await pool.query('SELECT id FROM categories WHERE name = ?', [category]);
    if (categories.length > 0) {
      categoryId = categories[0].id;
    } else {
      const [result] = await pool.query('INSERT INTO categories (name) VALUES (?)', [category]);
      categoryId = result.insertId;
    }
  }
  
  await pool.query(
    'UPDATE products SET name = ?, sku = ?, category_id = ?, price = ?, stock_quantity = ?, status = ? WHERE id = ?',
    [name, sku, categoryId, price, stock_quantity, status || 'active', id]
  );
  
  return await getProductById(id);
};

export const updateProductStatus = async (id, status) => {
  await pool.query('UPDATE products SET status = ? WHERE id = ?', [status, id]);
  return await getProductById(id);
};

export const checkProductDependencies = async (id) => {
  const [orderItems] = await pool.query('SELECT COUNT(*) as count FROM order_items WHERE product_id = ?', [id]);
  const [inventoryTxns] = await pool.query('SELECT COUNT(*) as count FROM inventory_transactions WHERE product_id = ?', [id]);
  return {
    hasOrders: orderItems[0].count > 0,
    hasInventoryTxns: inventoryTxns[0].count > 0
  };
};

export const deleteProduct = async (id) => {
  await pool.query('DELETE FROM products WHERE id = ?', [id]);
};
