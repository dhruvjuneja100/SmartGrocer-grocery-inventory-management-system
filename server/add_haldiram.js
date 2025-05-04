import mysql from 'mysql2/promise';

async function addProduct() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'sg_inventory'
  });
  
  try {
    console.log('Connected to database');
    
    // Check if we have a Snacks category
    let categoryId = null;
    const [categories] = await connection.query('SELECT id FROM categories WHERE name = ?', ['Snacks']);
    
    if (categories.length > 0) {
      categoryId = categories[0].id;
      console.log('Found Snacks category with ID:', categoryId);
    } else {
      const [result] = await connection.query('INSERT INTO categories (name) VALUES (?)', ['Snacks']);
      categoryId = result.insertId;
      console.log('Created new Snacks category with ID:', categoryId);
    }
    
    // Check if product already exists
    const [existingProducts] = await connection.query(
      'SELECT * FROM products WHERE name = ?', 
      ['Haldiram Aloo Bhujia']
    );
    
    if (existingProducts.length > 0) {
      console.log('Product already exists:', existingProducts[0]);
      
      // Update stock quantity to ensure it's sufficient
      if (existingProducts[0].stock_quantity < 10) {
        await connection.query(
          'UPDATE products SET stock_quantity = ? WHERE id = ?',
          [100, existingProducts[0].id]
        );
        console.log('Updated stock quantity to 100');
      }
      
      return;
    }
    
    // Add the product
    const [result] = await connection.query(
      'INSERT INTO products (name, sku, category_id, price, stock_quantity) VALUES (?, ?, ?, ?, ?)',
      ['Haldiram Aloo Bhujia', 'SNCK-001', categoryId, 85.00, 100]
    );
    
    console.log('Product added successfully with ID:', result.insertId);
    
    // Verify it was added
    const [newProduct] = await connection.query(
      'SELECT * FROM products WHERE id = ?',
      [result.insertId]
    );
    
    console.log('New product details:', newProduct[0]);
  } catch (error) {
    console.error('Error adding product:', error);
  } finally {
    await connection.end();
    console.log('Database connection closed');
  }
}

addProduct()
  .then(() => console.log('Script completed'))
  .catch(err => console.error('Script failed:', err)); 