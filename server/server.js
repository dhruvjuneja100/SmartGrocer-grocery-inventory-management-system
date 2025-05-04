import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 5001;

// Configure CORS to allow requests from any origin
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Log requests for debugging
app.use((req, res, next) => {
  const requestBody = req.method === 'POST' || req.method === 'PUT' ? JSON.stringify(req.body) : '';
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${requestBody}`);
  next();
});

// Create MySQL connection pool with enhanced logging
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'sg_inventory',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Add pool events for debugging connection issues
pool.on('connection', (connection) => {
  console.log('New database connection established');
  
  connection.on('error', (err) => {
    console.error('Database connection error:', err);
  });
});

pool.on('acquire', (connection) => {
  console.log('Connection %d acquired', connection.threadId);
});

pool.on('enqueue', () => {
  console.log('Waiting for available connection slot');
});

pool.on('release', (connection) => {
  console.log('Connection %d released', connection.threadId);
});

// Middleware to check database connection
const checkDatabaseConnection = async (req, res, next) => {
  try {
    await pool.query('SELECT 1');
    next();
  } catch (error) {
    console.error('Database connection check failed:', error);
    res.status(503).json({ 
      success: false, 
      error: 'Database connection unavailable',
      details: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Apply database check middleware to all /api routes
app.use('/api', checkDatabaseConnection);

// Test database connection
app.get('/api/test', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error testing database connection:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Database health check route
app.get('/api/health', async (req, res) => {
  try {
    const startTime = Date.now();
    const [testResult] = await pool.query('SELECT 1 AS test');
    const responseTime = Date.now() - startTime;
    
    const [dbInfo] = await pool.query(`
      SELECT 
        COUNT(table_name) as tables_count, 
        table_schema as database_name
      FROM 
        information_schema.tables
      WHERE 
        table_schema = 'sg_inventory'
      GROUP BY 
        table_schema
    `);
    
    res.json({
      success: true,
      status: 'healthy',
      database: {
        connected: testResult[0].test === 1,
        responseTime: `${responseTime}ms`,
        name: dbInfo[0]?.database_name || 'sg_inventory',
        tables: dbInfo[0]?.tables_count || 0
      }
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({ 
      success: false, 
      status: 'unhealthy',
      error: error.message
    });
  }
});

// Products routes
app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, c.name as category 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, c.name as category 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(`Error fetching product ${req.params.id}:`, error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { name, sku, category, price, stock_quantity } = req.body;
    
    if (!name || !sku || !category || price === undefined || stock_quantity === undefined) {
      return res.status(400).json({ 
        success: false, 
        error: 'Required fields: name, sku, category, price, stock_quantity' 
      });
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
    
    const [result] = await pool.query(
      'INSERT INTO products (name, sku, category_id, price, stock_quantity) VALUES (?, ?, ?, ?, ?)',
      [name, sku, categoryId, price, stock_quantity]
    );
    
    const [newProduct] = await pool.query(`
      SELECT p.*, c.name as category 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `, [result.insertId]);
    
    res.status(201).json({ success: true, data: newProduct[0] });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const { name, sku, category, price, stock_quantity, status } = req.body;
    
    if (!name || !sku || !category || price === undefined || stock_quantity === undefined) {
      return res.status(400).json({ 
        success: false, 
        error: 'Required fields: name, sku, category, price, stock_quantity' 
      });
    }
    
    // First check if the product exists
    const [productRows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    
    if (productRows.length === 0) {
      return res.status(404).json({ success: false, error: 'Product not found' });
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
    
    // Update the product
    await pool.query(
      'UPDATE products SET name = ?, sku = ?, category_id = ?, price = ?, stock_quantity = ?, status = ? WHERE id = ?',
      [name, sku, categoryId, price, stock_quantity, status || 'active', req.params.id]
    );
    
    const [updatedProduct] = await pool.query(`
      SELECT p.*, c.name as category 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `, [req.params.id]);
    
    res.json({ success: true, data: updatedProduct[0] });
  } catch (error) {
    console.error(`Error updating product ${req.params.id}:`, error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add endpoint to update product status
app.patch('/api/products/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['active', 'inactive'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Required field: status (must be "active" or "inactive")' 
      });
    }
    
    // First check if the product exists
    const [productRows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    
    if (productRows.length === 0) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    // Update the product status
    await pool.query(
      'UPDATE products SET status = ? WHERE id = ?',
      [status, req.params.id]
    );
    
    const [updatedProduct] = await pool.query(`
      SELECT p.*, c.name as category 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `, [req.params.id]);
    
    res.json({ success: true, data: updatedProduct[0] });
  } catch (error) {
    console.error(`Error updating product status ${req.params.id}:`, error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    // First check if the product exists
    const [productRows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    
    if (productRows.length === 0) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    // Check if product is referenced in order_items
    const [orderItems] = await pool.query('SELECT COUNT(*) as count FROM order_items WHERE product_id = ?', [req.params.id]);
    
    // Check if product is referenced in inventory_transactions
    const [inventoryTxns] = await pool.query('SELECT COUNT(*) as count FROM inventory_transactions WHERE product_id = ?', [req.params.id]);
    
    if (orderItems[0].count > 0 || inventoryTxns[0].count > 0) {
      let errorMsg = 'Cannot delete product as it is referenced in ';
      if (orderItems[0].count > 0 && inventoryTxns[0].count > 0) {
        errorMsg += 'orders and inventory transactions';
      } else if (orderItems[0].count > 0) {
        errorMsg += 'orders';
      } else {
        errorMsg += 'inventory transactions';
      }
      errorMsg += '. Consider marking it as inactive instead.';
      
      return res.status(400).json({ 
        success: false, 
        error: errorMsg,
        constraint: true
      });
    }
    
    // Delete the product
    await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error(`Error deleting product ${req.params.id}:`, error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      constraint: error.message.includes('foreign key constraint') 
    });
  }
});

// Customers routes
app.get('/api/customers', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM customers');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/customers', async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Required fields: name, email' 
      });
    }
    
    const [result] = await pool.query(
      'INSERT INTO customers (name, email, phone, address) VALUES (?, ?, ?, ?)',
      [name, email, phone || null, address || null]
    );
    
    const [newCustomer] = await pool.query('SELECT * FROM customers WHERE id = ?', [result.insertId]);
    
    res.status(201).json({ success: true, data: newCustomer[0] });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add customer update endpoint
app.put('/api/customers/:id', async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Required fields: name, email' 
      });
    }
    
    // First check if the customer exists
    const [customerRows] = await pool.query('SELECT * FROM customers WHERE id = ?', [req.params.id]);
    
    if (customerRows.length === 0) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }
    
    // Update the customer
    await pool.query(
      'UPDATE customers SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?',
      [name, email, phone || null, address || null, req.params.id]
    );
    
    const [updatedCustomer] = await pool.query('SELECT * FROM customers WHERE id = ?', [req.params.id]);
    
    res.json({ success: true, data: updatedCustomer[0] });
  } catch (error) {
    console.error(`Error updating customer ${req.params.id}:`, error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add customer delete endpoint
app.delete('/api/customers/:id', async (req, res) => {
  try {
    // First check if the customer exists
    const [customerRows] = await pool.query('SELECT * FROM customers WHERE id = ?', [req.params.id]);
    
    if (customerRows.length === 0) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }
    
    // Check if customer has any orders
    const [orderRows] = await pool.query('SELECT COUNT(*) as count FROM orders WHERE customer_id = ?', [req.params.id]);
    
    if (orderRows[0].count > 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Cannot delete customer as they have existing orders. Consider deactivating the account instead.' 
      });
    }
    
    // Delete the customer
    await pool.query('DELETE FROM customers WHERE id = ?', [req.params.id]);
    
    res.json({ success: true, message: 'Customer deleted successfully' });
  } catch (error) {
    console.error(`Error deleting customer ${req.params.id}:`, error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Orders routes
app.get('/api/orders', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT o.*, c.name as customer_name 
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { customer_id, employee_id, order_date, status, total_amount, payment_method, notes } = req.body;
    
    if (!status || total_amount === undefined) {
      return res.status(400).json({ 
        success: false, 
        error: 'Required fields: status, total_amount' 
      });
    }
    
    const [result] = await pool.query(
      'INSERT INTO orders (customer_id, employee_id, order_date, status, total_amount, payment_method, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [customer_id || null, employee_id || null, order_date || new Date(), status, total_amount, payment_method || null, notes || null]
    );
    
    const [newOrder] = await pool.query(
      `SELECT o.*, c.name as customer_name 
       FROM orders o
       LEFT JOIN customers c ON o.customer_id = c.id
       WHERE o.id = ?`, 
      [result.insertId]
    );
    
    res.status(201).json({ success: true, data: newOrder[0] });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Order Items routes
app.get('/api/order-items/:orderId', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT oi.*, p.name as product_name, p.sku 
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [req.params.orderId]);
    
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(`Error fetching items for order ${req.params.orderId}:`, error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/order-items', async (req, res) => {
  try {
    console.log('Received order-item request:', JSON.stringify(req.body));
    const { order_id, product_id, quantity, unit_price } = req.body;
    
    // Convert data types explicitly
    const parsedOrderId = parseInt(order_id);
    const parsedProductId = parseInt(product_id);
    const parsedQuantity = parseInt(quantity);
    const parsedUnitPrice = parseFloat(unit_price);
    
    console.log('Parsed values:', {
      parsedOrderId, parsedProductId, parsedQuantity, parsedUnitPrice,
      typeOrderId: typeof order_id, 
      typeProductId: typeof product_id,
      typeQuantity: typeof quantity,
      typeUnitPrice: typeof unit_price
    });
    
    // Basic validation checks
    if (!order_id || !product_id || !quantity || unit_price === undefined) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing fields',
        missingFields: {
          order_id: !order_id,
          product_id: !product_id,
          quantity: !quantity,
          unit_price: unit_price === undefined
        }
      });
    }
    
    // Type validation checks
    if (isNaN(parsedOrderId) || isNaN(parsedProductId) || isNaN(parsedQuantity) || isNaN(parsedUnitPrice)) {
      console.error('Invalid data types in order-item request', {
        order_id, product_id, quantity, unit_price,
        parsed: { parsedOrderId, parsedProductId, parsedQuantity, parsedUnitPrice }
      });
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid number values',
        invalidFields: {
          order_id: isNaN(parsedOrderId),
          product_id: isNaN(parsedProductId),
          quantity: isNaN(parsedQuantity),
          unit_price: isNaN(parsedUnitPrice)
        }
      });
    }
    
    // Check if product exists and has enough stock
    const [productRows] = await pool.query(
      'SELECT id, name, stock_quantity FROM products WHERE id = ?',
      [parsedProductId]
    );
    
    if (productRows.length === 0) {
      return res.status(404).json({
        success: false,
        error: `Product with ID ${parsedProductId} not found`
      });
    }
    
    const product = productRows[0];
    
    if (product.stock_quantity < parsedQuantity) {
      return res.status(400).json({
        success: false,
        error: `Not enough stock for product ${product.name}. Requested: ${parsedQuantity}, Available: ${product.stock_quantity}`
      });
    }
    
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
        [parsedProductId, 'sale', parsedQuantity, parsedOrderId, `Order #${parsedOrderId}`]
      );
      
      await connection.commit();
      
      const [newItem] = await connection.query(
        `SELECT oi.*, p.name as product_name
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.id = ?`, 
        [result.insertId]
      );
      
      res.status(201).json({ success: true, data: newItem[0] });
    } catch (error) {
      await connection.rollback();
      console.error('Transaction error:', error);
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error creating order item:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Inventory Transactions routes
app.get('/api/inventory/transactions', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT it.id, it.product_id, it.quantity, it.transaction_type, 
             it.notes, it.created_at, p.name as product_name, p.sku
      FROM inventory_transactions it
      JOIN products p ON it.product_id = p.id
      ORDER BY it.created_at DESC
    `);
    
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching inventory transactions:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/inventory/transactions', async (req, res) => {
  try {
    const { product_id, transaction_type, quantity, reference_id, notes } = req.body;
    
    if (!product_id || !transaction_type || quantity === undefined) {
      return res.status(400).json({ 
        success: false, 
        error: 'Required fields: product_id, transaction_type, quantity' 
      });
    }
    
    // Validate transaction type
    const validTypes = ['purchase', 'sale', 'adjustment', 'return'];
    if (!validTypes.includes(transaction_type)) {
      return res.status(400).json({ 
        success: false, 
        error: `Invalid transaction type. Must be one of: ${validTypes.join(', ')}` 
      });
    }
    
    // Start a transaction
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      // 1. Add the inventory transaction
      const [result] = await connection.query(
        'INSERT INTO inventory_transactions (product_id, transaction_type, quantity, reference_id, notes) VALUES (?, ?, ?, ?, ?)',
        [product_id, transaction_type, quantity, reference_id || null, notes || null]
      );
      
      // 2. Update the product stock quantity based on transaction type
      let stockChange = 0;
      switch (transaction_type) {
        case 'purchase':
        case 'return':
          stockChange = quantity;
          break;
        case 'sale':
          stockChange = -quantity;
          break;
        case 'adjustment':
          stockChange = quantity; // Could be positive or negative
          break;
      }
      
      await connection.query(
        'UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?',
        [stockChange, product_id]
      );
      
      await connection.commit();
      
      const [newTransaction] = await connection.query(
        `SELECT it.*, p.name as product_name
         FROM inventory_transactions it
         JOIN products p ON it.product_id = p.id
         WHERE it.id = ?`, 
        [result.insertId]
      );
      
      res.status(201).json({ success: true, data: newTransaction[0] });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error creating inventory transaction:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Suppliers routes
app.get('/api/suppliers', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM suppliers');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/suppliers', async (req, res) => {
  try {
    const { name, contact_person, email, phone, address } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Required fields: name, email' 
      });
    }
    
    const [result] = await pool.query(
      'INSERT INTO suppliers (name, contact_person, email, phone, address) VALUES (?, ?, ?, ?, ?)',
      [name, contact_person || null, email, phone || null, address || null]
    );
    
    const [newSupplier] = await pool.query('SELECT * FROM suppliers WHERE id = ?', [result.insertId]);
    
    res.status(201).json({ success: true, data: newSupplier[0] });
  } catch (error) {
    console.error('Error creating supplier:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add supplier update endpoint
app.put('/api/suppliers/:id', async (req, res) => {
  try {
    const { name, contact_person, email, phone, address } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Required fields: name, email' 
      });
    }
    
    // First check if the supplier exists
    const [supplierRows] = await pool.query('SELECT * FROM suppliers WHERE id = ?', [req.params.id]);
    
    if (supplierRows.length === 0) {
      return res.status(404).json({ success: false, error: 'Supplier not found' });
    }
    
    // Update the supplier
    await pool.query(
      'UPDATE suppliers SET name = ?, contact_person = ?, email = ?, phone = ?, address = ? WHERE id = ?',
      [name, contact_person || null, email, phone || null, address || null, req.params.id]
    );
    
    const [updatedSupplier] = await pool.query('SELECT * FROM suppliers WHERE id = ?', [req.params.id]);
    
    res.json({ success: true, data: updatedSupplier[0] });
  } catch (error) {
    console.error(`Error updating supplier ${req.params.id}:`, error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add supplier delete endpoint
app.delete('/api/suppliers/:id', async (req, res) => {
  try {
    // First check if the supplier exists
    const [supplierRows] = await pool.query('SELECT * FROM suppliers WHERE id = ?', [req.params.id]);
    
    if (supplierRows.length === 0) {
      return res.status(404).json({ success: false, error: 'Supplier not found' });
    }
    
    // Delete the supplier
    await pool.query('DELETE FROM suppliers WHERE id = ?', [req.params.id]);
    
    res.json({ success: true, message: 'Supplier deleted successfully' });
  } catch (error) {
    console.error(`Error deleting supplier ${req.params.id}:`, error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Employees routes
app.get('/api/employees', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM employees');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/employees', async (req, res) => {
  try {
    const { name, position, email, phone, hire_date } = req.body;
    
    if (!name || !position || !email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Required fields: name, position, email' 
      });
    }
    
    const [result] = await pool.query(
      'INSERT INTO employees (name, position, email, phone, hire_date) VALUES (?, ?, ?, ?, ?)',
      [name, position, email, phone || null, hire_date || new Date()]
    );
    
    const [newEmployee] = await pool.query('SELECT * FROM employees WHERE id = ?', [result.insertId]);
    
    res.status(201).json({ success: true, data: newEmployee[0] });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add new API routes for promotions
app.get('/api/promotions', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM promotions ORDER BY start_date DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching promotions:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch promotions' });
  }
});

app.get('/api/promotions/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM promotions WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Promotion not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(`Error fetching promotion ${req.params.id}:`, error);
    res.status(500).json({ success: false, error: 'Failed to fetch promotion' });
  }
});

app.post('/api/promotions', async (req, res) => {
  try {
    const { name, description, discount_type, discount_value, min_purchase_amount, start_date, end_date, is_active } = req.body;
    
    const [result] = await pool.query(
      'INSERT INTO promotions (name, description, discount_type, discount_value, min_purchase_amount, start_date, end_date, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, description, discount_type, discount_value, min_purchase_amount, start_date, end_date, is_active]
    );
    
    const [newPromotion] = await pool.query('SELECT * FROM promotions WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, data: newPromotion[0] });
  } catch (error) {
    console.error('Error creating promotion:', error);
    res.status(500).json({ success: false, error: 'Failed to create promotion' });
  }
});

app.get('/api/promotions/:id/products', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.* FROM products p
      JOIN promotion_products pp ON p.id = pp.product_id
      WHERE pp.promotion_id = ?
    `, [req.params.id]);
    
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(`Error fetching products for promotion ${req.params.id}:`, error);
    res.status(500).json({ success: false, error: 'Failed to fetch promotion products' });
  }
});

