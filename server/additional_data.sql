-- Additional sample data for SmartGrocer database
-- This script adds 100-150 entries spread across various tables

USE sg_inventory;

-- Add more Store Locations (10 more)
INSERT INTO store_locations (name, address, city, state, pincode, phone, email, manager_id, opening_hours, is_active) VALUES
('SmartGrocer Whitefield', '567 Whitefield Main Road', 'Bangalore', 'Karnataka', '560066', '+91-8044667788', 'whitefield@smartgrocer.com', 1, '8:00 AM - 10:00 PM', true),
('SmartGrocer HSR Layout', '23 HSR Main, 5th Sector', 'Bangalore', 'Karnataka', '560102', '+91-8044889966', 'hsr@smartgrocer.com', 2, '8:00 AM - 10:00 PM', true),
('SmartGrocer Koramangala', '80 Feet Road, 6th Block', 'Bangalore', 'Karnataka', '560095', '+91-8045678901', 'koramangala@smartgrocer.com', 3, '8:00 AM - 11:00 PM', true),
('SmartGrocer Andheri West', '45 Link Road, Andheri West', 'Mumbai', 'Maharashtra', '400053', '+91-2223456789', 'andheriw@smartgrocer.com', 4, '9:00 AM - 10:00 PM', true),
('SmartGrocer Powai', '34 Hiranandani Gardens', 'Mumbai', 'Maharashtra', '400076', '+91-2224567890', 'powai@smartgrocer.com', 5, '9:00 AM - 9:00 PM', true),
('SmartGrocer South Delhi', '15 Saket District Centre', 'New Delhi', 'Delhi', '110017', '+91-1145678901', 'southdelhi@smartgrocer.com', 1, '10:00 AM - 9:00 PM', true),
('SmartGrocer Gurgaon', '78 DLF Cyber City', 'Gurgaon', 'Haryana', '122002', '+91-1246789012', 'gurgaon@smartgrocer.com', 2, '10:00 AM - 10:00 PM', true),
('SmartGrocer Salt Lake', '34 Sector V, Salt Lake', 'Kolkata', 'West Bengal', '700091', '+91-3323456789', 'saltlake@smartgrocer.com', 3, '9:00 AM - 9:00 PM', true),
('SmartGrocer Jubilee Hills', '45 Road No. 5, Jubilee Hills', 'Hyderabad', 'Telangana', '500033', '+91-4023456789', 'jubilee@smartgrocer.com', 4, '8:00 AM - 10:00 PM', true),
('SmartGrocer Jayanagar', '30 11th Main, 4th Block', 'Bangalore', 'Karnataka', '560041', '+91-8023456789', 'jayanagar@smartgrocer.com', 5, '8:00 AM - 10:00 PM', false);

-- Add more Delivery Zones (15 more)
INSERT INTO delivery_zones (name, city, pincode_range, delivery_charge, min_order_free_delivery, estimated_delivery_time, is_active) VALUES
('Whitefield', 'Bangalore', '560066-560067', 45.00, 500.00, '30-45 minutes', true),
('HSR Layout', 'Bangalore', '560102-560103', 35.00, 450.00, '25-40 minutes', true),
('Koramangala', 'Bangalore', '560095-560096', 30.00, 400.00, '20-35 minutes', true),
('Andheri West', 'Mumbai', '400053-400055', 50.00, 600.00, '35-50 minutes', true),
('Powai', 'Mumbai', '400076-400077', 55.00, 650.00, '40-55 minutes', true),
('Bandra East', 'Mumbai', '400051-400052', 45.00, 550.00, '30-45 minutes', true),
('South Delhi', 'New Delhi', '110017-110018', 40.00, 500.00, '30-45 minutes', true),
('Gurgaon', 'Gurgaon', '122002-122003', 60.00, 700.00, '40-60 minutes', true),
('Noida', 'Noida', '201301-201304', 65.00, 750.00, '45-60 minutes', true),
('Salt Lake', 'Kolkata', '700091-700092', 40.00, 500.00, '35-50 minutes', true),
('Newtown', 'Kolkata', '700156-700157', 50.00, 600.00, '40-55 minutes', true),
('Jubilee Hills', 'Hyderabad', '500033-500034', 45.00, 550.00, '30-45 minutes', true),
('Banjara Hills', 'Hyderabad', '500034-500035', 40.00, 500.00, '25-40 minutes', true),
('Jayanagar', 'Bangalore', '560041-560042', 30.00, 400.00, '20-35 minutes', true),
('Electronic City', 'Bangalore', '560100-560101', 60.00, 700.00, '40-60 minutes', true);

