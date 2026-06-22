import mysql from 'mysql2/promise';
import 'dotenv/config';

// Create MySQL connection pool with enhanced logging
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'asanar05',
  database: process.env.DB_NAME || 'sg_inventory',
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

export { pool };