app.post('/api/promotions/:id/products', async (req, res) => {
  try {
    const { product_id } = req.body;
    
    // Check if the product and promotion exist
    const [productRows] = await pool.query('SELECT * FROM products WHERE id = ?', [product_id]);
    const [promotionRows] = await pool.query('SELECT * FROM promotions WHERE id = ?', [req.params.id]);
    
    if (productRows.length === 0) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    if (promotionRows.length === 0) {
      return res.status(404).json({ success: false, error: 'Promotion not found' });
    }
    
    // Check if the product is already in the promotion
    const [existingRows] = await pool.query(
      'SELECT * FROM promotion_products WHERE promotion_id = ? AND product_id = ?',
      [req.params.id, product_id]
    );
    
    if (existingRows.length > 0) {
      return res.status(400).json({ success: false, error: 'Product already in promotion' });
    }
    
    // Add the product to the promotion
    await pool.query(
      'INSERT INTO promotion_products (promotion_id, product_id) VALUES (?, ?)',
      [req.params.id, product_id]
    );
    
    res.status(201).json({ success: true, data: { promotion_id: req.params.id, product_id } });
  } catch (error) {
    console.error('Error adding product to promotion:', error);
    res.status(500).json({ success: false, error: 'Failed to add product to promotion' });
  }
});