-- Add more Delivery Vehicles (15 more)
INSERT INTO delivery_vehicles (vehicle_number, vehicle_type, model, capacity, driver_name, driver_phone, driver_license, status) VALUES
('KA05MN4567', 'bike', 'Bajaj Platina', '8kg', 'Manoj Kumar', '+91-9786756453', 'KA0520190056789', 'available'),
('MH06OP7890', 'scooter', 'Honda Activa', '10kg', 'Rahul Sharma', '+91-8794561230', 'MH0620200067890', 'available'),
('DL07QR1234', 'van', 'Tata Magic', '450kg', 'Vijay Singh', '+91-7689054321', 'DL0720180078901', 'available'),
('KA08ST5678', 'bike', 'Hero Splendor', '8kg', 'Ramesh Yadav', '+91-9567890123', 'KA0820190089012', 'on_delivery'),
('MH09UV9012', 'scooter', 'Vespa', '12kg', 'Sandeep Kumar', '+91-8456789012', 'MH0920170090123', 'available'),
('DL10WX3456', 'van', 'Mahindra Supro', '600kg', 'Rajesh Tiwari', '+91-7345678901', 'DL1020180001234', 'maintenance'),
('KA11YZ7890', 'bike', 'TVS Apache', '10kg', 'Ajay Patel', '+91-9234567890', 'KA1120190012345', 'available'),
('MH12AB1234', 'truck', 'Ashok Leyland Dost', '800kg', 'Pramod Sawant', '+91-8123456789', 'MH1220170023456', 'available'),
('DL13CD5678', 'bike', 'Royal Enfield Bullet', '15kg', 'Amar Singh', '+91-7012345678', 'DL1320180034567', 'on_delivery'),
('KA14EF9012', 'scooter', 'Suzuki Access', '12kg', 'Venkatesh Murthy', '+91-9901234567', 'KA1420190045678', 'available'),
('MH15GH3456', 'van', 'Maruti Eeco', '500kg', 'Anil Deshmukh', '+91-8890123456', 'MH1520180056789', 'available'),
('DL16IJ7890', 'bike', 'Yamaha FZ', '10kg', 'Hardeep Singh', '+91-7789012345', 'DL1620190067890', 'maintenance'),
('KA17KL1234', 'scooter', 'Ather 450', '8kg', 'Kiran Kumar', '+91-9678901234', 'KA1720200078901', 'available'),
('MH18MN5678', 'van', 'Force Tempo Traveller', '550kg', 'Deepak Patil', '+91-8567890123', 'MH1820180089012', 'on_delivery'),
('DL19OP9012', 'bike', 'KTM Duke', '8kg', 'Suresh Kumar', '+91-7456789012', 'DL1920190090123', 'available');

-- Add more Vendor Contracts (10 more)
INSERT INTO vendor_contracts (supplier_id, contract_number, start_date, end_date, payment_terms, delivery_terms, discount_percentage, credit_period, status) VALUES
(1, 'CONT-KF-2023-006', '2023-06-01', '2024-05-31', 'Net 15', 'Free delivery for orders above ₹15,000', 3.50, 15, 'active'),
(2, 'CONT-AD-2023-007', '2023-07-15', '2024-07-14', 'Net 30', 'Weekly scheduled deliveries', 2.75, 30, 'active'),
(3, 'CONT-RB-2023-008', '2023-08-01', '2024-07-31', 'Net 60', 'Delivery within 24 hours of order', 4.00, 60, 'active'),
(4, 'CONT-MF-2023-009', '2023-05-20', '2024-05-19', 'Net 45', 'Bi-weekly scheduled deliveries', 3.25, 45, 'active'),
(5, 'CONT-SB-2023-010', '2023-09-01', '2024-08-31', 'Net 30', 'Free delivery for all orders', 2.50, 30, 'active'),
(1, 'CONT-KF-2023-011', '2023-10-01', '2024-09-30', 'Net 30', 'Delivery charges applicable', 2.00, 30, 'pending'),
(2, 'CONT-AD-2023-012', '2023-11-15', '2024-11-14', 'Net 45', 'Monthly bulk delivery', 3.50, 45, 'active'),
(3, 'CONT-RB-2023-013', '2023-06-01', '2023-12-31', 'Net 15', 'Weekly scheduled deliveries', 1.75, 15, 'expired'),
(4, 'CONT-MF-2023-014', '2023-07-20', '2024-07-19', 'Net 60', 'Delivery within 48 hours of order', 4.25, 60, 'active'),
(5, 'CONT-SB-2023-015', '2023-08-01', '2024-07-31', 'Net 30', 'Bi-weekly scheduled deliveries', 2.25, 30, 'active');

