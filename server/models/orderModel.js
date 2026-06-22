import { pool } from '../config/db.js';

export const getOrders = async () => {
  const [rows] = await pool.query(`
    SELECT o.*, c.name as customer_name 
    FROM orders o
    LEFT JOIN customers c ON o.customer_id = c.id
  `);
  return rows;
};

export const createOrder = async (orderData) => {
  const { customer_id, employee_id, order_date, status, total_amount, subtotal_amount, discount_amount, promotion_id, payment_method, notes } = orderData;
  
  const [result] = await pool.query(
    `INSERT INTO orders (
      customer_id, employee_id, order_date, status, 
      total_amount, subtotal_amount, discount_amount, promotion_id, 
      payment_method, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      customer_id || null, 
      employee_id || null, 
      order_date || new Date(), 
      status, 
      total_amount, 
      subtotal_amount || total_amount, 
      discount_amount || 0, 
      promotion_id || null, 
      payment_method || null, 
      notes || null
    ]
  );
  
  const [newOrder] = await pool.query(
    `SELECT o.*, c.name as customer_name, p.name as promotion_name 
     FROM orders o
     LEFT JOIN customers c ON o.customer_id = c.id
     LEFT JOIN promotions p ON o.promotion_id = p.id
     WHERE o.id = ?`, 
    [result.insertId]
  );
  
  return newOrder[0];
};

export const getOrderItems = async (orderId) => {
  const [rows] = await pool.query(`
    SELECT oi.*, p.name as product_name, p.sku 
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = ?
  `, [orderId]);
  
  return rows;
};

export const createOrderItem = async (itemData) => {
  const { order_id, product_id, quantity, unit_price } = itemData;
  const parsedOrderId = parseInt(order_id);
  const parsedProductId = parseInt(product_id);
  const parsedQuantity = parseInt(quantity);
  const parsedUnitPrice = parseFloat(unit_price);
  
  // Start a transaction
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    // 1. Add the order item
    const [result] = await connection.query(
      'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
      [parsedOrderId, parsedProductId, parsedQuantity, parsedUnitPrice]
    );
    
    // 2. Update the product stock quantity
    await connection.query(
      'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
      [parsedQuantity, parsedProductId]
    );
    
    // 3. Record the inventory transaction
    await connection.query(
      'INSERT INTO inventory_transactions (product_id, transaction_type, quantity, reference_id, notes) VALUES (?, ?, ?, ?, ?)',
      [parsedProductId, 'sale', parsedQuantity, parsedOrderId, \`Order #\${parsedOrderId}\`]
    );
    
    await connection.commit();
    
    const [newItem] = await connection.query(
      `SELECT oi.*, p.name as product_name
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.id = ?`, 
      [result.insertId]
    );
    
    return newItem[0];
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
