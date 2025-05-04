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
    
    // Create orders table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customer_id INT,
        employee_id INT,
        order_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        status ENUM('pending', 'processing', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
        total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
        payment_method VARCHAR(50),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
        FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE SET NULL
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

createTables()
  .then(() => console.log('Setup complete'))
  .catch(err => console.error('Setup failed:', err)); 