-- Add more Promotions (10 more)
INSERT INTO promotions (name, description, discount_type, discount_value, min_purchase_amount, start_date, end_date, is_active) VALUES
('Independence Day Sale', 'Special discounts for Independence Day', 'percentage', 15.00, 750.00, '2023-08-01', '2023-08-15', false),
('Dussehra Celebration', 'Festive offers for Dussehra', 'fixed_amount', 150.00, 1200.00, '2023-10-15', '2023-10-24', false),
('Black Friday Deals', 'Amazing deals on Black Friday', 'percentage', 25.00, 1000.00, '2023-11-24', '2023-11-26', false),
('Christmas Special', 'Holiday season discounts', 'fixed_amount', 200.00, 1500.00, '2023-12-20', '2023-12-31', false),
('Republic Day Offer', 'Special offers for Republic Day', 'percentage', 10.00, 500.00, '2024-01-20', '2024-01-26', true),
('Valentine\'s Special', 'Discounts on Valentine\'s Day products', 'buy_x_get_y', 1.00, NULL, '2024-02-10', '2024-02-14', true),
('Holi Celebration', 'Colorful discounts for Holi', 'percentage', 12.00, 600.00, '2024-03-20', '2024-03-25', true),
('Summer Clearance', 'End of summer special discounts', 'fixed_amount', 100.00, 800.00, '2024-05-15', '2024-05-31', true),
('First Purchase', 'Special discount for first-time customers', 'percentage', 20.00, 0.00, '2023-01-01', '2024-12-31', true),
('App-Only Discount', 'Exclusive discount for app users', 'fixed_amount', 50.00, 500.00, '2023-01-01', '2024-12-31', true);

-- Add Promotion Products associations (20 more)
INSERT INTO promotion_products (promotion_id, product_id) VALUES
(6, 1), -- Independence Day Sale - Amul Milk
(6, 3), -- Independence Day Sale - Bananas
(6, 5), -- Independence Day Sale - Thums Up
(7, 6), -- Dussehra Celebration - Haldiram Aloo Bhujia
(7, 9), -- Dussehra Celebration - Amul Paneer
(7, 2), -- Dussehra Celebration - Britannia Bread
(8, 4), -- Black Friday Deals - Chicken Breast
(8, 7), -- Black Friday Deals - Vim Dishwash Liquid
(8, 8), -- Black Friday Deals - Colgate MaxFresh
(9, 1), -- Christmas Special - Amul Milk
(9, 2), -- Christmas Special - Britannia Bread
(9, 9), -- Christmas Special - Amul Paneer
(10, 3), -- Republic Day Offer - Bananas
(10, 5), -- Republic Day Offer - Thums Up
(11, 6), -- Valentine's Special - Haldiram Aloo Bhujia
(11, 8), -- Valentine's Special - Colgate MaxFresh
(12, 4), -- Holi Celebration - Chicken Breast
(12, 9), -- Holi Celebration - Amul Paneer
(13, 7), -- Summer Clearance - Vim Dishwash Liquid
(13, 10); -- Summer Clearance - Brown Bread

