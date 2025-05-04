import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';

// Get current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database connection config
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'admin',
  multipleStatements: true // Required for running multiple SQL statements
};

async function initializeDatabase() {
  let connection;
  
  try {
    // Create database connection
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL server successfully.');
    
    // Read SQL file
    const sqlFilePath = path.join(__dirname, 'database.sql');
    const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Run SQL script
    console.log('Initializing database...');
    await connection.query(sqlScript);
    console.log('Database initialized successfully with new database name: sg_inventory');
    
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
  }
}

// Run the initialization
initializeDatabase(); 