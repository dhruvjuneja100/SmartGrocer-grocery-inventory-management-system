import mysql from 'mysql2/promise';
import 'dotenv/config';

// Create MySQL connection
const createTables = async () => {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    multipleStatements: true
  });

  try {
    // Create database if not exists
    await connection.query('CREATE DATABASE IF NOT EXISTS sg_inventory');
    console.log('Database sg_inventory created or already exists');
    
    // Use the database
    await connection.query('USE sg_inventory');
    console.log('Using database sg_inventory');
    
    // Create products table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        sku VARCHAR(50) UNIQUE NOT NULL,
        category_id INT,
        price DECIMAL(10, 2) NOT NULL DEFAULT 0,
        stock_quantity INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);
    console.log('Products table created or already exists');
    
    // Create categories table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Categories table created or already exists');
    
    // Create customers table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20),
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Customers table created or already exists');
    
    // Create employees table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS employees (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        position VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20),
        hire_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Employees table created or already exists');
    
    // Create promotions table if it doesn't exist (for future use)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS promotions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        discount_type ENUM('percentage', 'fixed_amount', 'buy_x_get_y') NOT NULL,
        discount_value DECIMAL(10,2) NOT NULL,
        min_purchase_amount DECIMAL(10,2),
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);
    console.log('Promotions table created or already exists');
    
    // Create orders table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customer_id INT,
        employee_id INT,
        order_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        status ENUM('pending', 'processing', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
        total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
        subtotal_amount DECIMAL(10, 2) DEFAULT 0,
        discount_amount DECIMAL(10, 2) DEFAULT 0,
        promotion_id INT,
        payment_method VARCHAR(50),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
        FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE SET NULL,
        FOREIGN KEY (promotion_id) REFERENCES promotions(id) ON DELETE SET NULL
      );
    `);
    console.log('Orders table created or already exists');
    
    // Create order_items table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL,
        unit_price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
      );
    `);
    console.log('Order_items table created or already exists');
    
    // Create inventory_transactions table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS inventory_transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        transaction_type ENUM('purchase', 'sale', 'adjustment', 'return') NOT NULL,
        quantity INT NOT NULL,
        reference_id INT,
        notes TEXT,
        transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
      );
    `);
    console.log('Inventory_transactions table created or already exists');
    
    // Create delivery_zones table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS delivery_zones (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        city VARCHAR(100) NOT NULL,
        pincode_range VARCHAR(50) NOT NULL,
        delivery_charge DECIMAL(10, 2) NOT NULL DEFAULT 0,
        min_order_free_delivery DECIMAL(10, 2) DEFAULT NULL,
        estimated_delivery_time VARCHAR(50) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Delivery_zones table created or already exists');
    
    // Create delivery_vehicles table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS delivery_vehicles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        vehicle_number VARCHAR(20) NOT NULL,
        vehicle_type ENUM('bike', 'van', 'truck') NOT NULL,
        model VARCHAR(100) NOT NULL,
        driver_name VARCHAR(100) NOT NULL,
        driver_phone VARCHAR(20) NOT NULL,
        status ENUM('available', 'on_delivery', 'maintenance', 'inactive') DEFAULT 'available',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Delivery_vehicles table created or already exists');
    
    // Create delivery_assignments table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS delivery_assignments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        vehicle_id INT NOT NULL,
        employee_id INT NOT NULL,
        delivery_zone_id INT NOT NULL,
        scheduled_date DATETIME NOT NULL,
        delivery_status ENUM('pending', 'in_transit', 'delivered', 'failed', 'returned') DEFAULT 'pending',
        actual_delivery_time DATETIME DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (vehicle_id) REFERENCES delivery_vehicles(id) ON DELETE RESTRICT,
        FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE RESTRICT,
        FOREIGN KEY (delivery_zone_id) REFERENCES delivery_zones(id) ON DELETE RESTRICT
      );
    `);
    console.log('Delivery_assignments table created or already exists');
    
    // Insert sample data if tables are empty
    const [productsCount] = await connection.query('SELECT COUNT(*) as count FROM products');
    if (productsCount[0].count === 0) {
      // Insert sample categories
      await connection.query(`
        INSERT INTO categories (name) VALUES 
        ('Fruits'), 
        ('Vegetables'), 
        ('Dairy'), 
        ('Bakery'),
        ('Meat');
      `);
      console.log('Sample categories added');
      
      // Get category IDs
      const [categories] = await connection.query('SELECT id, name FROM categories');
      const categoryMap = {};
      categories.forEach(cat => {
        categoryMap[cat.name] = cat.id;
      });
      
      // Insert sample products
      await connection.query(`
        INSERT INTO products (name, sku, category_id, price, stock_quantity) VALUES 
        ('Fresh Bananas', 'FRT-001', ?, 50.00, 100),
        ('Apples', 'FRT-002', ?, 80.00, 150),
        ('Tomatoes', 'VEG-001', ?, 40.00, 80),
        ('Chicken Breast', 'MET-001', ?, 180.00, 50),
        ('Whole Milk', 'DRY-001', ?, 60.00, 40),
        ('Bread', 'BAK-001', ?, 35.00, 60);
      `, [
        categoryMap['Fruits'], 
        categoryMap['Fruits'], 
        categoryMap['Vegetables'], 
        categoryMap['Meat'], 
        categoryMap['Dairy'], 
        categoryMap['Bakery']
      ]);
      console.log('Sample products added');
      
      // Insert sample customers
      await connection.query(`
        INSERT INTO customers (name, email, phone, address) VALUES 
        ('John Doe', 'john.doe@example.com', '123-456-7890', '123 Main St'),
        ('Jane Smith', 'jane.smith@example.com', '098-765-4321', '456 Oak Ave');
      `);
      console.log('Sample customers added');
      
      // Insert sample employees
      await connection.query(`
        INSERT INTO employees (name, position, email, phone, hire_date) VALUES 
        ('Pooja Malhotra', 'Cashier', 'pooja@smartgrocer.com', '555-123-4567', '2023-01-15'),
        ('Raj Kumar', 'Manager', 'raj@smartgrocer.com', '555-987-6543', '2022-11-01');
      `);
      console.log('Sample employees added');
      
      // Insert sample promotions
      await connection.query(`
        INSERT INTO promotions (name, description, discount_type, discount_value, min_purchase_amount, start_date, end_date, is_active) VALUES 
        ('Welcome Discount', '10% off your first purchase', 'percentage', 10.00, 0.00, '2023-01-01', '2025-12-31', true),
        ('Summer Sale', 'Save ₹100 on purchases over ₹1000', 'fixed_amount', 100.00, 1000.00, '2023-01-01', '2025-12-31', true);
      `);
      console.log('Sample promotions added');
      
      // Insert sample delivery zones
      await connection.query(`
        INSERT INTO delivery_zones (name, city, pincode_range, delivery_charge, min_order_free_delivery, estimated_delivery_time, is_active) VALUES 
        ('Bandra', 'Mumbai', '400050-400051', 40.00, 500.00, '30-45 mins', true),
        ('Andheri West', 'Mumbai', '400053-400054', 45.00, 600.00, '40-60 mins', true),
        ('Powai', 'Mumbai', '400072-400076', 60.00, 700.00, '45-60 mins', true),
        ('Gurgaon', 'Delhi NCR', '122001-122011', 50.00, 650.00, '35-55 mins', true);
      `);
      console.log('Sample delivery zones added');
      
      // Insert sample delivery vehicles
      await connection.query(`
        INSERT INTO delivery_vehicles (vehicle_number, vehicle_type, model, driver_name, driver_phone, status) VALUES 
        ('MH01UV9012', 'van', 'Maruti Eeco', 'Amit Singh', '9876543210', 'available'),
        ('DL10WX3456', 'van', 'Tata Ace', 'Karthik Iyer', '8765432109', 'available'),
        ('DL13CD5678', 'bike', 'Bajaj Pulsar', 'Deepa Gupta', '7654321098', 'available'),
        ('DL03EF9012', 'van', 'Mahindra Supro', 'Rajesh Kumar', '6543210987', 'available');
      `);
      console.log('Sample delivery vehicles added');
      
    } else {
      console.log('Sample data already exists, skipping data insertion');
    }
    
    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await connection.end();
  }
};

