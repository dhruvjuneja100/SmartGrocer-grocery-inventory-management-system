const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const serverDir = path.join(rootDir, 'server');
const databaseDir = path.join(rootDir, 'database');

// Create database directory if it doesn't exist
if (!fs.existsSync(databaseDir)) {
  fs.mkdirSync(databaseDir, { recursive: true });
}

// Move database.sql
const oldSchemaPath = path.join(serverDir, 'database.sql');
const newSchemaPath = path.join(databaseDir, 'schema.sql');
if (fs.existsSync(oldSchemaPath)) {
  fs.renameSync(oldSchemaPath, newSchemaPath);
  console.log('Moved database.sql to database/schema.sql');
}

// Files to delete
const filesToDelete = [
  path.join(rootDir, 'static-test.html'),
  path.join(rootDir, 'restart_server.bat'),
  path.join(rootDir, 'src', 'test.html'),
  path.join(serverDir, 'add_bulk_data.js'),
  path.join(serverDir, 'add_haldiram.js'),
  path.join(serverDir, 'alter_orders_table.js'),
  path.join(serverDir, 'init-db.js'),
  path.join(serverDir, 'setup-db.js'),
  path.join(serverDir, 'setup.js'),
  path.join(serverDir, 'setup_tables.js'),
  path.join(serverDir, 'additional_data.sql'),
  path.join(serverDir, 'bulk_data.sql'),
  path.join(serverDir, 'database_extended.sql'),
  path.join(serverDir, 'SUMMARY.md')
];

for (const file of filesToDelete) {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
    console.log(`Deleted: ${file}`);
  }
}

console.log('Cleanup complete!');
