-- Extended database schema for SmartGrocer
-- Add these tables to enhance the inventory management system

-- Use the database
USE sg_inventory;

-- Drop tables if they exist (for clean restart)
DROP TABLE IF EXISTS feedback;
DROP TABLE IF EXISTS loyalty_program_transactions;
DROP TABLE IF EXISTS loyalty_programs;
DROP TABLE IF EXISTS delivery_assignments;
DROP TABLE IF EXISTS delivery_vehicles;
DROP TABLE IF EXISTS delivery_zones;
DROP TABLE IF EXISTS store_product_inventory;
DROP TABLE IF EXISTS store_locations;
DROP TABLE IF EXISTS promotion_products;
DROP TABLE IF EXISTS promotions;
DROP TABLE IF EXISTS vendor_contracts;
DROP TABLE IF EXISTS user_roles;

-- 1. User Roles table for enhanced access control
CREATE TABLE user_roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  role_name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  permissions JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Vendor Contracts table
CREATE TABLE vendor_contracts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  supplier_id INT NOT NULL,
  contract_number VARCHAR(50) UNIQUE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  payment_terms VARCHAR(100),
  delivery_terms TEXT,
  discount_percentage DECIMAL(5,2),
  credit_period INT, -- in days
  status ENUM('active', 'pending', 'expired', 'terminated') DEFAULT 'active',
  documents_url VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

-- 3. Promotions table
CREATE TABLE promotions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  discount_type ENUM('percentage', 'fixed_amount', 'buy_x_get_y') NOT NULL,
  discount_value DECIMAL(10,2) NOT NULL,
  min_purchase_amount DECIMAL(10,2),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. Promotion Products link table
CREATE TABLE promotion_products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  promotion_id INT NOT NULL,
  product_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (promotion_id) REFERENCES promotions(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id),
  UNIQUE (promotion_id, product_id)
);

-- 5. Store Locations table for multiple store support
CREATE TABLE store_locations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(50) NOT NULL,
  state VARCHAR(50) NOT NULL,
  pincode VARCHAR(10) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(100),
  manager_id INT,
  opening_hours VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (manager_id) REFERENCES employees(id)
);

-- 6. Store Product Inventory for tracking inventory at different store locations
CREATE TABLE store_product_inventory (
  id INT AUTO_INCREMENT PRIMARY KEY,
  store_id INT NOT NULL,
  product_id INT NOT NULL,
  stock_quantity INT NOT NULL DEFAULT 0,
  reorder_level INT DEFAULT 5,
  last_restock_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (store_id) REFERENCES store_locations(id),
  FOREIGN KEY (product_id) REFERENCES products(id),
  UNIQUE (store_id, product_id)
);

-- 7. Delivery Zones table
CREATE TABLE delivery_zones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  city VARCHAR(50) NOT NULL,
  pincode_range VARCHAR(100) NOT NULL,
  delivery_charge DECIMAL(10,2) DEFAULT 0,
  min_order_free_delivery DECIMAL(10,2),
  estimated_delivery_time VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 8. Delivery Vehicles table
CREATE TABLE delivery_vehicles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  vehicle_number VARCHAR(20) NOT NULL UNIQUE,
  vehicle_type ENUM('bike', 'scooter', 'van', 'truck') NOT NULL,
  model VARCHAR(100),
  capacity VARCHAR(50),
  driver_name VARCHAR(100),
  driver_phone VARCHAR(20),
  driver_license VARCHAR(50),
  status ENUM('available', 'on_delivery', 'maintenance', 'inactive') DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 9. Delivery Assignments table
CREATE TABLE delivery_assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  vehicle_id INT NOT NULL,
  employee_id INT,
  delivery_zone_id INT,
  scheduled_date DATETIME NOT NULL,
  delivery_status ENUM('pending', 'in_transit', 'delivered', 'failed', 'returned') DEFAULT 'pending',
  actual_delivery_time DATETIME,
  delivery_notes TEXT,
  customer_signature_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (vehicle_id) REFERENCES delivery_vehicles(id),
  FOREIGN KEY (employee_id) REFERENCES employees(id),
  FOREIGN KEY (delivery_zone_id) REFERENCES delivery_zones(id)
);

