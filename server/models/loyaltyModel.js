import { pool } from '../config/db.js';

export const getLoyaltyPrograms = async () => {
  const [rows] = await pool.query('SELECT * FROM loyalty_programs');
  return rows;
};

export const getCustomerPoints = async (customerId) => {
  const [rows] = await pool.query(`
    SELECT lpt.*, lp.name as program_name
    FROM loyalty_program_transactions lpt
    JOIN loyalty_programs lp ON lpt.program_id = lp.id
    WHERE lpt.customer_id = ?
    ORDER BY lpt.created_at DESC
  `, [customerId]);
  return rows;
};
