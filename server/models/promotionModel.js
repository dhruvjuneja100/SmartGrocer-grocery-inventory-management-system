import { pool } from '../config/db.js';

export const getPromotions = async () => {
  const [rows] = await pool.query('SELECT * FROM promotions ORDER BY start_date DESC');
  return rows;
};

export const getPromotionById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM promotions WHERE id = ?', [id]);
  return rows.length > 0 ? rows[0] : null;
};

export const createPromotion = async (promotionData) => {
  const { name, description, discount_type, discount_value, min_purchase_amount, start_date, end_date, is_active } = promotionData;
  const [result] = await pool.query(
    'INSERT INTO promotions (name, description, discount_type, discount_value, min_purchase_amount, start_date, end_date, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [name, description, discount_type, discount_value, min_purchase_amount, start_date, end_date, is_active]
  );
  
  const [newPromotion] = await pool.query('SELECT * FROM promotions WHERE id = ?', [result.insertId]);
  return newPromotion[0];
};

export const getPromotionProducts = async (promotionId) => {
  const [rows] = await pool.query(`
    SELECT p.* FROM products p
    JOIN promotion_products pp ON p.id = pp.product_id
    WHERE pp.promotion_id = ?
  `, [promotionId]);
  return rows;
};

export const addPromotionProduct = async (promotionId, productId) => {
  // Check if the product and promotion exist
  const [productRows] = await pool.query('SELECT * FROM products WHERE id = ?', [productId]);
  const [promotionRows] = await pool.query('SELECT * FROM promotions WHERE id = ?', [promotionId]);
  
  if (productRows.length === 0) return { error: 'Product not found', status: 404 };
  if (promotionRows.length === 0) return { error: 'Promotion not found', status: 404 };
  
  // Check if the product is already in the promotion
  const [existingRows] = await pool.query(
    'SELECT * FROM promotion_products WHERE promotion_id = ? AND product_id = ?',
    [promotionId, productId]
  );
  
  if (existingRows.length > 0) return { error: 'Product already in promotion', status: 400 };
  
  // Add the product to the promotion
  await pool.query(
    'INSERT INTO promotion_products (promotion_id, product_id) VALUES (?, ?)',
    [promotionId, productId]
  );
  
  return { promotion_id: promotionId, product_id: productId };
};