-- Add more Delivery Assignments (25 more)
INSERT INTO delivery_assignments (order_id, vehicle_id, employee_id, delivery_zone_id, scheduled_date, delivery_status, actual_delivery_time) VALUES
(1, 3, 3, 2, '2023-07-10 10:30:00', 'delivered', '2023-07-10 11:15:00'),
(2, 2, 4, 4, '2023-07-11 14:00:00', 'delivered', '2023-07-11 14:45:00'),
(3, 1, 5, 1, '2023-07-12 11:00:00', 'delivered', '2023-07-12 11:40:00'),
(4, 4, 3, 3, '2023-07-13 16:30:00', 'delivered', '2023-07-13 17:10:00'),
(5, 5, 4, 5, '2023-07-14 12:00:00', 'delivered', '2023-07-14 12:50:00'),
(1, 6, 5, 6, '2023-07-15 09:00:00', 'delivered', '2023-07-15 09:45:00'),
(2, 7, 3, 7, '2023-07-16 15:30:00', 'delivered', '2023-07-16 16:20:00'),
(3, 8, 4, 8, '2023-07-17 13:00:00', 'delivered', '2023-07-17 13:50:00'),
(4, 9, 5, 9, '2023-07-18 11:30:00', 'delivered', '2023-07-18 12:15:00'),
(5, 10, 3, 10, '2023-07-19 14:00:00', 'delivered', '2023-07-19 14:55:00'),
(1, 11, 4, 11, '2023-07-20 10:00:00', 'delivered', '2023-07-20 10:50:00'),
(2, 12, 5, 12, '2023-07-21 12:30:00', 'delivered', '2023-07-21 13:10:00'),
(3, 13, 3, 13, '2023-07-22 16:00:00', 'delivered', '2023-07-22 16:45:00'),
(4, 14, 4, 14, '2023-07-23 09:30:00', 'delivered', '2023-07-23 10:20:00'),
(5, 15, 5, 15, '2023-07-24 11:00:00', 'delivered', '2023-07-24 11:55:00'),
(1, 1, 3, 1, '2023-07-25 13:30:00', 'delivered', '2023-07-25 14:10:00'),
(2, 2, 4, 2, '2023-07-26 15:00:00', 'delivered', '2023-07-26 15:40:00'),
(3, 3, 5, 3, '2023-07-27 10:30:00', 'delivered', '2023-07-27 11:15:00'),
(4, 4, 3, 4, '2023-07-28 12:00:00', 'delivered', '2023-07-28 12:45:00'),
(5, 5, 4, 5, '2023-07-29 16:30:00', 'delivered', '2023-07-29 17:20:00'),
(1, 8, 5, 8, '2024-05-02 09:30:00', 'pending', NULL),
(2, 10, 3, 10, '2024-05-02 10:30:00', 'pending', NULL),
(3, 11, 4, 11, '2024-05-02 11:30:00', 'in_transit', NULL),
(4, 14, 5, 14, '2024-05-02 13:30:00', 'in_transit', NULL),
(5, 3, 3, 3, '2024-05-02 14:30:00', 'pending', NULL);

-- Add more Loyalty Program Transactions (20 more)
INSERT INTO loyalty_program_transactions (customer_id, program_id, order_id, points, transaction_type, reference_id, notes) VALUES
(1, 1, 1, 750, 'earn', 'ORD-1-20230710', 'Points earned on order #1'),
(2, 1, 2, 500, 'earn', 'ORD-2-20230711', 'Points earned on order #2'),
(3, 2, 3, 1200, 'earn', 'ORD-3-20230712', 'Points earned on order #3 with Premium Club bonus'),
(4, 1, 4, 350, 'earn', 'ORD-4-20230713', 'Points earned on order #4'),
(5, 2, 5, 1800, 'earn', 'ORD-5-20230714', 'Points earned on order #5 with Premium Club bonus'),
(1, 1, NULL, -500, 'redeem', 'RED-001-20230720', 'Redeemed for ₹125 discount'),
(2, 1, NULL, -400, 'redeem', 'RED-002-20230725', 'Redeemed for ₹100 discount'),
(3, 2, NULL, -1000, 'redeem', 'RED-003-20230801', 'Redeemed for ₹500 discount'),
(1, 1, 1, 600, 'earn', 'ORD-1-20230805', 'Points earned on order #1'),
(2, 1, 2, 450, 'earn', 'ORD-2-20230810', 'Points earned on order #2'),
(3, 2, 3, 1500, 'earn', 'ORD-3-20230815', 'Points earned on order #3 with Premium Club bonus'),
(4, 1, 4, 300, 'earn', 'ORD-4-20230820', 'Points earned on order #4'),
(5, 2, 5, 1600, 'earn', 'ORD-5-20230825', 'Points earned on order #5 with Premium Club bonus'),
(1, 1, NULL, 200, 'adjustment', 'ADJ-001-20230901', 'Bonus points for customer loyalty'),
(2, 1, NULL, 150, 'adjustment', 'ADJ-002-20230901', 'Bonus points for customer loyalty'),
(3, 2, NULL, 300, 'adjustment', 'ADJ-003-20230901', 'Bonus points for customer loyalty'),
(4, 1, NULL, 100, 'adjustment', 'ADJ-004-20230901', 'Bonus points for customer loyalty'),
(5, 2, NULL, 250, 'adjustment', 'ADJ-005-20230901', 'Bonus points for customer loyalty'),
(1, 1, NULL, -300, 'expire', 'EXP-001-20231001', 'Points expired after 6 months'),
(2, 1, NULL, -200, 'expire', 'EXP-002-20231001', 'Points expired after 6 months');

