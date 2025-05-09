import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import readline from 'readline';

// Get current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create readline interface for prompting
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Promisify readline question
function question(query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function initializeDatabase() {
  let connection;
  
  try {
    // Prompt for MySQL root password
    const password = await question('Enter your MySQL root password: ');
    
    // Database connection config
    const dbConfig = {
      host: 'localhost',
      user: 'root',
      password: password,
      multipleStatements: true // Required for running multiple SQL statements
    };
    
    // Create database connection
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL server successfully.');
    
    // Read SQL file
    const sqlFilePath = path.join(__dirname, 'database.sql');
    const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Run SQL script
    console.log('Initializing database...');
    await connection.query(sqlScript);
    console.log('Database initialized successfully with database name: sg_inventory');
    
    // Update server.js with the correct password
    updateServerConfig(password);
    
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
    rl.close();
  }
}

// Function to update server.js with the correct password
function updateServerConfig(password) {
  const serverJsPath = path.join(__dirname, 'server.js');
  let serverJsContent = fs.readFileSync(serverJsPath, 'utf8');
  
  // Update the password in the pool configuration
  const oldPoolConfig = /const pool = mysql\.createPool\({[^}]*}\);/s;
  const newPoolConfig = `const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '${password}',
  database: 'sg_inventory',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});`;
  
  serverJsContent = serverJsContent.replace(oldPoolConfig, newPoolConfig);
  
  // Write the updated content back to server.js
  fs.writeFileSync(serverJsPath, serverJsContent);
  console.log('Updated server.js with the correct database password.');
}

// Run the initialization
initializeDatabase(); 