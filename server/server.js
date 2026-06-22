import express from 'express';
import cors from 'cors';
import { pool } from './config/db.js';

// Route imports
import productRoutes from './routes/productRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import supplierRoutes from './routes/supplierRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import promotionRoutes from './routes/promotionRoutes.js';
import storeLocationRoutes from './routes/storeLocationRoutes.js';
import deliveryRoutes from './routes/deliveryRoutes.js';
import loyaltyRoutes from './routes/loyaltyRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import debugRoutes from './routes/debugRoutes.js';

const app = express();
const PORT = process.env.PORT || 5001;

// Configure CORS to allow requests from any origin
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Log requests for debugging
app.use((req, res, next) => {
  const requestBody = req.method === 'POST' || req.method === 'PUT' ? JSON.stringify(req.body) : '';
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${requestBody}`);
  next();
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
        table_schema = ?
      GROUP BY 
        table_schema
    `, [process.env.DB_NAME || 'sg_inventory']);
    
    res.json({
      success: true,
      status: 'healthy',
      database: {
        connected: testResult[0].test === 1,
        responseTime: `${responseTime}ms`,
        name: dbInfo[0]?.database_name || process.env.DB_NAME || 'sg_inventory',
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

// Mount routes
app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/store-locations', storeLocationRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/loyalty', loyaltyRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/debug', debugRoutes);

// Export pool for use in other files if needed
export { pool };

// Start the server only if this file is run directly (not imported)
if (process.argv[1] === new URL(import.meta.url).pathname || process.argv[1].endsWith('server.js')) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    // Check database connection on startup
    pool.query('SELECT 1')
      .then(() => {
        console.log('✅ Database connection successful');
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
}