-- Add more Feedback (25 more)
INSERT INTO feedback (customer_id, order_id, product_id, rating, comments, status, is_public) VALUES
(1, 1, 1, 4, 'Good quality milk, but the packaging could be better.', 'approved', true),
(2, 2, 5, 5, 'Perfect! Thums Up is always my favorite cola.', 'approved', true),
(3, 3, 4, 3, 'The chicken was fresh but a bit too fatty for my liking.', 'approved', true),
(4, 4, 3, 5, 'The bananas were perfectly ripe and sweet!', 'approved', true),
(5, 5, 9, 4, 'Amul Paneer is consistently good quality.', 'approved', true),
(1, NULL, 6, 5, 'Haldiram\'s Aloo Bhujia is the best in the market!', 'approved', true),
(2, NULL, 8, 4, 'Colgate MaxFresh gives long-lasting freshness.', 'approved', true),
(3, NULL, 10, 3, 'The brown bread was a bit dry.', 'approved', true),
(4, NULL, 2, 5, 'Britannia bread is always fresh and soft.', 'approved', true),
(5, NULL, 7, 4, 'Vim dishwash liquid cleans very effectively.', 'approved', true),
(1, 1, 3, 5, 'The bananas were perfectly ripe and lasted for days!', 'approved', true),
(2, 2, 9, 4, 'Good quality paneer, made great paneer butter masala.', 'approved', true),
(3, 3, 5, 5, 'Thums Up is the best cola out there!', 'approved', true),
(4, 4, 6, 4, 'Good taste, but packet was only 3/4 full.', 'approved', true),
(5, 5, 2, 5, 'Very fresh bread, stays soft for days.', 'approved', true),
(1, NULL, 4, 2, 'The chicken didn\'t seem very fresh.', 'rejected', false),
(2, NULL, 7, 4, 'Works well but the fragrance is too strong.', 'pending', false),
(3, NULL, 8, 5, 'Best toothpaste for fresh breath!', 'pending', false),
(4, NULL, 1, 3, 'Milk was fine but got spoiled before the expiry date.', 'pending', false),
(5, NULL, 10, 4, 'Healthy option, tastes good when toasted.', 'pending', false),
(1, 1, 5, 5, 'Perfect cold drink for summer!', 'approved', true),
(2, 2, 8, 4, 'Good toothpaste, leaves a fresh feeling.', 'approved', true),
(3, 3, 7, 5, 'Excellent dish soap, removes grease easily.', 'approved', true),
(4, 4, 9, 5, 'Best paneer in town, very soft and fresh!', 'approved', true),
(5, 5, 3, 4, 'Good quality bananas at reasonable price.', 'approved', true);

-- Add more Store Product Inventory (20 more)
INSERT INTO store_product_inventory (store_id, product_id, stock_quantity, reorder_level, last_restock_date) VALUES
(4, 1, 40, 10, '2024-05-01'), -- Amul Milk at SmartGrocer Andheri West
(4, 2, 35, 10, '2024-05-01'), -- Britannia Bread at SmartGrocer Andheri West
(4, 3, 80, 20, '2024-05-01'), -- Fresh Bananas at SmartGrocer Andheri West
(4, 4, 15, 5, '2024-05-01'), -- Chicken Breast at SmartGrocer Andheri West
(4, 5, 50, 15, '2024-05-01'), -- Thums Up at SmartGrocer Andheri West
(5, 1, 30, 8, '2024-05-01'), -- Amul Milk at SmartGrocer Powai
(5, 6, 40, 10, '2024-05-01'), -- Haldiram Aloo Bhujia at SmartGrocer Powai
(5, 7, 25, 8, '2024-05-01'), -- Vim Dishwash Liquid at SmartGrocer Powai
(5, 8, 35, 10, '2024-05-01'), -- Colgate MaxFresh at SmartGrocer Powai
(5, 9, 20, 5, '2024-05-01'), -- Amul Paneer at SmartGrocer Powai
(6, 2, 45, 12, '2024-05-01'), -- Britannia Bread at SmartGrocer South Delhi
(6, 4, 20, 6, '2024-05-01'), -- Chicken Breast at SmartGrocer South Delhi
(6, 6, 55, 15, '2024-05-01'), -- Haldiram Aloo Bhujia at SmartGrocer South Delhi
(6, 8, 40, 10, '2024-05-01'), -- Colgate MaxFresh at SmartGrocer South Delhi
(6, 10, 30, 8, '2024-05-01'), -- Brown Bread at SmartGrocer South Delhi
(7, 3, 90, 20, '2024-05-01'), -- Fresh Bananas at SmartGrocer Gurgaon
(7, 5, 60, 15, '2024-05-01'), -- Thums Up at SmartGrocer Gurgaon
(7, 7, 35, 10, '2024-05-01'), -- Vim Dishwash Liquid at SmartGrocer Gurgaon
(7, 9, 25, 6, '2024-05-01'), -- Amul Paneer at SmartGrocer Gurgaon
(7, 1, 35, 8, '2024-05-01'); -- Amul Milk at SmartGrocer Gurgaon 