import { pool } from '../config/db.js';

export const getProducts = async () => {
  const [rows] = await pool.query('SELECT * FROM products');
  return rows;
};

export const addProduct = async (productData) => {
  const { name, sku, category, price, stock_quantity } = productData;
  
  // First check if product already exists by name
  const [existingProducts] = await pool.query('SELECT * FROM products WHERE name = ?', [name]);
  
  if (existingProducts.length > 0) {
    return { exists: true, product: existingProducts[0] };
  }
  
  // Find or create category
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
  
  // Add the product
  const [result] = await pool.query(
    'INSERT INTO products (name, sku, category_id, price, stock_quantity) VALUES (?, ?, ?, ?, ?)',
    [name, sku || `SKU-\${Date.now()}`, categoryId, price || 0, stock_quantity || 0]
  );
  
  const [newProduct] = await pool.query(`
    SELECT p.*, c.name as category 
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = ?
  `, [result.insertId]);
  
  return { exists: false, product: newProduct[0] };
};
