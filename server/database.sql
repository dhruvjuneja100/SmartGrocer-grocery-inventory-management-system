-- Create database (if not exists already)
CREATE DATABASE IF NOT EXISTS sg_inventory;

-- Use the database
USE sg_inventory;

-- Drop tables if they exist (for clean restart)
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS inventory_transactions;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS suppliers;

-- Create Categories table
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Suppliers table
CREATE TABLE suppliers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  contact_person VARCHAR(100),
  email VARCHAR(100),
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Products table
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  sku VARCHAR(50) UNIQUE,
  category_id INT,
  supplier_id INT,
  price DECIMAL(10,2) NOT NULL,
  cost DECIMAL(10,2),
  stock_quantity INT DEFAULT 0,
  reorder_level INT DEFAULT 20,
  image_url VARCHAR(255),
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

-- Create Customers table
CREATE TABLE customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE,
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Employees table
CREATE TABLE employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE,
  phone VARCHAR(20),
  role VARCHAR(50),
  password VARCHAR(255),
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Orders table
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT,
  employee_id INT,
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total_amount DECIMAL(10,2) DEFAULT 0,
  status ENUM('pending', 'processing', 'completed', 'cancelled') DEFAULT 'pending',
  payment_method VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- Create Order_Items table
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Create Inventory_Transactions table
CREATE TABLE inventory_transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  transaction_type ENUM('purchase', 'sale', 'adjustment', 'return') NOT NULL,
  reference_id INT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Insert sample data for Categories
INSERT INTO categories (name, description) VALUES
('Dairy', 'Milk, paneer, curd, and other dairy products'),
('Bakery', 'Bread, pastries, and baked goods'),
('Fruits & Vegetables', 'Fresh fruits and vegetables'),
('Meat & Poultry', 'Fresh and frozen meat products'),
('Beverages', 'Tea, coffee, juices, and soft drinks'),
('Snacks & Sweets', 'Namkeen, chips, cookies, and sweets'),
('Household', 'Cleaning supplies and household items'),
('Personal Care', 'Hygiene and personal care products');

-- Insert sample data for Suppliers
INSERT INTO suppliers (name, contact_person, email, phone, address) VALUES
('Kisan Fresh Farms', 'Rajesh Kumar', 'rajesh@kisanfresh.com', '+91-9876543210', '45 Agricultural Zone, Nashik, Maharashtra 422001'),
('Amul Distributors', 'Priya Patel', 'priya@amuldist.com', '+91-8765432109', '78 Dairy Circle, Anand, Gujarat 388001'),
('Royal Bakery Supply', 'Vikram Singh', 'vikram@royalbakery.com', '+91-7654321098', '23 Industrial Area, Ludhiana, Punjab 141001'),
('Meaty Foods Ltd.', 'Arjun Sharma', 'arjun@meatyfoods.com', '+91-6543210987', '112 Food Processing Zone, Ghaziabad, UP 201001'),
('Shakti Beverages', 'Neha Verma', 'neha@shaktibev.com', '+91-9876123456', '67 MIDC, Pune, Maharashtra 411057');

-- Insert sample data for Products
INSERT INTO products (name, description, sku, category_id, supplier_id, price, cost, stock_quantity, reorder_level, status) VALUES
('Amul Milk', 'Fresh cow milk, 1 litre packet', 'MILK-001', 1, 2, 60.00, 45.00, 25, 20, 'active'),
('Britannia Bread', 'Sliced white bread, 400g pack', 'BREAD-001', 2, 3, 40.00, 28.00, 30, 20, 'active'),
('Fresh Bananas', 'Yellow bananas, per dozen', 'FRUIT-001', 3, 1, 50.00, 35.00, 100, 20, 'active'),
('Chicken Breast', 'Fresh boneless chicken, 500g pack', 'MEAT-001', 4, 4, 180.00, 125.00, 15, 20, 'active'),
('Thums Up', '2 litre bottle', 'BEV-001', 5, 5, 95.00, 75.00, 50, 20, 'active'),
('Haldiram Aloo Bhujia', 'Spicy potato snack, 200g pack', 'SNACK-001', 6, 3, 85.00, 65.00, 40, 20, 'active'),
('Vim Dishwash Liquid', 'Dishwashing gel, 500ml', 'HOUSE-001', 7, 5, 99.00, 70.00, 20, 20, 'active'),
('Colgate MaxFresh', 'Toothpaste, 150g tube', 'CARE-001', 8, 5, 90.00, 65.00, 25, 20, 'active'),
('Amul Paneer', 'Fresh cottage cheese, 200g block', 'DAIRY-002', 1, 2, 80.00, 60.00, 20, 20, 'active'),
('Brown Bread', 'Whole wheat bread, 400g loaf', 'BREAD-002', 2, 3, 45.00, 32.00, 25, 20, 'active');

