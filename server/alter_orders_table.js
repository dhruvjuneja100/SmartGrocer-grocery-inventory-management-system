import mysql from 'mysql2/promise';

async function alterOrdersTable() {
  console.log('Connecting to database...');
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'sg_inventory',
    multipleStatements: true
  });

  try {
    console.log('Checking orders table structure...');
    const [columns] = await connection.query('SHOW COLUMNS FROM orders');
    const columnNames = columns.map(col => col.Field);
    
    console.log('Current columns:', columnNames);
    
    // Check if subtotal_amount column exists
    if (!columnNames.includes('subtotal_amount')) {
      console.log('Adding missing subtotal_amount column...');
      await connection.query('ALTER TABLE orders ADD COLUMN subtotal_amount DECIMAL(10, 2) DEFAULT 0 AFTER total_amount');
      console.log('subtotal_amount column added successfully');
    } else {
      console.log('subtotal_amount column already exists');
    }
    
    // Check if discount_amount column exists
    if (!columnNames.includes('discount_amount')) {
      console.log('Adding missing discount_amount column...');
      await connection.query('ALTER TABLE orders ADD COLUMN discount_amount DECIMAL(10, 2) DEFAULT 0 AFTER subtotal_amount');
      console.log('discount_amount column added successfully');
    } else {
      console.log('discount_amount column already exists');
    }
    
    // Check if promotion_id column exists
    if (!columnNames.includes('promotion_id')) {
      console.log('Adding missing promotion_id column...');
      await connection.query('ALTER TABLE orders ADD COLUMN promotion_id INT DEFAULT NULL AFTER discount_amount');
      console.log('promotion_id column added successfully');
    } else {
      console.log('promotion_id column already exists');
    }
    
    console.log('Orders table structure updated successfully!');
  } catch (error) {
    console.error('Error updating orders table:', error);
  } finally {
    await connection.end();
    console.log('Database connection closed');
  }
}

alterOrdersTable(); 