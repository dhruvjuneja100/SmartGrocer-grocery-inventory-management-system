// Setup script to run database SQL files
import { promises as fs } from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'admin',
  multipleStatements: true
};

async function executeScript(connection, sqlScript) {
  try {
    console.log('Executing SQL script...');
    await connection.query(sqlScript);
    console.log('SQL script executed successfully');
  } catch (error) {
    console.error('Error executing SQL script:', error);
    throw error;
  }
}

async function runSetup() {
  let connection;
  
  try {
    // Read the SQL files
    console.log('Reading SQL files...');
    const baseSqlPath = path.join(process.cwd(), 'server', 'database.sql');
    const extendedSqlPath = path.join(process.cwd(), 'server', 'database_extended.sql');
    const additionalDataPath = path.join(process.cwd(), 'server', 'additional_data.sql');
    const bulkDataPath = path.join(process.cwd(), 'server', 'bulk_data.sql');
    
    const baseSql = await fs.readFile(baseSqlPath, 'utf8');
    const extendedSql = await fs.readFile(extendedSqlPath, 'utf8');
    const additionalDataSql = await fs.readFile(additionalDataPath, 'utf8');
    
    // Check if bulk_data.sql exists
    let bulkDataSql = '';
    try {
      bulkDataSql = await fs.readFile(bulkDataPath, 'utf8');
    } catch (err) {
      console.log('Bulk data file not found, skipping...');
    }
    
    // Create connection to MySQL server
    console.log('Connecting to MySQL server...');
    connection = await mysql.createConnection(dbConfig);
    
    // Run base database script
    console.log('Setting up base tables...');
    await executeScript(connection, baseSql);
    
    // Run extended database script
    console.log('Setting up extended tables...');
    await executeScript(connection, extendedSql);
    
    // Run additional data script
    console.log('Adding additional sample data...');
    await executeScript(connection, additionalDataSql);
    
    // Run bulk data script if it exists
    if (bulkDataSql) {
      console.log('Adding bulk data (approximately 100 records per table)...');
      await executeScript(connection, bulkDataSql);
    }
    
    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  } finally {
    if (connection) {
      console.log('Closing database connection...');
      await connection.end();
    }
  }
}

// Run the setup
runSetup(); 