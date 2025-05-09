// Script to add bulk data to the existing database
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
  database: 'sg_inventory',
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

async function addBulkData() {
  let connection;

  try {
    // Read the bulk data SQL file
    console.log('Reading bulk data SQL file...');
    const bulkDataPath = path.join(process.cwd(), 'server', 'bulk_data.sql');
    const bulkDataSql = await fs.readFile(bulkDataPath, 'utf8');

    // Create connection to MySQL server
    console.log('Connecting to MySQL server...');
    connection = await mysql.createConnection(dbConfig);

    // Run bulk data script
    console.log('Adding bulk data (approximately 100 records per table)...');
    await executeScript(connection, bulkDataSql);

    console.log('Bulk data added successfully!');
  } catch (error) {
    console.error('Error adding bulk data:', error);
    process.exit(1);
  } finally {
    if (connection) {
      console.log('Closing database connection...');
      await connection.end();
    }
  }
}

// Run the bulk data addition
addBulkData(); 