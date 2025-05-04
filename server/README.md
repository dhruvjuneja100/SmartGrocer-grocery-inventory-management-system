# SmartGrocer Bulk Data Import

This directory contains SQL scripts to populate the SmartGrocer database with sample data.

## Files:
- `database.sql` - Creates the core database tables
- `database_extended.sql` - Creates the additional tables added for the new pages
- `additional_data.sql` - Adds initial sample data
- `bulk_data.sql` - Adds approximately 100 records to each table

## How to Use the Bulk Data:

### Option 1: Using the Setup Script
If you have Node.js installed:
1. Make sure your database credentials are correct in the `.env` file or `server/setup.js`
2. Run: `node server/setup.js`

### Option 2: Direct Database Import
If you prefer to import directly:
1. Connect to your MySQL server
2. Select the sg_inventory database: `USE sg_inventory;`
3. Run: `SOURCE /path/to/server/bulk_data.sql;`

### Option 3: Manual Import
If you're using a GUI tool like MySQL Workbench or phpMyAdmin:
1. Open the `bulk_data.sql` file
2. Copy parts of the SQL statements as needed
3. Execute in your database tool against the sg_inventory database

## Troubleshooting
- If you encounter foreign key constraint errors, you may need to disable foreign key checks temporarily:
  ```sql
  SET FOREIGN_KEY_CHECKS=0;
  -- Your SQL queries here
  SET FOREIGN_KEY_CHECKS=1;
  ```
- For large inserts, you may need to increase the MySQL timeout or max_allowed_packet settings

## Data Content
The bulk_data.sql file adds approximately 100 records to each of the following tables:
- categories
- suppliers
- products
- customers
- employees
- orders
- order_items
- inventory_transactions
- store_locations
- delivery_zones
- loyalty_programs
- and more

This data provides a comprehensive base for testing and demonstrating the SmartGrocer application's capabilities. 