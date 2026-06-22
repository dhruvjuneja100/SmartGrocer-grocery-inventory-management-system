import { pool } from '../config/db.js';

export const getFeedback = async () => {
  const [rows] = await pool.query(`
    SELECT f.*, c.name as customer_name, p.name as product_name
    FROM feedback f
    LEFT JOIN customers c ON f.customer_id = c.id
    LEFT JOIN products p ON f.product_id = p.id
    ORDER BY f.feedback_date DESC
  `);
  return rows;
};

export const getProductFeedback = async (productId) => {
  const [rows] = await pool.query(`
    SELECT f.*, c.name as customer_name
    FROM feedback f
    LEFT JOIN customers c ON f.customer_id = c.id
    WHERE f.product_id = ? AND f.is_public = true AND f.status = 'approved'
    ORDER BY f.feedback_date DESC
  `, [productId]);
  return rows;
};