-- Insert sample data for Customers
INSERT INTO customers (name, email, phone, address) VALUES
('Aarav Sharma', 'aarav@email.com', '+91-9876543210', '45 Laxmi Nagar, New Delhi, Delhi 110092'),
('Ritu Desai', 'ritu@email.com', '+91-8765432109', '78 Hiranandani Gardens, Mumbai, Maharashtra 400076'),
('Karthik Iyer', 'karthik@email.com', '+91-7654321098', '23 Indiranagar, Bangalore, Karnataka 560038'),
('Deepa Gupta', 'deepa@email.com', '+91-6543210987', '101 Salt Lake City, Kolkata, West Bengal 700091'),
('Suresh Patel', 'suresh@email.com', '+91-9876123456', '52 Navrangpura, Ahmedabad, Gujarat 380009');

-- Insert sample data for Employees
INSERT INTO employees (name, email, phone, role, password, status) VALUES
('Aditya Mehta', 'aditya@smartgrocer.com', '+91-9988776655', 'Manager', '$2a$10$xyzxyzxyzxyzxyzxyzxyzxyzxyzxyzxyz', 'active'),
('Sunita Reddy', 'sunita@smartgrocer.com', '+91-8877665544', 'Sales Associate', '$2a$10$abcabcabcabcabcabcabcabcabcabcabc', 'active'),
('Ramesh Joshi', 'ramesh@smartgrocer.com', '+91-7766554433', 'Inventory Clerk', '$2a$10$defdefdefdefdefdefdefdefdefdefdef', 'active'),
('Pooja Malhotra', 'pooja@smartgrocer.com', '+91-6655443322', 'Cashier', '$2a$10$ghighighighighighighighighighigh', 'active'),
('Sanjay Kumar', 'sanjay@smartgrocer.com', '+91-9876987698', 'Maintenance', '$2a$10$jkljkljkljkljkljkljkljkljkljkljkl', 'active');

-- Insert sample data for Orders
INSERT INTO orders (customer_id, employee_id, total_amount, status, payment_method, notes) VALUES
(1, 2, 1250.00, 'completed', 'UPI', 'Weekly grocery purchase'),
(2, 4, 785.00, 'completed', 'cash', 'Customer requested paper bags'),
(3, 2, 2150.00, 'processing', 'credit_card', 'Phone order for delivery'),
(4, 4, 430.00, 'completed', 'debit_card', NULL),
(5, 2, 1650.00, 'pending', 'UPI', 'Special order for family gathering');

-- Insert sample data for Order_Items
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
(1, 1, 2, 60.00),   -- 2 packs of milk
(1, 3, 5, 50.00),   -- 5 dozens of bananas
(1, 6, 3, 85.00),   -- 3 packs of aloo bhujia
(1, 9, 2, 80.00),   -- 2 blocks of paneer
(2, 2, 1, 40.00),   -- 1 loaf of white bread
(2, 5, 3, 95.00),   -- 3 bottles of Thums Up
(2, 8, 2, 90.00),   -- 2 tubes of toothpaste
(3, 4, 5, 180.00),  -- 5 packs of chicken breast
(3, 10, 2, 45.00),  -- 2 loaves of brown bread
(3, 7, 3, 99.00),   -- 3 bottles of dishwash liquid
(3, 5, 4, 95.00),   -- 4 bottles of Thums Up
(4, 3, 6, 50.00),   -- 6 dozens of bananas
(4, 6, 1, 85.00),   -- 1 pack of aloo bhujia
(5, 9, 3, 80.00),   -- 3 blocks of paneer
(5, 10, 2, 45.00),  -- 2 loaves of brown bread
(5, 4, 3, 180.00);  -- 3 packs of chicken breast

-- Insert sample data for Inventory_Transactions
INSERT INTO inventory_transactions (product_id, quantity, transaction_type, reference_id, notes) VALUES
(1, 30, 'purchase', NULL, 'Initial stocking'),
(1, -2, 'sale', 1, 'Order #1'),
(2, 35, 'purchase', NULL, 'Initial stocking'),
(2, -1, 'sale', 2, 'Order #2'),
(3, 120, 'purchase', NULL, 'Initial stocking'),
(3, -5, 'sale', 1, 'Order #1'),
(3, -6, 'sale', 4, 'Order #4'),
(4, 25, 'purchase', NULL, 'Initial stocking'),
(4, -5, 'sale', 3, 'Order #3'),
(4, -3, 'sale', 5, 'Order #5'),
(5, 60, 'purchase', NULL, 'Initial stocking'),
(5, -3, 'sale', 2, 'Order #2'),
(5, -4, 'sale', 3, 'Order #3'),
(6, 50, 'purchase', NULL, 'Initial stocking'),
(6, -3, 'sale', 1, 'Order #1'),
(6, -1, 'sale', 4, 'Order #4'),
(7, 25, 'purchase', NULL, 'Initial stocking'),
(7, -3, 'sale', 3, 'Order #3'),
(8, 30, 'purchase', NULL, 'Initial stocking'),
(8, -2, 'sale', 2, 'Order #2'),
(9, 25, 'purchase', NULL, 'Initial stocking'),
(9, -2, 'sale', 1, 'Order #1'),
(9, -3, 'sale', 5, 'Order #5'),
(10, 30, 'purchase', NULL, 'Initial stocking'),
(10, -2, 'sale', 3, 'Order #3'),
(10, -2, 'sale', 5, 'Order #5'); 