// Store Locations API routes
app.get('/api/store-locations', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM store_locations ORDER BY name');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching store locations:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch store locations' });
  }
});

app.get('/api/store-locations/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM store_locations WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Store location not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(`Error fetching store location ${req.params.id}:`, error);
    res.status(500).json({ success: false, error: 'Failed to fetch store location' });
  }
});

app.get('/api/store-locations/:id/inventory', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT spi.*, p.name, p.sku, p.price, c.name as category 
      FROM store_product_inventory spi
      JOIN products p ON spi.product_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE spi.store_id = ?
    `, [req.params.id]);
    
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(`Error fetching inventory for store ${req.params.id}:`, error);
    res.status(500).json({ success: false, error: 'Failed to fetch store inventory' });
  }
});

// Delivery API routes
app.get('/api/delivery/zones', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM delivery_zones ORDER BY city, name');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching delivery zones:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch delivery zones' });
  }
});

app.get('/api/delivery/vehicles', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM delivery_vehicles ORDER BY vehicle_number');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching delivery vehicles:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch delivery vehicles' });
  }
});

app.get('/api/delivery/assignments', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT da.*, o.order_date, c.name as customer_name, dz.name as zone_name, 
             dv.vehicle_number, dv.vehicle_type
      FROM delivery_assignments da
      JOIN orders o ON da.order_id = o.id
      JOIN customers c ON o.customer_id = c.id
      JOIN delivery_zones dz ON da.delivery_zone_id = dz.id
      JOIN delivery_vehicles dv ON da.vehicle_id = dv.id
      ORDER BY da.scheduled_date DESC
    `);
    
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching delivery assignments:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch delivery assignments' });
  }
});

