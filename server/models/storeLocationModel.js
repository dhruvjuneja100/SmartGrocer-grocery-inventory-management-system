import { pool } from '../config/db.js';

export const getStoreLocations = async () => {
  const [rows] = await pool.query('SELECT * FROM store_locations ORDER BY name');
  return rows;
};

export const getStoreLocationById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM store_locations WHERE id = ?', [id]);
  return rows.length > 0 ? rows[0] : null;
};

export const getStoreInventory = async (storeId) => {
  const [rows] = await pool.query(`
    SELECT spi.*, p.name, p.sku, p.price, c.name as category 
    FROM store_product_inventory spi
    JOIN products p ON spi.product_id = p.id
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE spi.store_id = ?
  `, [storeId]);
  return rows;
};