-- 10. Loyalty Programs table
CREATE TABLE loyalty_programs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  points_per_rupee DECIMAL(10,2) DEFAULT 1.0,
  min_points_to_redeem INT DEFAULT 100,
  conversion_rate DECIMAL(10,2) DEFAULT 0.25, -- e.g., ₹1 per 4 points
  expiry_months INT DEFAULT 12,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 11. Loyalty Program Transactions table
CREATE TABLE loyalty_program_transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  program_id INT NOT NULL,
  order_id INT,
  points INT NOT NULL,
  transaction_type ENUM('earn', 'redeem', 'expire', 'adjustment') NOT NULL,
  reference_id VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (program_id) REFERENCES loyalty_programs(id),
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- 12. Feedback table for customer reviews and ratings
CREATE TABLE feedback (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT,
  order_id INT,
  product_id INT,
  rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comments TEXT,
  feedback_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Insert sample data for User Roles
INSERT INTO user_roles (role_name, description, permissions) VALUES
('Admin', 'Full system access', '{"all": true}'),
('Store Manager', 'Manage store operations and employees', '{"orders": true, "products": true, "inventory": true, "employees": true, "reports": true, "customers": true}'),
('Inventory Manager', 'Manage products and inventory', '{"products": true, "inventory": true, "suppliers": true}'),
('Cashier', 'Process sales and manage orders', '{"orders": true, "customers": {"view": true}}'),
('Delivery Personnel', 'Handle deliveries', '{"orders": {"view": true}, "deliveries": true}');

-- Insert sample data for Vendor Contracts
INSERT INTO vendor_contracts (supplier_id, contract_number, start_date, end_date, payment_terms, delivery_terms, discount_percentage, credit_period, status) VALUES
(1, 'CONT-KF-2023-001', '2023-01-01', '2023-12-31', 'Net 30', 'Free delivery for orders above ₹10,000', 2.50, 30, 'active'),
(2, 'CONT-AD-2023-002', '2023-02-15', '2024-02-14', 'Net 15', 'Delivery within 48 hours of order', 3.75, 15, 'active'),
(3, 'CONT-RB-2023-003', '2023-03-01', '2024-02-28', 'Net 45', 'Weekly scheduled deliveries', 1.85, 45, 'active'),
(4, 'CONT-MF-2023-004', '2023-01-20', '2023-12-31', 'Net 30', 'Delivery charges applicable', 2.00, 30, 'active'),
(5, 'CONT-SB-2023-005', '2023-04-01', '2024-03-31', 'Net 60', 'Monthly bulk delivery', 4.25, 60, 'active');

-- Insert sample data for Promotions
INSERT INTO promotions (name, description, discount_type, discount_value, min_purchase_amount, start_date, end_date, is_active) VALUES
('Summer Sale', 'Get 10% off on selected products', 'percentage', 10.00, 500.00, '2023-05-01', '2023-06-30', true),
('Diwali Special', 'Flat ₹100 off on purchases above ₹1000', 'fixed_amount', 100.00, 1000.00, '2023-10-01', '2023-11-15', true),
('Weekend Bonanza', 'Buy 1 Get 1 Free on selected items', 'buy_x_get_y', 1.00, NULL, '2023-06-01', '2023-12-31', true),
('Monsoon Deals', '15% off on household products', 'percentage', 15.00, 300.00, '2023-07-01', '2023-08-31', true),
('New Year Offer', 'Flat ₹50 off on all orders', 'fixed_amount', 50.00, 0.00, '2023-12-25', '2024-01-10', false);

-- Insert sample data for Promotion Products
INSERT INTO promotion_products (promotion_id, product_id) VALUES
(1, 3), -- Summer Sale - Bananas
(1, 5), -- Summer Sale - Thums Up
(2, 6), -- Diwali Special - Haldiram Aloo Bhujia
(2, 7), -- Diwali Special - Vim Dishwash Liquid
(2, 8), -- Diwali Special - Colgate MaxFresh
(3, 2), -- Weekend Bonanza - Britannia Bread
(3, 10), -- Weekend Bonanza - Brown Bread
(4, 7), -- Monsoon Deals - Vim Dishwash Liquid
(4, 8), -- Monsoon Deals - Colgate MaxFresh
(5, 1), -- New Year Offer - Amul Milk
(5, 4), -- New Year Offer - Chicken Breast
(5, 9); -- New Year Offer - Amul Paneer

-- Insert sample data for Store Locations
INSERT INTO store_locations (name, address, city, state, pincode, phone, email, manager_id, opening_hours, is_active) VALUES
('SmartGrocer Central', '42 MG Road, Near Central Mall', 'Bangalore', 'Karnataka', '560001', '+91-8044556677', 'central@smartgrocer.com', 1, '9:00 AM - 9:00 PM', true),
('SmartGrocer Express', '15 Linking Road, Bandra West', 'Mumbai', 'Maharashtra', '400050', '+91-2233445566', 'express@smartgrocer.com', 2, '8:00 AM - 10:00 PM', true),
('SmartGrocer Metro', '7 Connaught Place', 'New Delhi', 'Delhi', '110001', '+91-1122334455', 'metro@smartgrocer.com', 3, '10:00 AM - 8:00 PM', true);

-- Insert sample data for Store Product Inventory
INSERT INTO store_product_inventory (store_id, product_id, stock_quantity, reorder_level, last_restock_date) VALUES
(1, 1, 30, 10, '2023-05-01'), -- Amul Milk at SmartGrocer Central
(1, 2, 45, 15, '2023-05-01'), -- Britannia Bread at SmartGrocer Central
(1, 3, 100, 20, '2023-05-02'), -- Fresh Bananas at SmartGrocer Central
(1, 4, 25, 8, '2023-05-01'), -- Chicken Breast at SmartGrocer Central
(1, 5, 60, 15, '2023-05-03'), -- Thums Up at SmartGrocer Central
(2, 1, 25, 8, '2023-05-01'), -- Amul Milk at SmartGrocer Express
(2, 2, 35, 10, '2023-05-01'), -- Britannia Bread at SmartGrocer Express
(2, 6, 50, 12, '2023-05-02'), -- Haldiram Aloo Bhujia at SmartGrocer Express
(2, 7, 30, 10, '2023-05-03'), -- Vim Dishwash Liquid at SmartGrocer Express
(2, 8, 40, 12, '2023-05-02'), -- Colgate MaxFresh at SmartGrocer Express
(3, 1, 20, 5, '2023-05-01'), -- Amul Milk at SmartGrocer Metro
(3, 9, 30, 8, '2023-05-02'), -- Amul Paneer at SmartGrocer Metro
(3, 10, 25, 6, '2023-05-01'); -- Brown Bread at SmartGrocer Metro

-- Insert sample data for Delivery Zones
INSERT INTO delivery_zones (name, city, pincode_range, delivery_charge, min_order_free_delivery, estimated_delivery_time, is_active) VALUES
('Koramangala', 'Bangalore', '560034-560037', 40.00, 500.00, '30-45 minutes', true),
('Indiranagar', 'Bangalore', '560038-560040', 30.00, 500.00, '20-35 minutes', true),
('Bandra', 'Mumbai', '400050-400051', 50.00, 600.00, '30-50 minutes', true),
('Andheri', 'Mumbai', '400053-400058', 60.00, 700.00, '40-60 minutes', true),
('Connaught Place', 'New Delhi', '110001-110002', 35.00, 550.00, '25-40 minutes', true),
('Karol Bagh', 'New Delhi', '110005-110006', 45.00, 650.00, '35-50 minutes', true);

-- Insert sample data for Delivery Vehicles
INSERT INTO delivery_vehicles (vehicle_number, vehicle_type, model, capacity, driver_name, driver_phone, driver_license, status) VALUES
('KA01AB1234', 'bike', 'Hero Splendor Plus', '10kg', 'Rakesh Singh', '+91-9988776655', 'KA0120210012345', 'available'),
('MH02CD5678', 'scooter', 'TVS Jupiter', '15kg', 'Vishal Sharma', '+91-8877665544', 'MH0220200054321', 'available'),
('DL03EF9012', 'van', 'Maruti Suzuki Eeco', '500kg', 'Amit Kumar', '+91-7766554433', 'DL0320180098765', 'available'),
('KA04GH3456', 'bike', 'Bajaj Pulsar', '12kg', 'Sunil Reddy', '+91-6655443322', 'KA0420190045678', 'on_delivery'),
('MH05IJ7890', 'truck', 'Tata Ace', '750kg', 'Raju Patil', '+91-5544332211', 'MH0520170076543', 'maintenance');

-- Insert sample data for Delivery Assignments
INSERT INTO delivery_assignments (order_id, vehicle_id, employee_id, delivery_zone_id, scheduled_date, delivery_status, actual_delivery_time) VALUES
(1, 1, 3, 1, '2023-05-05 14:00:00', 'delivered', '2023-05-05 14:30:00'),
(2, 2, 3, 3, '2023-05-06 12:30:00', 'delivered', '2023-05-06 13:15:00'),
(3, 3, 5, 5, '2023-05-07 16:00:00', 'in_transit', NULL),
(4, 4, 5, 2, '2023-05-08 10:00:00', 'pending', NULL),
(5, 1, 3, 1, '2023-05-09 11:30:00', 'pending', NULL);

-- Insert sample data for Loyalty Programs
INSERT INTO loyalty_programs (name, description, points_per_rupee, min_points_to_redeem, conversion_rate, expiry_months, is_active) VALUES
('SmartRewards', 'Earn points on every purchase', 1.00, 500, 0.25, 12, true),
('Premium Club', 'Exclusive rewards for high-value customers', 1.50, 1000, 0.50, 24, true);

-- Insert sample data for Loyalty Program Transactions
INSERT INTO loyalty_program_transactions (customer_id, program_id, order_id, points, transaction_type, reference_id, notes) VALUES
(1, 1, 1, 1250, 'earn', 'ORD-1', 'Points earned on order #1'),
(2, 1, 2, 785, 'earn', 'ORD-2', 'Points earned on order #2'),
(3, 2, 3, 3225, 'earn', 'ORD-3', 'Points earned on order #3 with Premium Club bonus'),
(4, 1, 4, 430, 'earn', 'ORD-4', 'Points earned on order #4'),
(1, 1, NULL, -1000, 'redeem', 'RED-001', 'Redeemed for ₹250 discount'),
(2, 1, NULL, 200, 'adjustment', 'ADJ-001', 'Bonus points for customer loyalty');

-- Insert sample data for Feedback
INSERT INTO feedback (customer_id, order_id, product_id, rating, comments, status, is_public) VALUES
(1, 1, 1, 5, 'Great product, very fresh milk!', 'approved', true),
(2, 2, 5, 4, 'Good taste, but packaging could be better', 'approved', true),
(3, 3, 4, 5, 'Very fresh chicken, will order again', 'approved', true),
(4, 4, 3, 3, 'Bananas were slightly overripe', 'approved', true),
(5, 5, 9, 5, 'Best paneer in town, very soft and fresh', 'approved', true),
(1, NULL, 6, 4, 'Delicious snack, but a bit spicy for me', 'pending', false),
(2, NULL, 8, 5, 'Great toothpaste, keeps breath fresh all day', 'pending', false); 