// Loyalty API routes
app.get('/api/loyalty/programs', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM loyalty_programs');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching loyalty programs:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch loyalty programs' });
  }
});

app.get('/api/loyalty/customers/:id/points', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT lpt.*, lp.name as program_name
      FROM loyalty_program_transactions lpt
      JOIN loyalty_programs lp ON lpt.program_id = lp.id
      WHERE lpt.customer_id = ?
      ORDER BY lpt.created_at DESC
    `, [req.params.id]);
    
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(`Error fetching loyalty points for customer ${req.params.id}:`, error);
    res.status(500).json({ success: false, error: 'Failed to fetch loyalty points' });
  }
});

// Feedback API routes
app.get('/api/feedback', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT f.*, c.name as customer_name, p.name as product_name
      FROM feedback f
      LEFT JOIN customers c ON f.customer_id = c.id
      LEFT JOIN products p ON f.product_id = p.id
      ORDER BY f.feedback_date DESC
    `);
    
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch feedback' });
  }
});

app.get('/api/feedback/products/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT f.*, c.name as customer_name
      FROM feedback f
      LEFT JOIN customers c ON f.customer_id = c.id
      WHERE f.product_id = ? AND f.is_public = true AND f.status = 'approved'
      ORDER BY f.feedback_date DESC
    `, [req.params.id]);
    
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(`Error fetching feedback for product ${req.params.id}:`, error);
    res.status(500).json({ success: false, error: 'Failed to fetch product feedback' });
  }
});

// After the database setup check, let's add a route for direct access to inventory:
app.get('/api/debug/products', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products');
    res.json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    console.error('Error getting products for debug:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add a route to help add a product that might be missing:
app.post('/api/debug/add-product', async (req, res) => {
  try {
    const { name, sku, category, price, stock_quantity } = req.body;
    
    // First check if product already exists by name
    const [existingProducts] = await pool.query('SELECT * FROM products WHERE name = ?', [name]);
    
    if (existingProducts.length > 0) {
      return res.json({ success: true, message: 'Product already exists', data: existingProducts[0] });
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
      [name, sku || `SKU-${Date.now()}`, categoryId, price || 0, stock_quantity || 0]
    );
    
    const [newProduct] = await pool.query(`
      SELECT p.*, c.name as category 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `, [result.insertId]);
    
    res.status(201).json({ success: true, data: newProduct[0] });
  } catch (error) {
    console.error('Error adding debug product:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add new API routes for reports
app.get('/api/reports/sales-summary', async (req, res) => {
  try {
    // Get total sales
    const [salesTotal] = await pool.query(`
      SELECT SUM(total_amount) as total_sales
      FROM orders
    `);
    
    // Get average profit margin (simplified calculation)
    const profitMargin = 0.34; // 34% average profit margin
    const totalSales = salesTotal[0].total_sales || 0;
    const totalProfit = totalSales * profitMargin;
    
    // Get order count
    const [orderCount] = await pool.query(`
      SELECT COUNT(*) as count
      FROM orders
    `);
    
    // Calculate average order value
    const avgOrderValue = orderCount[0].count > 0 
      ? totalSales / orderCount[0].count 
      : 0;
    
    // Monthly sales data (simplified with mock data)
    const monthlySales = [
      { month: 'Jan', sales: 8500, profit: 2800 },
      { month: 'Feb', sales: 9200, profit: 3100 },
      { month: 'Mar', sales: 11000, profit: 3600 },
      { month: 'Apr', sales: 10500, profit: 3500 },
      { month: 'May', sales: 12000, profit: 4000 },
      { month: 'Jun', sales: 13500, profit: 4500 },
      { month: 'Jul', sales: 12800, profit: 4200 },
      { month: 'Aug', sales: 11500, profit: 3800 },
      { month: 'Sep', sales: 12000, profit: 4000 },
      { month: 'Oct', sales: 13000, profit: 4300 },
      { month: 'Nov', sales: 12500, profit: 4100 },
      { month: 'Dec', sales: 14200, profit: 4600 }
    ];
    
    // Get top products by sales
    const [topProducts] = await pool.query(`
      SELECT p.name, SUM(oi.quantity * oi.unit_price) as sales, SUM(oi.quantity) as quantity
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      GROUP BY p.id
      ORDER BY sales DESC
      LIMIT 5
    `);
    
    res.json({
      success: true,
      data: {
        totalSales,
        totalProfit,
        orderCount: orderCount[0].count,
        averageOrderValue: avgOrderValue,
        monthlySales,
        topProducts: topProducts.map(p => ({
          name: p.name,
          sales: parseFloat(p.sales) || 0,
          quantity: parseInt(p.quantity) || 0
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching sales summary:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch sales summary' });
  }
});

app.get('/api/reports/inventory-summary', async (req, res) => {
  try {
    // Get total inventory value
    const [inventoryTotal] = await pool.query(`
      SELECT SUM(stock_quantity * price) as total_value, COUNT(*) as total_items
      FROM products
    `);
    
    // Get low stock items count
    const [lowStockCount] = await pool.query(`
      SELECT COUNT(*) as count
      FROM products
      WHERE stock_quantity < 20
    `);
    
    // Category distribution
    const [categoryDistribution] = await pool.query(`
      SELECT category, SUM(stock_quantity * price) as value
      FROM products
      GROUP BY category
      ORDER BY value DESC
    `);
    
    // Calculate total for percentages
    const totalValue = parseFloat(inventoryTotal[0].total_value) || 0;
    
    // Recent purchases (simplified with mock data)
    const recentPurchases = [
      { date: '2023-04-25', value: 12500, supplier: 'Amul Distributors' },
      { date: '2023-04-18', value: 18700, supplier: 'Coca-Cola Bottlers' },
      { date: '2023-04-12', value: 9800, supplier: 'Haldiram Foods' },
      { date: '2023-04-05', value: 14200, supplier: 'P&G Distributors' },
      { date: '2023-03-29', value: 11500, supplier: 'Britannia Agents' }
    ];
    
    res.json({
      success: true,
      data: {
        totalValue,
        totalItems: inventoryTotal[0].total_items || 0,
        lowStockItems: lowStockCount[0].count || 0,
        averageStockValue: totalValue / (inventoryTotal[0].total_items || 1),
        categoryDistribution: categoryDistribution.map(cat => ({
          category: cat.category || 'Uncategorized',
          value: parseFloat(cat.value) || 0,
          percentage: totalValue > 0 ? (parseFloat(cat.value) / totalValue * 100) : 0
        })),
        recentPurchases
      }
    });
  } catch (error) {
    console.error('Error fetching inventory summary:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch inventory summary' });
  }
});

app.get('/api/reports/financial-summary', async (req, res) => {
  try {
    // Get total sales revenue
    const [revenue] = await pool.query(`
      SELECT SUM(total_amount) as total_revenue
      FROM orders
    `);
    
    const totalRevenue = parseFloat(revenue[0].total_revenue) || 0;
    
    // Simplified expense calculation
    const totalExpenses = totalRevenue * 0.66; // 66% of revenue goes to expenses
    const netProfit = totalRevenue - totalExpenses;
    
    // Expense breakdown (simplified with reasonable estimates)
    const expenseBreakdown = [
      { category: 'Inventory Purchase', value: totalExpenses * 0.758, percentage: 75.8 },
      { category: 'Employee Salaries', value: totalExpenses * 0.145, percentage: 14.5 },
      { category: 'Rent', value: totalExpenses * 0.058, percentage: 5.8 },
      { category: 'Utilities', value: totalExpenses * 0.022, percentage: 2.2 },
      { category: 'Marketing', value: totalExpenses * 0.012, percentage: 1.2 },
      { category: 'Others', value: totalExpenses * 0.005, percentage: 0.5 }
    ];
    
    // Monthly financials (simplified with mock data)
    const monthlyFinancials = [
      { month: 'Jan', revenue: 92000, expenses: 65000, profit: 27000 },
      { month: 'Feb', revenue: 98000, expenses: 68000, profit: 30000 },
      { month: 'Mar', revenue: 110000, expenses: 74000, profit: 36000 },
      { month: 'Apr', revenue: 105000, expenses: 71000, profit: 34000 },
      { month: 'May', revenue: 112000, expenses: 75000, profit: 37000 },
      { month: 'Jun', revenue: 118000, expenses: 79000, profit: 39000 },
      { month: 'Jul', revenue: 115000, expenses: 77000, profit: 38000 },
      { month: 'Aug', revenue: 108000, expenses: 72000, profit: 36000 },
      { month: 'Sep', revenue: 110000, expenses: 74000, profit: 36000 },
      { month: 'Oct', revenue: 114000, expenses: 76000, profit: 38000 },
      { month: 'Nov', revenue: 110000, expenses: 74000, profit: 36000 },
      { month: 'Dec', revenue: 120000, expenses: 81000, profit: 39000 }
    ];
    
    res.json({
      success: true,
      data: {
        totalRevenue,
        totalExpenses,
        netProfit,
        expenseBreakdown,
        monthlyFinancials
      }
    });
  } catch (error) {
    console.error('Error fetching financial summary:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch financial summary' });
  }
});

app.get('/api/reports/employee-summary', async (req, res) => {
  try {
    // Get employee count
    const [employeeCount] = await pool.query(`
      SELECT COUNT(*) as count
      FROM employees
    `);
    
    const totalEmployees = employeeCount[0].count || 0;
    
    // Simplified salary data
    const totalSalaries = 120000; // Estimated total monthly salaries
    const averageSalary = totalEmployees > 0 ? totalSalaries / totalEmployees : 0;
    
    // Department distribution (simplified with mock data)
    const departmentDistribution = [
      { department: 'Sales', count: 8, percentage: 33.3 },
      { department: 'Inventory', count: 6, percentage: 25.0 },
      { department: 'Cashier', count: 5, percentage: 20.8 },
      { department: 'Management', count: 3, percentage: 12.5 },
      { department: 'Delivery', count: 2, percentage: 8.4 }
    ];
    
    // Salary distribution (simplified with mock data)
    const salaryDistribution = [
      { range: '< ₹3000', count: 3 },
      { range: '₹3000-₹5000', count: 9 },
      { range: '₹5000-₹7000', count: 7 },
      { range: '₹7000-₹10000', count: 3 },
      { range: '> ₹10000', count: 2 }
    ];
    
    res.json({
      success: true,
      data: {
        totalEmployees,
        totalSalaries,
        averageSalary,
        departmentDistribution,
        salaryDistribution
      }
    });
  } catch (error) {
    console.error('Error fetching employee summary:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch employee summary' });
  }
});

app.get('/api/reports/customer-summary', async (req, res) => {
  try {
    // Get total customers
    const [customerCount] = await pool.query(`
      SELECT COUNT(*) as count
      FROM customers
    `);
    
    const totalCustomers = customerCount[0].count || 0;
    
    // New customers in the last 30 days
    const [newCustomers] = await pool.query(`
      SELECT COUNT(*) as count
      FROM customers
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    `);
    
    // Active customers (made an order in the last 90 days)
    const [activeCustomers] = await pool.query(`
      SELECT COUNT(DISTINCT c.id) as count
      FROM customers c
      JOIN orders o ON c.id = o.customer_id
      WHERE o.order_date >= DATE_SUB(CURDATE(), INTERVAL 90 DAY)
    `);
    
    // Customer growth (simplified with mock data)
    const customerGrowth = [
      { month: 'Jan', customers: 725 },
      { month: 'Feb', customers: 742 },
      { month: 'Mar', customers: 760 },
      { month: 'Apr', customers: 778 },
      { month: 'May', customers: 790 },
      { month: 'Jun', customers: 805 },
      { month: 'Jul', customers: 815 },
      { month: 'Aug', customers: 825 },
      { month: 'Sep', customers: 832 },
      { month: 'Oct', customers: 840 },
      { month: 'Nov', customers: 845 },
      { month: 'Dec', customers: 850 }
    ];
    
    // Top customers by order value
    const [topCustomers] = await pool.query(`
      SELECT c.name, COUNT(o.id) as orders, SUM(o.total_amount) as value
      FROM customers c
      JOIN orders o ON c.id = o.customer_id
      GROUP BY c.id
      ORDER BY value DESC
      LIMIT 5
    `);
    
    res.json({
      success: true,
      data: {
        totalCustomers,
        newCustomers: newCustomers[0].count || 0,
        activeCustomers: activeCustomers[0].count || 0,
        customerGrowth,
        topCustomers: topCustomers.map(c => ({
          name: c.name,
          orders: parseInt(c.orders) || 0,
          value: parseFloat(c.value) || 0
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching customer summary:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch customer summary' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Check database connection on startup
  pool.query('SELECT 1')
    .then(() => {
      console.log('✅ Database connection successful');
      
      // Test table accessibility
      return pool.query('SHOW TABLES');
    })
    .then(([tables]) => {
      console.log('Tables in database:');
      tables.forEach(table => {
        console.log(`- ${Object.values(table)[0]}`);
      });
      console.log('Server ready to accept requests');
    })
    .catch(err => console.error('❌ Database connection failed:', err));
});

// Export pool for use in other files
export { pool }; 