// Add new fields to tables for feature updates
const alterTables = async (connection) => {
  try {
    console.log('Checking and updating table structures...');
    
    // Add status column to products table if it doesn't exist
    try {
      const [columns] = await connection.query(`
        SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'products' 
        AND COLUMN_NAME = 'status'
      `);
      
      if (columns.length === 0) {
        console.log('Adding status column to products table...');
        await connection.query(`
          ALTER TABLE products 
          ADD COLUMN status ENUM('active', 'inactive') DEFAULT 'active'
        `);
        console.log('Status column added to products table.');
      } else {
        console.log('Status column already exists in products table.');
      }
    } catch (error) {
      console.error('Error checking/adding status column:', error);
    }
    
    // Add promotion-related fields to orders table if they don't exist
    try {
      // Check for subtotal_amount column
      const [subtotalColumns] = await connection.query(`
        SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'orders' 
        AND COLUMN_NAME = 'subtotal_amount'
      `);
      
      if (subtotalColumns.length === 0) {
        console.log('Adding subtotal_amount column to orders table...');
        await connection.query(`
          ALTER TABLE orders 
          ADD COLUMN subtotal_amount DECIMAL(10,2) DEFAULT 0
        `);
        console.log('subtotal_amount column added to orders table.');
      } else {
        console.log('subtotal_amount column already exists in orders table.');
      }
      
      // Check for discount_amount column
      const [discountColumns] = await connection.query(`
        SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'orders' 
        AND COLUMN_NAME = 'discount_amount'
      `);
      
      if (discountColumns.length === 0) {
        console.log('Adding discount_amount column to orders table...');
        await connection.query(`
          ALTER TABLE orders 
          ADD COLUMN discount_amount DECIMAL(10,2) DEFAULT 0
        `);
        console.log('discount_amount column added to orders table.');
      } else {
        console.log('discount_amount column already exists in orders table.');
      }
      
      // Check for promotion_id column
      const [promotionColumns] = await connection.query(`
        SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'orders' 
        AND COLUMN_NAME = 'promotion_id'
      `);
      
      if (promotionColumns.length === 0) {
        console.log('Adding promotion_id column to orders table...');
        await connection.query(`
          ALTER TABLE orders 
          ADD COLUMN promotion_id INT,
          ADD FOREIGN KEY (promotion_id) REFERENCES promotions(id)
        `);
        console.log('promotion_id column added to orders table.');
      } else {
        console.log('promotion_id column already exists in orders table.');
      }
    } catch (error) {
      console.error('Error checking/adding promotion-related columns:', error);
    }
    
    console.log('Table structure updates completed.');
  } catch (error) {
    console.error('Error in alterTables function:', error);
  }
};

createTables()
  .then(() => console.log('Setup complete'))
  .catch(err => console.error('Setup failed:', err));

// Call the alterTables function
if (typeof module !== 'undefined' && !module.parent) {
  (async () => {
    const mysql = require('mysql2/promise');
    try {
      const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'admin',
        database: 'sg_inventory',
        multipleStatements: true
      });
      
      await alterTables(connection);
      await connection.end();
      
      console.log('Table structure update script completed successfully.');
    } catch (error) {
      console.error('Error in main execution:', error);
    }
  })();
} 