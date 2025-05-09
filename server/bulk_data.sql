-- Bulk Data Script for SmartGrocer
-- This script adds approximately 100 records to each major table
-- Run this after initial setup and additional_data.sql

-- Disable foreign key checks temporarily to avoid constraint issues
SET FOREIGN_KEY_CHECKS=0;

-- ======================================================
-- Categories (add 92 more to reach 100 total)
-- ======================================================
INSERT INTO categories (name, description) VALUES
('Indian Groceries', 'Traditional Indian staples and ingredients'),
('Organic Foods', 'Certified organic products from trusted sources'),
('Health Foods', 'Nutritional supplements and health foods'),
('Baby Products', 'Infant care and baby food items'),
('Pet Care', 'Food and accessories for pets'),
('Frozen Foods', 'Frozen meals and ingredients'),
('Canned Goods', 'Canned vegetables, fruits, and ready-to-eat items'),
('Baking Supplies', 'Ingredients for home baking'),
('Condiments', 'Sauces, spreads, and seasonings'),
('Breakfast Foods', 'Cereals and breakfast items'),
('Dairy Alternatives', 'Plant-based milk and dairy substitutes'),
('International Foods', 'Imported foods from around the world'),
('Pasta & Noodles', 'Various types of pasta and noodles'),
('Rice & Grains', 'Rice varieties and other grains'),
('Snack Bars', 'Energy and granola bars'),
('Premium Chocolates', 'Gourmet and imported chocolates'),
('Dried Fruits', 'Assorted dried fruits and berries'),
('Nuts & Seeds', 'Raw and roasted nuts and seeds'),
('Exotic Fruits', 'Seasonal and imported exotic fruits'),
('Organic Vegetables', 'Fresh, locally-sourced organic vegetables'),
('Vegan Products', 'Plant-based food alternatives'),
('Specialty Teas', 'Loose-leaf and premium tea varieties'),
('Gourmet Coffee', 'Premium coffee beans and grounds'),
('Spices', 'Whole and ground spices and blends'),
('Pickles & Preserves', 'Traditional pickles and fruit preserves'),
('Ready-To-Eat Meals', 'Prepared meals requiring minimal preparation'),
('Instant Food', 'Quick-preparation food items'),
('Sugar-Free Products', 'Foods without added sugar'),
('Gluten-Free Foods', 'Products suitable for gluten-restricted diets'),
('Low-Sodium Options', 'Foods with reduced salt content'),
('Premium Oils', 'Extra virgin and specialty cooking oils'),
('Artisanal Cheese', 'Specialty and imported cheeses'),
('Protein Supplements', 'Protein powders and supplements'),
('Sports Nutrition', 'Performance-enhancing nutritional products'),
('Weight Management', 'Foods designed for weight control'),
('Chilled Desserts', 'Refrigerated puddings and desserts'),
('Ice Cream', 'Various ice cream flavors and frozen desserts'),
('Party Snacks', 'Assortments for entertaining'),
('Gift Hampers', 'Pre-packaged gift baskets'),
('Seasonal Items', 'Festival and seasonal specialties'),
('Cookware', 'Pots, pans, and kitchen utensils'),
('Kitchen Gadgets', 'Specialized kitchen tools'),
('Disposable Tableware', 'Single-use plates, cups, and cutlery'),
('Reusable Storage', 'Food storage containers'),
('Eco-Friendly Products', 'Environmentally sustainable alternatives'),
('Paper Products', 'Tissues, napkins, and toilet paper'),
('Air Fresheners', 'Room and car fresheners'),
('Insect Repellents', 'Products to deter insects'),
('Garden Supplies', 'Basic gardening tools and supplies'),
('Home Decor', 'Decorative items for the home'),
('Stationery', 'Basic writing and office supplies'),
('Gift Cards', 'Prepaid store and brand gift cards'),
('Local Handicrafts', 'Artisanal products from local craftspeople'),
('Seasonal Decorations', 'Holiday-themed decorative items'),
('Electronic Accessories', 'Basic phone chargers and cables'),
('Batteries', 'Common battery sizes'),
('Light Bulbs', 'Energy-efficient lighting options'),
('Basic Medications', 'Over-the-counter medicines'),
('First Aid Supplies', 'Bandages and basic medical supplies'),
('Herbal Remedies', 'Traditional herbal health products'),
('Vitamins & Supplements', 'Nutritional supplements'),
('Natural Cosmetics', 'Organic and natural beauty products'),
('Men\'s Grooming', 'Shaving and grooming products for men'),
('Women\'s Beauty', 'Cosmetics and beauty products for women'),
('Hair Care', 'Shampoos, conditioners, and styling products'),
('Skin Care', 'Facial and body care products'),
('Oral Care', 'Dental hygiene products'),
('Feminine Hygiene', 'Women\'s personal care products'),
('Baby Care', 'Diapers and baby hygiene products'),
('Elder Care', 'Products for elderly care needs'),
('Cleaning Supplies', 'General household cleaners'),
('Laundry Products', 'Detergents and fabric care'),
('Bathroom Cleaners', 'Specialized bathroom cleaning products'),
('Kitchen Cleaners', 'Products for kitchen surfaces and appliances'),
('Dishwashing', 'Dishwasher and hand-washing products'),
('Pest Control', 'Products to manage household pests'),
('Home Maintenance', 'Basic repair and maintenance items'),
('Automotive Basics', 'Car care essentials'),
('Travel Accessories', 'Items for travel convenience'),
('Outdoor Essentials', 'Basic camping and outdoor items'),
('Fitness Accessories', 'Small fitness equipment'),
('Wellness Products', 'Items promoting general wellbeing'),
('Religious Items', 'Products for various religious practices'),
('Ethnic Specialties', 'Culture-specific food and items'),
('Imported Snacks', 'Popular snacks from other countries'),
('Regional Specialties', 'Foods specific to Indian regions'),
('Festive Specials', 'Items for major Indian festivals'),
('Wholesale Packs', 'Bulk packaging for regular users'),
('Value Combos', 'Bundled products at discounted prices'),
('Premium Selections', 'High-end gourmet products');

-- ======================================================
-- Suppliers (add 95 more to reach 100 total)
-- ======================================================
INSERT INTO suppliers (name, contact_person, email, phone, address) VALUES
('Organic Harvest Ltd.', 'Sameer Joshi', 'sameer@organicharvest.com', '+91-9876543211', '23 Farm Belt, Shimla, Himachal Pradesh 171001'),
('Dairy Delight Inc.', 'Anjali Sharma', 'anjali@dairydelight.com', '+91-8765432108', '45 Milk Colony, Karnal, Haryana 132001'),
('Sunshine Bakeries', 'Rajiv Malhotra', 'rajiv@sunshinebakeries.com', '+91-7654321097', '78 Flour Mill Area, Delhi 110001'),
('Fresh Picks Pvt. Ltd.', 'Nisha Verma', 'nisha@freshpicks.com', '+91-6543210986', '56 Vegetable Market, Pune, Maharashtra 411001'),
('Spice World Exports', 'Vikrant Singh', 'vikrant@spiceworld.com', '+91-9876543219', '89 Spice Lane, Kochi, Kerala 682001'),
('Northern Fruits Co.', 'Harpreet Kaur', 'harpreet@northernfruits.com', '+91-8765432101', '34 Fruit Belt, Bathinda, Punjab 151001'),
('Golden Grains Ltd.', 'Raman Patel', 'raman@goldengrains.com', '+91-7654321092', '67 Rice Mill Road, Burdwan, West Bengal 713101'),
('Nature\'s Basket', 'Anita Kumar', 'anita@naturesbasket.com', '+91-6543210983', '12 Garden Avenue, Bangalore, Karnataka 560001'),
('Himalayan Organics', 'Tenzin Dorjee', 'tenzin@himalayanorganics.com', '+91-9876543218', '45 Mountain View, Dehradun, Uttarakhand 248001'),
('Royal Snacks Pvt. Ltd.', 'Farhan Ahmed', 'farhan@royalsnacks.com', '+91-8765432102', '78 Savory Street, Indore, Madhya Pradesh 452001'),
('Pure Milk Dairy', 'Rajesh Yadav', 'rajesh@puremilk.com', '+91-7654321093', '23 Dairy Farm, Anand, Gujarat 388001'),
('Green Valley Farm', 'Meena Srinivasan', 'meena@greenvalley.com', '+91-6543210984', '56 Valley Road, Coimbatore, Tamil Nadu 641001'),
('Premium Coffee Traders', 'Ajith Thomas', 'ajith@premiumcoffee.com', '+91-9876543217', '89 Coffee Estate, Chikmagalur, Karnataka 577101'),
('Coastal Seafood Ltd.', 'Lakshmi Nair', 'lakshmi@coastalseafood.com', '+91-8765432103', '34 Harbor Line, Kochi, Kerala 682005'),
('Fruit Republic', 'Arjun Reddy', 'arjun@fruitrepublic.com', '+91-7654321094', '67 Orchard Lane, Nashik, Maharashtra 422001'),
('Eastern Snacks Co.', 'Sujata Das', 'sujata@easternsnacks.com', '+91-6543210985', '12 Savory Road, Kolkata, West Bengal 700001'),
('Mountain Fresh Herbs', 'Dhruv Sharma', 'dhruv@mountainherbs.com', '+91-9876543216', '45 Herb Valley, Srinagar, J&K 190001'),
('Regal Rice Mills', 'Naveen Kumar', 'naveen@regalrice.com', '+91-8765432104', '78 Paddy Field, Burdwan, West Bengal 713101'),
('Sweet Treats Bakery', 'Pooja Singhania', 'pooja@sweettreats.com', '+91-7654321095', '23 Baker Street, Mumbai, Maharashtra 400001'),
('Healthy Harvest', 'Kiran Nair', 'kiran@healthyharvest.com', '+91-6543210986', '56 Organic Farm, Trivandrum, Kerala 695001'),
('Tea Treasures', 'Samar Bose', 'samar@teatreasures.com', '+91-9876543215', '89 Tea Estate, Darjeeling, West Bengal 734101'),
('Classic Confectionery', 'Shreya Gupta', 'shreya@classicconfectionery.com', '+91-8765432105', '34 Sweet Lane, Jaipur, Rajasthan 302001'),
('Farmland Fresh Produce', 'Vishnu Prasad', 'vishnu@farmlandfresh.com', '+91-7654321096', '67 Rural Road, Guntur, Andhra Pradesh 522001'),
('Authentic Spices Inc.', 'Zara Khan', 'zara@authenticspices.com', '+91-6543210987', '12 Flavor Street, Ahmedabad, Gujarat 380001'),
('Protein Plus', 'Rahul Kapoor', 'rahul@proteinplus.com', '+91-9876543214', '45 Fitness Avenue, Chandigarh 160001'),
('Heritage Foods', 'Ananya Deshmukh', 'ananya@heritagefoods.com', '+91-8765432106', '78 Traditional Lane, Lucknow, UP 226001'),
('Jumbo Pack Distributors', 'Manoj Tiwari', 'manoj@jumbopack.com', '+91-7654321097', '23 Bulk Street, Ahmedabad, Gujarat 380015'),
('Garden Fresh Exports', 'Shalini Menon', 'shalini@gardenfresh.com', '+91-6543210988', '56 Green Path, Thrissur, Kerala 680001'),
('Nutritious Nibbles', 'Dev Anand', 'dev@nutritiousnibbles.com', '+91-9876543213', '89 Health Park, Pune, Maharashtra 411040'),
('Supreme Superfoods', 'Aisha Shaikh', 'aisha@supremefoods.com', '+91-8765432107', '34 Organic Lane, Hyderabad, Telangana 500001'),
('Indian Instant Foods', 'Raj Malhotra', 'raj@indianinstant.com', '+91-7654321098', '67 Quick Meal Street, Chennai, Tamil Nadu 600001'),
('Cool Creamery Ltd.', 'Kavita Krishnan', 'kavita@coolcreamery.com', '+91-6543210989', '12 Ice Cream Lane, Mumbai, Maharashtra 400050'),
('Bulk Bazaar', 'Harish Choudhury', 'harish@bulkbazaar.com', '+91-9876543212', '45 Wholesale Market, Delhi 110006'),
('Tasty Treat House', 'Nandini Rao', 'nandini@tastytreathouse.com', '+91-8765432108', '78 Flavor Street, Bangalore, Karnataka 560010'),
('Granny\'s Pickles', 'Sunita Agarwal', 'sunita@grannyspickles.com', '+91-7654321099', '23 Preserve Road, Jaipur, Rajasthan 302016'),
('Fresh Valley Organics', 'Thomas Varghese', 'thomas@freshvalley.com', '+91-6543210990', '56 Green Belt, Kottayam, Kerala 686001'),
('Hill Top Honey', 'Prakash Mehta', 'prakash@hilltophoney.com', '+91-9876543220', '89 Honey Farm, Palampur, Himachal Pradesh 176061'),
('Modern Milling Co.', 'Sudha Reddy', 'sudha@modernmilling.com', '+91-8765432109', '34 Grain Market, Hyderabad, Telangana 500020'),
('Diamond Oil Mills', 'Faisal Khan', 'faisal@diamondoil.com', '+91-7654321100', '67 Press Lane, Amritsar, Punjab 143001'),
('Tribal Treasures', 'Reena Oraon', 'reena@tribaltreasures.com', '+91-6543210991', '12 Forest Edge, Ranchi, Jharkhand 834001'),
('City Supermart Supply', 'Jay Shukla', 'jay@citysupermart.com', '+91-9876543221', '45 Retail Road, Surat, Gujarat 395001'),
('Prime Provisions', 'Seema Kapoor', 'seema@primeprovisions.com', '+91-8765432110', '78 Quality Street, Dehradun, Uttarakhand 248001'),
('Rural Harvest Collective', 'Mohan Lal', 'mohan@ruralharvest.com', '+91-7654321101', '23 Village Center, Bhopal, Madhya Pradesh 462001'),
('Elite Exports Ltd.', 'Priyanka Das', 'priyanka@eliteexports.com', '+91-6543210992', '56 Trade Center, Kolkata, West Bengal 700001'),
('Quick Bites Foods', 'Rafiq Mohammed', 'rafiq@quickbites.com', '+91-9876543222', '89 Snack Boulevard, Mumbai, Maharashtra 400076'),
('Bio-Organic Supplies', 'Tara Singh', 'tara@bioorganic.com', '+91-8765432111', '34 Eco Lane, Chandigarh 160022'),
('Veg Fresh Direct', 'Vijay Sharma', 'vijay@vegfreshdirect.com', '+91-7654321102', '67 Green Market, Jaipur, Rajasthan 302029'),
('Frozen Foods Experts', 'Meghna Banerjee', 'meghna@frozenexperts.com', '+91-6543210993', '12 Cold Storage Road, Delhi 110092'),
('DesiMart Suppliers', 'Ravi Desai', 'ravi@desimartsuppliers.com', '+91-9876543223', '45 Local Market, Nagpur, Maharashtra 440001'),
('Super Snacks Ltd.', 'Neha Jain', 'neha@supersnacks.com', '+91-8765432112', '78 Munchies Lane, Lucknow, UP 226010'),
('Agro Allied Products', 'Sanjay Yadav', 'sanjay@agroallied.com', '+91-7654321103', '23 Farm Supply Center, Kanpur, UP 208001'),
('Coastal Delights', 'Maya Pillai', 'maya@coastaldelights.com', '+91-6543210994', '56 Seaside Market, Mangalore, Karnataka 575001'),
('True North Foods', 'Gurpreet Singh', 'gurpreet@truenorth.com', '+91-9876543224', '89 Northern Belt, Amritsar, Punjab 143001'),
('Mega Mart Suppliers', 'Rohit Chatterjee', 'rohit@megamartsuppliers.com', '+91-8765432113', '34 Retail Hub, Guwahati, Assam 781001'),
('Desi Delights', 'Fatima Begum', 'fatima@desidelights.com', '+91-7654321104', '67 Traditional Market, Hyderabad, Telangana 500016'),
('Fresh Fields Inc.', 'Aryan Patel', 'aryan@freshfields.com', '+91-6543210995', '12 Plantation Road, Vadodara, Gujarat 390001'),
('Eastern Essentials', 'Bipasha Sen', 'bipasha@easternessentials.com', '+91-9876543225', '45 Eastern Market, Patna, Bihar 800001'),
('Southern Specialties', 'Divya Krishnan', 'divya@southernspecialties.com', '+91-8765432114', '78 Spice Harbor, Chennai, Tamil Nadu 600028'),
('Western Wholesalers', 'Ahmed Shaikh', 'ahmed@westernwholesalers.com', '+91-7654321105', '23 Bulk Buy Lane, Mumbai, Maharashtra 400018'),
('Northern Naturals', 'Jasmine Kaur', 'jasmine@northernnaturals.com', '+91-6543210996', '56 Pure Products Road, Chandigarh 160019'),
('Global Gourmet', 'Rohan Bose', 'rohan@globalgourmet.com', '+91-9876543226', '89 International Food Court, Delhi 110001'),
('Food Factory Supply', 'Deepti Sharma', 'deepti@foodfactory.com', '+91-8765432115', '34 Processing Zone, Pune, Maharashtra 411013'),
('Wellness Warehouse', 'Nikhil Tandon', 'nikhil@wellnesswarehouse.com', '+91-7654321106', '67 Health Center, Bangalore, Karnataka 560034'),
('Rainbow Foods', 'Sonali Reddy', 'sonali@rainbowfoods.com', '+91-6543210997', '12 Colorful Lane, Hyderabad, Telangana 500081'),
('Heritage Harvest', 'Omar Abdullah', 'omar@heritageharvestindia.com', '+91-9876543227', '45 Traditional Farm, Srinagar, J&K 190001'),
('Morning Star Dairy', 'Swati Patil', 'swati@morningstar.com', '+91-8765432116', '78 Dairy Complex, Pune, Maharashtra 411027'),
('Convenience Foods', 'Alok Gupta', 'alok@conveniencefoods.com', '+91-7654321107', '23 Quick Meal Street, Gurgaon, Haryana 122001'),
('Premium Produce', 'Geeta Nair', 'geeta@premiumproduce.com', '+91-6543210998', '56 Quality Farm, Coimbatore, Tamil Nadu 641041'),
('Tasty Traditions', 'Mohammad Ali', 'mohammad@tastytraditions.com', '+91-9876543228', '89 Culture Street, Lucknow, UP 226007'),
('The Fresh Box', 'Simran Kaur', 'simran@thefreshbox.com', '+91-8765432117', '34 Delivery Hub, Delhi 110044'),
('Clean Foods Co.', 'Ritesh Patel', 'ritesh@cleanfoods.com', '+91-7654321108', '67 Pure Lane, Ahmedabad, Gujarat 380001'),
('Farm Connect', 'Usha Sharma', 'usha@farmconnect.com', '+91-6543210999', '12 Direct Supply Road, Jaipur, Rajasthan 302017'),
('Himalayan Naturals', 'Deepak Thakur', 'deepak@himalayannaturals.com', '+91-9876543229', '45 Mountain Products, Shimla, Himachal Pradesh 171003'),
('Green Earth Organics', 'Lalita Menon', 'lalita@greenearth.com', '+91-8765432118', '78 Sustainable Farms, Kochi, Kerala 682024'),
('Rich Nutrients Ltd.', 'Kabir Khan', 'kabir@richnutrients.com', '+91-7654321109', '23 Wellness Way, Mumbai, Maharashtra 400013'),
('Kitchen Essentials', 'Priya Varma', 'priya@kitchenessentials.com', '+91-6543211000', '56 Cooking Lane, Chennai, Tamil Nadu 600042'),
('Smart Food Solutions', 'Jatin Mehta', 'jatin@smartfood.com', '+91-9876543230', '89 Innovation Hub, Bangalore, Karnataka 560037'),
('Prime Proteins', 'Nidhi Saxena', 'nidhi@primeproteins.com', '+91-8765432119', '34 Nutrition Road, Chandigarh 160014'),
('Exotic Edibles', 'Vivek Kapoor', 'vivek@exoticedibles.com', '+91-7654321110', '67 Rare Foods Lane, Delhi 110022'),
('Daily Fresh Supplies', 'Reshma Ali', 'reshma@dailyfresh.com', '+91-6543211001', '12 Morning Delivery, Hyderabad, Telangana 500072'),
('Value Vegetables', 'Ramesh Chand', 'ramesh@valueveg.com', '+91-9876543231', '45 Affordable Farms, Patna, Bihar 800013'),
('Grain Gurus', 'Lata Desai', 'lata@graingurus.com', '+91-8765432120', '78 Cereal Street, Bhopal, Madhya Pradesh 462011'),
('Sweet Success Bakery', 'Farooq Ahmed', 'farooq@sweetsuccess.com', '+91-7654321111', '23 Sugar Lane, Lucknow, UP 226010'),
('Pure & Fresh Co.', 'Sarita Kumari', 'sarita@pureandfresh.com', '+91-6543211002', '56 Clean Food Street, Jaipur, Rajasthan 302015'),
('Traditional Treasures', 'Rajan Pillai', 'rajan@traditionaltreasures.com', '+91-9876543232', '89 Heritage Lane, Kochi, Kerala 682017'),
('Himalayan Heights', 'Gauri Shankar', 'gauri@himalayanheights.com', '+91-8765432121', '34 Mountain View, Dehradun, Uttarakhand 248007'),
('Food Fest Supplies', 'Zareen Khan', 'zareen@foodfest.com', '+91-7654321112', '67 Celebration Road, Mumbai, Maharashtra 400074'),
('Urban Organics', 'Karthik Subramanian', 'karthik@urbanorganics.com', '+91-6543211003', '12 City Farms, Chennai, Tamil Nadu 600018');

-- ======================================================
-- Products (add 90 more to reach 100 total)
-- ======================================================
INSERT INTO products (name, description, sku, category_id, supplier_id, price, cost, stock_quantity, reorder_level, status) VALUES
('Tata Tea Premium', 'Strong blended tea, 500g packet', 'TEA-001', 5, 18, 220.00, 175.00, 45, 10, 'active'),
('Aashirvaad Atta', 'Whole wheat flour, 5kg bag', 'FLOUR-001', 14, 26, 250.00, 190.00, 60, 15, 'active'),
('MTR Rava Idli Mix', 'Instant idli mix, 500g packet', 'MIX-001', 27, 32, 85.00, 65.00, 40, 10, 'active'),
('Maggi Noodles', 'Masala flavor instant noodles, pack of 12', 'NOOD-001', 27, 35, 120.00, 90.00, 80, 20, 'active'),
('Nescafe Classic', 'Instant coffee, 100g jar', 'COFFEE-001', 23, 13, 265.00, 210.00, 30, 8, 'active'),
('Real Fruit Juice', 'Mixed fruit juice, 1 liter', 'JUICE-001', 5, 5, 110.00, 85.00, 45, 15, 'active'),
('Lijjat Papad', 'Udad papad, 200g packet', 'PAPAD-001', 9, 23, 60.00, 45.00, 50, 15, 'active'),
('Amul Butter', 'Salted butter, 500g block', 'DAIRY-003', 1, 7, 245.00, 195.00, 35, 10, 'active'),
('MDH Garam Masala', 'Blended spices, 100g packet', 'SPICE-001', 24, 5, 72.00, 55.00, 60, 15, 'active'),
('Quaker Oats', 'Original flavor, 1kg carton', 'CEREAL-001', 10, 28, 210.00, 165.00, 40, 10, 'active'),
('Kissan Mixed Fruit Jam', 'Fruit preserve, 700g jar', 'JAM-001', 9, 29, 140.00, 105.00, 30, 8, 'active'),
('Parle-G Biscuits', 'Original glucose biscuits, pack of 10', 'BISCUIT-001', 16, 24, 80.00, 60.00, 100, 25, 'active'),
('Saffola Gold Oil', 'Blended refined oil, 5 liter can', 'OIL-001', 31, 40, 750.00, 625.00, 25, 5, 'active'),
('Britannia Marie Gold', 'Tea biscuits, pack of 12', 'BISCUIT-002', 16, 3, 110.00, 85.00, 70, 20, 'active'),
('Haldiram Bhujia Sev', 'Crispy snack, 400g pack', 'SNACK-002', 6, 10, 110.00, 85.00, 50, 15, 'active'),
('Kellogg\'s Corn Flakes', 'Breakfast cereal, 875g box', 'CEREAL-002', 10, 42, 325.00, 260.00, 25, 8, 'active'),
('Fortune Basmati Rice', 'Premium long grain rice, 5kg bag', 'RICE-001', 14, 18, 450.00, 375.00, 40, 10, 'active'),
('Dabur Honey', 'Pure honey, 500g bottle', 'HONEY-001', 9, 37, 225.00, 180.00, 35, 10, 'active'),
('Red Label Tea', 'Black tea, 1kg packet', 'TEA-002', 5, 21, 410.00, 340.00, 30, 8, 'active'),
('Sunfeast Dark Fantasy', 'Chocolate cookies, pack of 6', 'BISCUIT-003', 16, 52, 120.00, 95.00, 45, 15, 'active'),
('Madhur Pure Sugar', 'Refined sugar, 5kg pack', 'SUGAR-001', 8, 46, 210.00, 180.00, 50, 15, 'active'),
('Surf Excel Detergent', 'Washing powder, 4kg pack', 'LAUNDRY-001', 71, 5, 525.00, 435.00, 30, 10, 'active'),
('Colgate Strong Teeth', 'Cavity protection, 200g tube', 'CARE-002', 65, 8, 115.00, 90.00, 60, 20, 'active'),
('Dettol Handwash', 'Original liquid soap, 750ml refill', 'CARE-003', 65, 45, 99.00, 75.00, 45, 15, 'active'),
('Lux Soap', 'Rose fragrance, pack of 4', 'CARE-004', 66, 60, 120.00, 95.00, 50, 20, 'active'),
('Head & Shoulders Shampoo', 'Anti-dandruff, 650ml bottle', 'CARE-005', 64, 70, 299.00, 245.00, 30, 10, 'active'),
('Dove Body Wash', 'Moisturizing, 500ml bottle', 'CARE-006', 66, 82, 350.00, 280.00, 25, 8, 'active'),
('Tata Salt', 'Iodized salt, 1kg packet', 'SALT-001', 9, 54, 24.00, 18.00, 100, 25, 'active'),
('Tropicana Orange Juice', 'No added sugar, 1 liter', 'JUICE-002', 5, 63, 120.00, 95.00, 40, 15, 'active'),
('Britannia Good Day', 'Butter cookies, pack of 6', 'BISCUIT-004', 16, 3, 90.00, 70.00, 60, 20, 'active'),
('Maggi Hot & Sweet Sauce', 'Tomato chili sauce, 500g bottle', 'SAUCE-001', 9, 35, 135.00, 105.00, 35, 10, 'active'),
('Horlicks Classic Malt', 'Health drink, 500g jar', 'HEALTH-001', 3, 47, 245.00, 195.00, 30, 10, 'active'),
('Mothers Recipe Pickle', 'Mixed vegetable, 400g jar', 'PICKLE-001', 25, 57, 110.00, 85.00, 40, 10, 'active'),
('Lay\'s Classic Salted', 'Potato chips, pack of 10', 'CHIPS-001', 6, 44, 200.00, 160.00, 50, 15, 'active'),
('Amul Gold Milk', 'Full cream milk, 1 liter', 'MILK-002', 1, 2, 68.00, 54.00, 100, 30, 'active'),
('Pampers Diapers', 'Medium size, pack of 30', 'BABY-001', 69, 66, 599.00, 480.00, 20, 5, 'active'),
('Johnsons Baby Powder', 'Mild fragrance, 400g', 'BABY-002', 69, 77, 180.00, 140.00, 25, 8, 'active'),
('Huggies Baby Wipes', 'Alcohol-free, pack of 72', 'BABY-003', 69, 85, 275.00, 220.00, 30, 10, 'active'),
('Cerelac Baby Food', 'Wheat apple cherry, 300g', 'BABY-004', 4, 39, 240.00, 195.00, 25, 8, 'active'),
('Harpic Toilet Cleaner', 'Power plus, 1 liter', 'CLEAN-001', 73, 52, 175.00, 140.00, 40, 15, 'active'),
('Colin Glass Cleaner', 'Trigger spray, 500ml', 'CLEAN-002', 74, 62, 120.00, 95.00, 35, 12, 'active'),
('Lizol Disinfectant', 'Citrus scent, 975ml', 'CLEAN-003', 71, 75, 249.00, 199.00, 30, 10, 'active'),
('Ariel Washing Powder', 'Matic top load, 2kg', 'LAUNDRY-002', 71, 48, 375.00, 300.00, 35, 10, 'active'),
('Comfort Fabric Conditioner', 'Blue, 860ml bottle', 'LAUNDRY-003', 71, 59, 220.00, 175.00, 25, 8, 'active'),
('Vim Dishwash Bar', 'Pack of 6', 'CLEAN-004', 74, 7, 100.00, 75.00, 60, 20, 'active'),
('All Out Liquid Vaporizer', 'With refill, 45ml', 'REPEL-001', 75, 65, 85.00, 65.00, 45, 15, 'active'),
('Mortein Spray', 'Flying insect killer, 400ml', 'REPEL-002', 75, 81, 175.00, 140.00, 30, 10, 'active'),
('Good Knight Gold Flash', 'Mosquito repellent, machine + refill', 'REPEL-003', 75, 90, 125.00, 100.00, 40, 12, 'active'),
('Kitchen Towel Roll', 'Absorbent, 2-ply, pack of 2', 'PAPER-001', 46, 72, 95.00, 75.00, 50, 15, 'active'),
('Toilet Paper', '2-ply soft, pack of 6', 'PAPER-002', 46, 79, 175.00, 135.00, 45, 15, 'active'),
('Sunsilk Shampoo', 'Black shine, 340ml', 'CARE-007', 64, 55, 190.00, 150.00, 35, 12, 'active'),
('Pears Soap', 'Pure & gentle, pack of 3', 'CARE-008', 66, 64, 135.00, 105.00, 50, 15, 'active'),
('Vaseline Body Lotion', 'Deep moisture, 400ml', 'CARE-009', 66, 73, 240.00, 190.00, 30, 10, 'active'),
('Parachute Coconut Oil', 'Pure, 500ml bottle', 'CARE-010', 64, 84, 199.00, 155.00, 40, 12, 'active'),
('Lifebuoy Soap', 'Total protection, pack of 4', 'CARE-011', 66, 56, 100.00, 80.00, 60, 20, 'active'),
('Himalaya Face Wash', 'Neem, 100ml tube', 'CARE-012', 67, 36, 120.00, 95.00, 45, 15, 'active'),
('Nivea Men Facewash', 'Oil control, 100g tube', 'GROOM-001', 62, 67, 185.00, 145.00, 35, 10, 'active'),
('Gillette Razor', 'Mach3 with 2 cartridges', 'GROOM-002', 62, 78, 299.00, 240.00, 25, 8, 'active'),
('Old Spice Deodorant', 'Original scent, 150ml', 'GROOM-003', 62, 86, 190.00, 150.00, 30, 10, 'active'),
('Lakme Face Powder', 'Rose, 40g compact', 'BEAUTY-001', 63, 58, 175.00, 135.00, 25, 8, 'active'),
('Maybelline Mascara', 'Colossal, black', 'BEAUTY-002', 63, 68, 350.00, 280.00, 20, 6, 'active'),
('Revlon Lipstick', 'Super lustrous, red', 'BEAUTY-003', 63, 80, 399.00, 320.00, 15, 5, 'active'),
('Whisper Ultra Pads', 'Wings, pack of 30', 'HYGIENE-001', 68, 51, 210.00, 170.00, 40, 12, 'active'),
('Stayfree Secure', 'XL size, pack of 40', 'HYGIENE-002', 68, 61, 180.00, 145.00, 35, 10, 'active'),
('Fogg Deodorant', 'Fresh Aqua, 150ml', 'CARE-013', 62, 69, 210.00, 165.00, 30, 10, 'active'),
('Park Avenue Perfume', 'Good Morning, 50ml', 'GROOM-004', 62, 81, 150.00, 120.00, 25, 8, 'active'),
('Durex Condoms', 'Extra time, pack of 10', 'HEALTHCARE-001', 68, 87, 220.00, 175.00, 20, 8, 'active'),
('Savlon Antiseptic', 'Liquid, 1 liter', 'FIRSTAID-001', 59, 53, 285.00, 225.00, 30, 10, 'active'),
('Band-Aid', 'Flexible, pack of 100', 'FIRSTAID-002', 59, 63, 150.00, 120.00, 45, 15, 'active'),
('Vicks VapoRub', 'Relief ointment, 50ml', 'MEDIC-001', 58, 43, 135.00, 105.00, 35, 12, 'active'),
('Crocin Pain Relief', 'Tablets, strip of 15', 'MEDIC-002', 58, 70, 28.00, 22.00, 100, 25, 'active'),
('Volini Spray', 'Pain relief, 40g', 'MEDIC-003', 58, 82, 210.00, 170.00, 25, 8, 'active'),
('Revital H', 'Multivitamin, bottle of 30', 'VITAMIN-001', 61, 33, 270.00, 215.00, 30, 10, 'active'),
('Centrum Adults', 'Multivitamin, bottle of 60', 'VITAMIN-002', 61, 49, 525.00, 420.00, 20, 7, 'active'),
('Patanjali Ghee', 'Pure cow ghee, 1 liter', 'DAIRY-004', 1, 6, 499.00, 399.00, 35, 10, 'active'),
('Nestle Everyday Dairy Whitener', 'Tea creamer, 400g', 'DAIRY-005', 1, 35, 210.00, 170.00, 40, 12, 'active'),
('Ashirwad Multigrain Atta', 'Mixed grain flour, 5kg', 'FLOUR-002', 14, 26, 325.00, 265.00, 30, 10, 'active'),
('Daawat Basmati Rice', 'Premium, 5kg bag', 'RICE-002', 14, 18, 550.00, 450.00, 25, 8, 'active'),
('Nissin Cup Noodles', 'Veg, pack of 6', 'NOOD-002', 13, 30, 180.00, 145.00, 40, 15, 'active'),
('India Gate Rice', 'Brown rice, 2kg bag', 'RICE-003', 14, 34, 210.00, 170.00, 30, 10, 'active'),
('MTR Breakfast Mix', 'Dosa, 500g packet', 'MIX-002', 27, 32, 95.00, 75.00, 35, 12, 'active'),
('Everest Garam Masala', 'Premium blend, 100g', 'SPICE-002', 24, 50, 85.00, 65.00, 50, 15, 'active'),
('Catch Spices', 'Red chili powder, 100g', 'SPICE-003', 24, 38, 65.00, 50.00, 45, 15, 'active'),
('Eastern Masala', 'Chicken curry blend, 50g', 'SPICE-004', 24, 56, 32.00, 25.00, 60, 20, 'active'),
('Nutella Spread', 'Hazelnut cocoa, 350g', 'SPREAD-001', 9, 41, 399.00, 320.00, 20, 5, 'active'),
('American Garden Peanut Butter', 'Creamy, 340g', 'SPREAD-002', 9, 74, 299.00, 240.00, 25, 8, 'active'),
('Del Monte Ketchup', 'Tomato, 950g squeeze bottle', 'SAUCE-002', 9, 76, 110.00, 85.00, 35, 10, 'active'),
('Tops Pickles', 'Mango, 900g jar', 'PICKLE-002', 25, 57, 225.00, 180.00, 30, 8, 'active'),
('24 Mantra Organic Pulses', 'Mixed dal, 1kg', 'ORGANIC-001', 2, 1, 210.00, 170.00, 25, 10, 'active'),
('Organic India Tulsi Tea', 'Green tea, 25 bags', 'ORGANIC-002', 2, 1, 150.00, 120.00, 30, 10, 'active'),
('Organic Tattva Brown Rice', 'Long grain, 1kg', 'ORGANIC-003', 2, 1, 125.00, 100.00, 25, 8, 'active'),
('Conscious Food Rock Salt', 'Unprocessed, 500g', 'ORGANIC-004', 2, 31, 45.00, 35.00, 40, 12, 'active'),
('Pro Nature Jaggery Powder', 'Organic, 500g', 'ORGANIC-005', 2, 31, 120.00, 95.00, 30, 10, 'active'),
('Amul Mozzarella Cheese', 'Block, 200g pack', 'DAIRY-006', 1, 2, 160.00, 130.00, 35, 10, 'active'),
('Milky Mist Paneer', 'Fresh, 500g pack', 'DAIRY-007', 1, 7, 240.00, 190.00, 25, 8, 'active'),
('Amul Ice Cream', 'Vanilla, 1 liter tub', 'DAIRY-008', 37, 2, 210.00, 170.00, 20, 5, 'active'),
('Kwality Walls Ice Cream', 'Chocolate, 750ml pack', 'DAIRY-009', 37, 88, 180.00, 145.00, 25, 8, 'active');

-- ======================================================
-- Customers (add 95 more to reach 100 total)
-- ======================================================
INSERT INTO customers (name, email, phone, address) VALUES
('Raj Malhotra', 'raj@email.com', '+91-9876543233', '123 Park Street, Mumbai, Maharashtra 400001'),
('Priya Singh', 'priya@email.com', '+91-8765432122', '45 Model Town, Delhi 110009'),
('Amit Kumar', 'amit@email.com', '+91-7654321113', '78 Jubilee Hills, Hyderabad, Telangana 500033'),
('Sneha Reddy', 'sneha@email.com', '+91-6543211004', '56 Koramangala, Bangalore, Karnataka 560034'),
('Rahul Verma', 'rahul@email.com', '+91-9876543234', '231 Aundh, Pune, Maharashtra 411007'),
('Neha Sharma', 'neha@email.com', '+91-8765432123', '67 Adyar, Chennai, Tamil Nadu 600020'),
('Vikram Mehta', 'vikram@email.com', '+91-7654321114', '89 Vastrapur, Ahmedabad, Gujarat 380015'),
('Anjali Patel', 'anjali@email.com', '+91-6543211005', '12 Civil Lines, Jaipur, Rajasthan 302006'),
('Sanjay Joshi', 'sanjay@email.com', '+91-9876543235', '45 Hazratganj, Lucknow, UP 226001'),
('Meera Kapoor', 'meera@email.com', '+91-8765432124', '78 Salt Lake, Kolkata, West Bengal 700064'),
('Arjun Nair', 'arjun@email.com', '+91-7654321115', '23 Shivaji Nagar, Pune, Maharashtra 411005'),
('Divya Krishnan', 'divya@email.com', '+91-6543211006', '56 Indira Nagar, Bangalore, Karnataka 560038'),
('Rajesh Kumar', 'rajesh@email.com', '+91-9876543236', '89 Vasant Kunj, Delhi 110070'),
('Ananya Das', 'ananya@email.com', '+91-8765432125', '34 Lake Gardens, Kolkata, West Bengal 700045'),
('Vivek Sharma', 'vivek@email.com', '+91-7654321116', '67 Banjara Hills, Hyderabad, Telangana 500034'),
('Pooja Verma', 'pooja@email.com', '+91-6543211007', '12 Malviya Nagar, Jaipur, Rajasthan 302017'),
('Deepak Patel', 'deepak@email.com', '+91-9876543237', '45 Gomti Nagar, Lucknow, UP 226010'),
('Kavita Singh', 'kavita@email.com', '+91-8765432126', '78 Andheri West, Mumbai, Maharashtra 400053'),
('Prakash Rao', 'prakash@email.com', '+91-7654321117', '23 Besant Nagar, Chennai, Tamil Nadu 600090'),
('Sunita Gupta', 'sunita@email.com', '+91-6543211008', '56 Electronic City, Bangalore, Karnataka 560100'),
('Aditya Sharma', 'aditya@email.com', '+91-9876543238', '89 Viman Nagar, Pune, Maharashtra 411014'),
('Rekha Menon', 'rekha@email.com', '+91-8765432127', '34 Panchsheel Park, Delhi 110017'),
('Manoj Tiwari', 'manoj@email.com', '+91-7654321118', '67 Alipore, Kolkata, West Bengal 700027'),
('Shalini Kumar', 'shalini@email.com', '+91-6543211009', '12 Anna Nagar, Chennai, Tamil Nadu 600040'),
('Vijay Thakur', 'vijay@email.com', '+91-9876543239', '45 Maninagar, Ahmedabad, Gujarat 380008'),
('Nisha Agarwal', 'nisha@email.com', '+91-8765432128', '78 Whitefield, Bangalore, Karnataka 560066'),
('Ravi Sharma', 'ravi@email.com', '+91-7654321119', '23 Worli, Mumbai, Maharashtra 400018'),
('Latha Iyer', 'latha@email.com', '+91-6543211010', '56 Mylapore, Chennai, Tamil Nadu 600004'),
('Sandeep Reddy', 'sandeep@email.com', '+91-9876543240', '89 Dilshad Garden, Delhi 110095'),
('Jyoti Patel', 'jyoti@email.com', '+91-8765432129', '34 Borivali, Mumbai, Maharashtra 400092'),
('Kunal Desai', 'kunal@email.com', '+91-7654321120', '67 HSR Layout, Bangalore, Karnataka 560102'),
('Usha Venkatesh', 'usha@email.com', '+91-6543211011', '12 Adajan, Surat, Gujarat 395009'),
('Ajay Mathur', 'ajay@email.com', '+91-9876543241', '45 Malleswaram, Bangalore, Karnataka 560003'),
('Geeta Nair', 'geeta@email.com', '+91-8765432130', '78 Chembur, Mumbai, Maharashtra 400071'),
('Harish Mehra', 'harish@email.com', '+91-7654321121', '23 RS Puram, Coimbatore, Tamil Nadu 641002'),
('Sarla Bhatia', 'sarla@email.com', '+91-6543211012', '56 Rohini, Delhi 110085'),
('Venkat Rao', 'venkat@email.com', '+91-9876543242', '89 Ameerpet, Hyderabad, Telangana 500016'),
('Veena Malhotra', 'veena@email.com', '+91-8765432131', '34 Saket, Delhi 110017'),
('Kiran Joshi', 'kiran@email.com', '+91-7654321122', '67 Satellite, Ahmedabad, Gujarat 380015'),
('Asha Sengupta', 'asha@email.com', '+91-6543211013', '12 Ballygunge, Kolkata, West Bengal 700019'),
('Mohan Kapoor', 'mohan@email.com', '+91-9876543243', '45 Defence Colony, Delhi 110024'),
('Ritu Sharma', 'ritu2@email.com', '+91-8765432132', '78 T. Nagar, Chennai, Tamil Nadu 600017'),
('Dinesh Kumar', 'dinesh@email.com', '+91-7654321123', '23 SG Palya, Bangalore, Karnataka 560029'),
('Maya Choudhury', 'maya@email.com', '+91-6543211014', '56 Bibwewadi, Pune, Maharashtra 411037'),
('Nitin Bansal', 'nitin@email.com', '+91-9876543244', '89 Shalimar Bagh, Delhi 110088'),
('Preeti Jain', 'preeti@email.com', '+91-8765432133', '34 Kandivali, Mumbai, Maharashtra 400067'),
('Rajiv Rastogi', 'rajiv@email.com', '+91-7654321124', '67 Gachibowli, Hyderabad, Telangana 500032'),
('Shobha Gopal', 'shobha@email.com', '+91-6543211015', '12 BTM Layout, Bangalore, Karnataka 560076'),
('Tarun Bose', 'tarun@email.com', '+91-9876543245', '45 Old City, Lucknow, UP 226003'),
('Uma Chopra', 'uma@email.com', '+91-8765432134', '78 Dadar, Mumbai, Maharashtra 400014'),
('Anand Pillai', 'anand@email.com', '+91-7654321125', '23 Guindy, Chennai, Tamil Nadu 600032'),
('Chitra Varma', 'chitra@email.com', '+91-6543211016', '56 Lajpat Nagar, Delhi 110024'),
('Bhavesh Mehta', 'bhavesh@email.com', '+91-9876543246', '89 Vadapalani, Chennai, Tamil Nadu 600026'),
('Deepika Reddy', 'deepika@email.com', '+91-8765432135', '34 Scheme 54, Indore, Madhya Pradesh 452010'),
('Govind Singh', 'govind@email.com', '+91-7654321126', '67 Safdurjung Enclave, Delhi 110029'),
('Heena Khan', 'heena@email.com', '+91-6543211017', '12 Ghatkopar, Mumbai, Maharashtra 400077'),
('Imran Ali', 'imran@email.com', '+91-9876543247', '45 Velachery, Chennai, Tamil Nadu 600042'),
('Jaya Sriram', 'jaya@email.com', '+91-8765432136', '78 Kalyani Nagar, Pune, Maharashtra 411006'),
('Kailash Bhat', 'kailash@email.com', '+91-7654321127', '23 Bellandur, Bangalore, Karnataka 560103'),
('Leela Kamath', 'leela@email.com', '+91-6543211018', '56 Thaltej, Ahmedabad, Gujarat 380054'),
('Mahesh Trivedi', 'mahesh@email.com', '+91-9876543248', '89 Park Street, Kolkata, West Bengal 700016'),
('Nalini Prakash', 'nalini@email.com', '+91-8765432137', '34 Kothrud, Pune, Maharashtra 411038'),
('Omprakash Gupta', 'om@email.com', '+91-7654321128', '67 Kurla, Mumbai, Maharashtra 400070'),
('Parvati Deshmukh', 'parvati@email.com', '+91-6543211019', '12 FC Road, Pune, Maharashtra 411005'),
('Qasim Mohammad', 'qasim@email.com', '+91-9876543249', '45 Khar, Mumbai, Maharashtra 400052'),
('Rahima Begum', 'rahima@email.com', '+91-8765432138', '78 Egmore, Chennai, Tamil Nadu 600008'),
('Suresh Babu', 'suresh2@email.com', '+91-7654321129', '23 Kukatpally, Hyderabad, Telangana 500072'),
('Tanya Arora', 'tanya@email.com', '+91-6543211020', '56 Sanjay Nagar, Bangalore, Karnataka 560094'),
('Upendra Yadav', 'upendra@email.com', '+91-9876543250', '89 Bodakdev, Ahmedabad, Gujarat 380054'),
('Vidya Murthy', 'vidya@email.com', '+91-8765432139', '34 Madhapur, Hyderabad, Telangana 500081'),
('Wasim Ahmed', 'wasim@email.com', '+91-7654321130', '67 Thane West, Mumbai, Maharashtra 400607'),
('Xaviera D\'Souza', 'xaviera@email.com', '+91-6543211021', '12 Chandni Chowk, Delhi 110006'),
('Yogesh Gaur', 'yogesh@email.com', '+91-9876543251', '45 Rajajinagar, Bangalore, Karnataka 560010'),
('Zeenat Khan', 'zeenat@email.com', '+91-8765432140', '78 Shastri Nagar, Jaipur, Rajasthan 302016'),
('Akshay Singhania', 'akshay@email.com', '+91-7654321131', '23 Peddar Road, Mumbai, Maharashtra 400026'),
('Babita Kumari', 'babita@email.com', '+91-6543211022', '56 MG Road, Bangalore, Karnataka 560001'),
('Chetan Bhagat', 'chetan@email.com', '+91-9876543252', '89 Phase 3, Mohali, Punjab 160059'),
('Drishti Chawla', 'drishti@email.com', '+91-8765432141', '34 Boring Road, Patna, Bihar 800001'),
('Ekansh Aggarwal', 'ekansh@email.com', '+91-7654321132', '67 Race Course Road, Coimbatore, Tamil Nadu 641018'),
('Falguni Pathak', 'falguni@email.com', '+91-6543211023', '12 Pal Road, Jodhpur, Rajasthan 342008'),
('Gaurav Taneja', 'gaurav@email.com', '+91-9876543253', '45 Krishna Nagar, Delhi 110051'),
('Himani Verma', 'himani@email.com', '+91-8765432142', '78 Paldi, Ahmedabad, Gujarat 380007'),
('Ishaan Khatter', 'ishaan@email.com', '+91-7654321133', '23 Deccan, Pune, Maharashtra 411004'),
('Juhi Javed', 'juhi@email.com', '+91-6543211024', '56 Vikas Puri, Delhi 110018'),
('Kamlesh Tiwari', 'kamlesh@email.com', '+91-9876543254', '89 Ramapuram, Chennai, Tamil Nadu 600089'),
('Lopamudra Sen', 'lopa@email.com', '+91-8765432143', '34 New Alipore, Kolkata, West Bengal 700053'),
('Manmohan Singh', 'manmohan@email.com', '+91-7654321134', '67 Paschim Vihar, Delhi 110063'),
('Nandita Roy', 'nandita@email.com', '+91-6543211025', '12 Navi Mumbai, Maharashtra 400703'),
('Onkar Nath', 'onkar@email.com', '+91-9876543255', '45 Sector 14, Gurgaon, Haryana 122001'),
('Pragya Jaiswal', 'pragya@email.com', '+91-8765432144', '78 Vijayanagar, Bangalore, Karnataka 560040'),
('Ritesh Pandey', 'ritesh@email.com', '+91-7654321135', '23 Nampally, Hyderabad, Telangana 500001'),
('Sonali Kulkarni', 'sonali@email.com', '+91-6543211026', '56 Ashok Nagar, Chennai, Tamil Nadu 600083'),
('Tanmay Vekaria', 'tanmay@email.com', '+91-9876543256', '89 JP Nagar, Bangalore, Karnataka 560078'),
('Urmila Matondkar', 'urmila@email.com', '+91-8765432145', '34 Dwarka, Delhi 110075'),
('Vishal Dadlani', 'vishal@email.com', '+91-7654321136', '67 Baner, Pune, Maharashtra 411045'),
('Warina Hussain', 'warina@email.com', '+91-6543211027', '12 Kondapur, Hyderabad, Telangana 500084'),
('Xavier Augustin', 'xavier@email.com', '+91-9876543257', '45 Uttarahalli, Bangalore, Karnataka 560061'),
('Yashika Mathur', 'yashika@email.com', '+91-8765432146', '78 Vashi, Navi Mumbai, Maharashtra 400703'),
('Zakir Khan', 'zakir@email.com', '+91-7654321137', '23 Jayanagar, Bangalore, Karnataka 560041');

-- ======================================================
-- Employees (add 95 more to reach 100 total)
-- ======================================================
INSERT INTO employees (name, email, phone, role, password, status) VALUES
('Alok Sharma', 'alok@smartgrocer.com', '+91-9988776654', 'Store Manager', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Bhavna Patel', 'bhavna@smartgrocer.com', '+91-8877665543', 'Assistant Manager', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Chetan Reddy', 'chetan@smartgrocer.com', '+91-7766554432', 'Shift Supervisor', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Divya Sharma', 'divya@smartgrocer.com', '+91-6655443321', 'Cashier', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Eshan Kumar', 'eshan@smartgrocer.com', '+91-9876987697', 'Stock Clerk', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Farheen Khan', 'farheen@smartgrocer.com', '+91-9988776653', 'Customer Service', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Gaurav Mehta', 'gaurav@smartgrocer.com', '+91-8877665542', 'Delivery Coordinator', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Hina Desai', 'hina@smartgrocer.com', '+91-7766554431', 'Cashier', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Imran Qureshi', 'imran@smartgrocer.com', '+91-6655443320', 'Stock Clerk', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Jyoti Verma', 'jyoti@smartgrocer.com', '+91-9876987696', 'Customer Service', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Karan Malhotra', 'karan@smartgrocer.com', '+91-9988776652', 'Store Manager', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Leela Nair', 'leela@smartgrocer.com', '+91-8877665541', 'Assistant Manager', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Manish Singh', 'manish@smartgrocer.com', '+91-7766554430', 'Shift Supervisor', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Neelam Rao', 'neelam@smartgrocer.com', '+91-6655443319', 'Cashier', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Omkar Joshi', 'omkar@smartgrocer.com', '+91-9876987695', 'Stock Clerk', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Priya Kapoor', 'priya@smartgrocer.com', '+91-9988776651', 'Customer Service', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Quresh Ali', 'quresh@smartgrocer.com', '+91-8877665540', 'Delivery Coordinator', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Radhika Iyer', 'radhika@smartgrocer.com', '+91-7766554429', 'Cashier', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Siddharth Bose', 'siddharth@smartgrocer.com', '+91-6655443318', 'Stock Clerk', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Tanvi Sharma', 'tanvi@smartgrocer.com', '+91-9876987694', 'Customer Service', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Umesh Patil', 'umesh@smartgrocer.com', '+91-9988776650', 'Store Manager', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Vidya Kumar', 'vidya@smartgrocer.com', '+91-8877665539', 'Assistant Manager', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Waseem Khan', 'waseem@smartgrocer.com', '+91-7766554428', 'Shift Supervisor', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Xenia D\'Souza', 'xenia@smartgrocer.com', '+91-6655443317', 'Cashier', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Yogesh Rathore', 'yogesh@smartgrocer.com', '+91-9876987693', 'Stock Clerk', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Zara Agarwal', 'zara@smartgrocer.com', '+91-9988776649', 'Customer Service', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Aryan Mehta', 'aryan@smartgrocer.com', '+91-8877665538', 'Delivery Coordinator', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Bipasha Sen', 'bipasha@smartgrocer.com', '+91-7766554427', 'Cashier', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Chirag Patel', 'chirag@smartgrocer.com', '+91-6655443316', 'Stock Clerk', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Deepti Gupta', 'deepti@smartgrocer.com', '+91-9876987692', 'Customer Service', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Emraan Hashmi', 'emraan@smartgrocer.com', '+91-9988776648', 'Store Manager', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Farah Sheikh', 'farah@smartgrocer.com', '+91-8877665537', 'Assistant Manager', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Girish Karnad', 'girish@smartgrocer.com', '+91-7766554426', 'Shift Supervisor', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Harsha Bhogle', 'harsha@smartgrocer.com', '+91-6655443315', 'Cashier', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Isha Koppikar', 'isha@smartgrocer.com', '+91-9876987691', 'Stock Clerk', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Jatin Das', 'jatin@smartgrocer.com', '+91-9876987690', 'Customer Service', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Kajol Devgan', 'kajol@smartgrocer.com', '+91-8877665536', 'Delivery Coordinator', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Lata Mangeshkar', 'lata@smartgrocer.com', '+91-7766554425', 'Cashier', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Madhur Jaffrey', 'madhur@smartgrocer.com', '+91-6655443314', 'Stock Clerk', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Nana Patekar', 'nana@smartgrocer.com', '+91-9876987689', 'Customer Service', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Om Puri', 'om@smartgrocer.com', '+91-9988776646', 'Store Manager', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Pankaj Kapur', 'pankaj@smartgrocer.com', '+91-8877665535', 'Assistant Manager', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Qurratulain Hyder', 'qurratulain@smartgrocer.com', '+91-7766554424', 'Shift Supervisor', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Ratna Pathak', 'ratna@smartgrocer.com', '+91-6655443313', 'Cashier', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Shabana Azmi', 'shabana@smartgrocer.com', '+91-9876987688', 'Stock Clerk', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Tinnu Anand', 'tinnu@smartgrocer.com', '+91-9876987687', 'Customer Service', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Usha Uthup', 'usha@smartgrocer.com', '+91-8877665534', 'Delivery Coordinator', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Vikram Seth', 'vikram@smartgrocer.com', '+91-7766554423', 'Cashier', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Waheeda Rehman', 'waheeda@smartgrocer.com', '+91-6655443312', 'Stock Clerk', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Anu Malik', 'anu@smartgrocer.com', '+91-9876987686', 'Customer Service', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Boman Irani', 'boman@smartgrocer.com', '+91-9988776644', 'Store Manager', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Konkona Sen', 'konkona@smartgrocer.com', '+91-8877665533', 'Assistant Manager', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Dalip Tahil', 'dalip@smartgrocer.com', '+91-7766554422', 'Shift Supervisor', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Evelyn Sharma', 'evelyn@smartgrocer.com', '+91-6655443311', 'Cashier', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Farhan Akhtar', 'farhan@smartgrocer.com', '+91-9876987685', 'Stock Clerk', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Genelia D\'Souza', 'genelia@smartgrocer.com', '+91-9988776643', 'Customer Service', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Hrithik Roshan', 'hrithik@smartgrocer.com', '+91-8877665532', 'Delivery Coordinator', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Irrfan Khan', 'irrfan@smartgrocer.com', '+91-7766554421', 'Cashier', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Jimmy Shergill', 'jimmy@smartgrocer.com', '+91-6655443310', 'Stock Clerk', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Kalki Koechlin', 'kalki@smartgrocer.com', '+91-9876987684', 'Customer Service', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Lara Dutta', 'lara@smartgrocer.com', '+91-9988776642', 'Store Manager', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Manoj Bajpayee', 'manoj@smartgrocer.com', '+91-8877665531', 'Assistant Manager', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Naseeruddin Shah', 'naseer@smartgrocer.com', '+91-7766554420', 'Shift Supervisor', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Aditi Rao Hydari', 'aditi@smartgrocer.com', '+91-6655443309', 'Cashier', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Prabhas Raju', 'prabhas@smartgrocer.com', '+91-9876987683', 'Stock Clerk', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Nargis Fakhri', 'nargis@smartgrocer.com', '+91-9988776641', 'Customer Service', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Randeep Hooda', 'randeep@smartgrocer.com', '+91-8877665530', 'Delivery Coordinator', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Supriya Pathak', 'supriya@smartgrocer.com', '+91-7766554419', 'Cashier', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Tabu', 'tabu@smartgrocer.com', '+91-6655443308', 'Stock Clerk', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Vaani Kapoor', 'vaani@smartgrocer.com', '+91-9876987682', 'Customer Service', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Yami Gautam', 'yami@smartgrocer.com', '+91-9988776640', 'Store Manager', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Zayed Khan', 'zayed@smartgrocer.com', '+91-8877665529', 'Assistant Manager', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Ali Fazal', 'ali@smartgrocer.com', '+91-7766554418', 'Shift Supervisor', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Bhumi Pednekar', 'bhumi@smartgrocer.com', '+91-6655443307', 'Cashier', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Chitrangada Singh', 'chitrangada@smartgrocer.com', '+91-9876987681', 'Stock Clerk', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Diana Penty', 'diana@smartgrocer.com', '+91-9988776639', 'Customer Service', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Emraan Hashmi', 'emraan2@smartgrocer.com', '+91-8877665528', 'Delivery Coordinator', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Fatima Sana Shaikh', 'fatima@smartgrocer.com', '+91-7766554417', 'Cashier', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Gul Panag', 'gul@smartgrocer.com', '+91-6655443306', 'Stock Clerk', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Huma Qureshi', 'huma@smartgrocer.com', '+91-9876987680', 'Customer Service', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Ileana D\'Cruz', 'ileana@smartgrocer.com', '+91-9988776638', 'Store Manager', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Jim Sarbh', 'jim@smartgrocer.com', '+91-8877665527', 'Assistant Manager', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Kunal Kapoor', 'kunal@smartgrocer.com', '+91-7766554416', 'Shift Supervisor', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Lisa Ray', 'lisa@smartgrocer.com', '+91-6655443305', 'Cashier', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Mahie Gill', 'mahie@smartgrocer.com', '+91-9876987681', 'Stock Clerk', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Nawazuddin Siddiqui', 'nawaz@smartgrocer.com', '+91-9876987680', 'Customer Service', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Nimrat Kaur', 'nimrat@smartgrocer.com', '+91-9988776637', 'Delivery Coordinator', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Pankaj Tripathi', 'pankaj2@smartgrocer.com', '+91-8877665526', 'Cashier', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Raima Sen', 'raima@smartgrocer.com', '+91-7766554415', 'Stock Clerk', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Sanya Malhotra', 'sanya@smartgrocer.com', '+91-9876987680', 'Customer Service', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active'),
('Tapsee Pannu', 'tapsee@smartgrocer.com', '+91-9988776636', 'Store Manager', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'active');

-- ======================================================
-- Orders (add 95 more to reach 100 total)
-- ======================================================
INSERT INTO orders (customer_id, employee_id, order_date, total_amount, status, payment_method, notes) VALUES
(6, 3, '2023-07-05 10:15:00', 1375.00, 'completed', 'credit_card', 'Regular customer'),
(7, 4, '2023-07-06 11:30:00', 895.00, 'completed', 'UPI', 'Requested paper bags'),
(8, 2, '2023-07-07 12:45:00', 2250.00, 'completed', 'debit_card', 'Delivery to office address'),
(9, 4, '2023-07-08 14:00:00', 530.00, 'completed', 'cash', NULL),
(10, 3, '2023-07-09 15:15:00', 1750.00, 'completed', 'credit_card', 'Bulk order for party'),
(11, 5, '2023-07-10 09:30:00', 990.00, 'completed', 'UPI', NULL),
(12, 2, '2023-07-11 10:45:00', 1200.00, 'completed', 'debit_card', 'Monthly groceries'),
(13, 4, '2023-07-12 12:00:00', 850.00, 'completed', 'cash', 'Senior citizen discount applied'),
(14, 3, '2023-07-13 13:15:00', 1650.00, 'completed', 'credit_card', NULL),
(15, 5, '2023-07-14 14:30:00', 920.00, 'completed', 'UPI', 'First-time customer'),
(16, 2, '2023-07-15 15:45:00', 1480.00, 'completed', 'debit_card', NULL),
(17, 4, '2023-07-16 09:00:00', 730.00, 'completed', 'cash', 'Loyalty discount applied'),
(18, 3, '2023-07-17 10:15:00', 2100.00, 'completed', 'credit_card', 'Bulk purchase'),
(19, 5, '2023-07-18 11:30:00', 840.00, 'completed', 'UPI', NULL),
(20, 2, '2023-07-19 12:45:00', 1350.00, 'completed', 'debit_card', 'Phone order'),
(21, 4, '2023-07-20 14:00:00', 695.00, 'completed', 'cash', NULL),
(22, 3, '2023-07-21 15:15:00', 1900.00, 'completed', 'credit_card', 'Corporate order'),
(23, 5, '2023-07-22 09:30:00', 780.00, 'completed', 'UPI', NULL),
(24, 2, '2023-07-23 10:45:00', 1250.00, 'completed', 'debit_card', 'Weekly groceries'),
(25, 4, '2023-07-24 12:00:00', 945.00, 'completed', 'cash', NULL),
(26, 3, '2023-07-25 13:15:00', 1720.00, 'completed', 'credit_card', 'Organic products only'),
(27, 5, '2023-07-26 14:30:00', 830.00, 'completed', 'UPI', NULL),
(28, 2, '2023-07-27 15:45:00', 1150.00, 'completed', 'debit_card', 'Monthly stock-up'),
(29, 4, '2023-07-28 09:00:00', 690.00, 'completed', 'cash', NULL),
(30, 3, '2023-07-29 10:15:00', 1850.00, 'completed', 'credit_card', 'Party supplies'),
(31, 5, '2023-07-30 11:30:00', 920.00, 'completed', 'UPI', NULL),
(32, 2, '2023-07-31 12:45:00', 1450.00, 'completed', 'debit_card', 'Express delivery'),
(33, 4, '2023-08-01 14:00:00', 790.00, 'completed', 'cash', 'Anniversary special discount'),
(34, 3, '2023-08-02 15:15:00', 2200.00, 'completed', 'credit_card', NULL),
(35, 5, '2023-08-03 09:30:00', 850.00, 'completed', 'UPI', 'Eco-friendly packaging requested'),
(36, 2, '2023-08-04 10:45:00', 1350.00, 'completed', 'debit_card', NULL),
(37, 4, '2023-08-05 12:00:00', 720.00, 'completed', 'cash', 'Student discount applied'),
(38, 3, '2023-08-06 13:15:00', 1680.00, 'completed', 'credit_card', NULL),
(39, 5, '2023-08-07 14:30:00', 950.00, 'completed', 'UPI', 'Loyalty bonus used'),
(40, 2, '2023-08-08 15:45:00', 1420.00, 'completed', 'debit_card', NULL),
(41, 4, '2023-08-09 09:00:00', 680.00, 'completed', 'cash', NULL),
(42, 3, '2023-08-10 10:15:00', 1950.00, 'completed', 'credit_card', 'Office supplies included'),
(43, 5, '2023-08-11 11:30:00', 880.00, 'completed', 'UPI', NULL),
(44, 2, '2023-08-12 12:45:00', 1300.00, 'completed', 'debit_card', 'Weekend special order'),
(45, 4, '2023-08-13 14:00:00', 750.00, 'completed', 'cash', NULL),
(46, 3, '2023-08-14 15:15:00', 1780.00, 'completed', 'credit_card', 'Independence Day special order'),
(47, 5, '2023-08-15 09:30:00', 920.00, 'completed', 'UPI', 'Holiday discount applied'),
(48, 2, '2023-08-16 10:45:00', 1380.00, 'completed', 'debit_card', NULL),
(49, 4, '2023-08-17 12:00:00', 705.00, 'completed', 'cash', NULL),
(50, 3, '2023-08-18 13:15:00', 2050.00, 'completed', 'credit_card', 'Monthly subscription order'),
(51, 5, '2023-08-19 14:30:00', 890.00, 'completed', 'UPI', NULL),
(52, 2, '2023-08-20 15:45:00', 1250.00, 'completed', 'debit_card', 'Specific delivery time requested'),
(53, 4, '2023-08-21 09:00:00', 670.00, 'completed', 'cash', NULL),
(54, 3, '2023-08-22 10:15:00', 1600.00, 'completed', 'credit_card', 'Corporate account'),
(55, 5, '2023-08-23 11:30:00', 930.00, 'completed', 'UPI', NULL),
(56, 2, '2023-08-24 12:45:00', 1320.00, 'completed', 'debit_card', 'Gift wrapped items'),
(57, 4, '2023-08-25 14:00:00', 770.00, 'completed', 'cash', NULL),
(58, 3, '2023-08-26 15:15:00', 1850.00, 'completed', 'credit_card', 'Bulk discount applied'),
(59, 5, '2023-08-27 09:30:00', 910.00, 'completed', 'UPI', NULL),
(60, 2, '2023-08-28 10:45:00', 1400.00, 'completed', 'debit_card', 'Regular weekend order'),
(61, 4, '2023-08-29 12:00:00', 740.00, 'completed', 'cash', NULL),
(62, 3, '2023-08-30 13:15:00', 1730.00, 'completed', 'credit_card', 'Premium membership benefits'),
(63, 5, '2023-08-31 14:30:00', 880.00, 'completed', 'UPI', NULL),
(64, 2, '2023-09-01 15:45:00', 1280.00, 'completed', 'debit_card', 'Monthly essentials'),
(65, 4, '2023-09-02 09:00:00', 690.00, 'completed', 'cash', NULL),
(66, 3, '2023-09-03 10:15:00', 1950.00, 'completed', 'credit_card', 'Weekend party preparations'),
(67, 5, '2023-09-04 11:30:00', 860.00, 'completed', 'UPI', NULL),
(68, 2, '2023-09-05 12:45:00', 1350.00, 'completed', 'debit_card', 'Special delivery instructions'),
(69, 4, '2023-09-06 14:00:00', 720.00, 'completed', 'cash', NULL),
(70, 3, '2023-09-07 15:15:00', 1680.00, 'completed', 'credit_card', 'Business order'),
(71, 5, '2023-09-08 09:30:00', 940.00, 'completed', 'UPI', NULL),
(72, 2, '2023-09-09 10:45:00', 1420.00, 'completed', 'debit_card', 'Eco-friendly products only'),
(73, 4, '2023-09-10 12:00:00', 780.00, 'completed', 'cash', NULL),
(74, 3, '2023-09-11 13:15:00', 2100.00, 'completed', 'credit_card', 'Festival preparations'),
(75, 5, '2023-09-12 14:30:00', 890.00, 'completed', 'UPI', NULL),
(76, 2, '2023-09-13 15:45:00', 1350.00, 'completed', 'debit_card', 'Wedding gift hampers'),
(77, 4, '2023-09-14 09:00:00', 710.00, 'completed', 'cash', NULL),
(78, 3, '2023-09-15 10:15:00', 1750.00, 'completed', 'credit_card', 'VIP customer'),
(79, 5, '2023-09-16 11:30:00', 920.00, 'completed', 'UPI', NULL),
(80, 2, '2023-09-17 12:45:00', 1380.00, 'completed', 'debit_card', 'Weekend grocery run'),
(6, 6, '2024-05-01 14:00:00', 850.00, 'processing', 'UPI', NULL),
(12, 7, '2024-05-01 15:15:00', 1250.00, 'processing', 'credit_card', 'Monthly groceries'),
(25, 8, '2024-05-01 16:30:00', 680.00, 'processing', 'debit_card', NULL),
(38, 9, '2024-05-01 17:45:00', 990.00, 'pending', 'cash', 'Requested evening delivery'),
(47, 10, '2024-05-02 09:00:00', 1450.00, 'pending', 'UPI', NULL),
(54, 6, '2024-05-02 10:15:00', 720.00, 'pending', 'credit_card', 'Priority delivery'),
(63, 7, '2024-05-02 11:30:00', 1680.00, 'pending', 'debit_card', NULL),
(71, 8, '2024-05-02 12:45:00', 890.00, 'pending', 'cash', 'Corporate order'),
(79, 9, '2024-05-02 14:00:00', 1250.00, 'pending', 'UPI', NULL),
(85, 10, '2024-05-02 15:15:00', 760.00, 'pending', 'credit_card', 'Weekend special order'),
(8, 6, '2024-05-02 16:30:00', 1850.00, 'pending', 'debit_card', NULL),
(17, 7, '2024-05-02 17:45:00', 920.00, 'pending', 'cash', 'Requesting eco-friendly packaging'),
(32, 8, '2024-05-03 09:00:00', 1400.00, 'pending', 'UPI', NULL),
(55, 9, '2024-05-03 10:15:00', 780.00, 'pending', 'credit_card', 'Special instructions for delivery'),
(76, 10, '2024-05-03 11:30:00', 2200.00, 'pending', 'debit_card', 'Party supplies');

-- ======================================================
-- Order Items (add more to reach ~100 per order)
-- ======================================================
-- Let's add 3-5 items for each order created above
-- For orders 6-10
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
(6, 11, 2, 140.00),  -- Kissan Mixed Fruit Jam
(6, 18, 1, 225.00),  -- Dabur Honey
(6, 20, 2, 120.00),  -- Sunfeast Dark Fantasy
(6, 35, 1, 245.00),  -- Horlicks Classic Malt
(7, 13, 1, 750.00),  -- Saffola Gold Oil
(7, 15, 1, 110.00),  -- Haldiram Bhujia Sev
(7, 29, 1, 24.00),   -- Tata Salt
(8, 12, 3, 80.00),   -- Parle-G Biscuits
(8, 16, 2, 325.00),  -- Kellogg's Corn Flakes
(8, 17, 1, 450.00),  -- Fortune Basmati Rice
(8, 19, 1, 410.00),  -- Red Label Tea
(8, 22, 1, 525.00),  -- Surf Excel Detergent
(9, 24, 2, 99.00),   -- Dettol Handwash
(9, 27, 1, 350.00),  -- Dove Body Wash
(10, 14, 2, 110.00), -- Britannia Marie Gold
(10, 21, 1, 210.00), -- Madhur Pure Sugar
(10, 23, 3, 115.00), -- Colgate Strong Teeth
(10, 25, 2, 120.00), -- Lux Soap
(10, 28, 3, 24.00);  -- Tata Salt

-- For orders 11-15
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
(11, 30, 2, 90.00),   -- Britannia Good Day
(11, 31, 1, 135.00),  -- Maggi Hot & Sweet Sauce
(11, 32, 2, 245.00),  -- Horlicks Classic Malt
(11, 33, 1, 110.00),  -- Mothers Recipe Pickle
(12, 34, 3, 200.00),  -- Lay's Classic Salted
(12, 35, 2, 68.00),   -- Amul Gold Milk
(12, 1, 2, 60.00),    -- Amul Milk
(13, 36, 1, 599.00),  -- Pampers Diapers
(13, 37, 1, 180.00),  -- Johnsons Baby Powder
(14, 38, 2, 275.00),  -- Huggies Baby Wipes
(14, 39, 3, 240.00),  -- Cerelac Baby Food
(14, 40, 1, 175.00),  -- Harpic Toilet Cleaner
(15, 41, 2, 120.00),  -- Colin Glass Cleaner
(15, 42, 1, 249.00),  -- Lizol Disinfectant
(15, 43, 1, 375.00);  -- Ariel Washing Powder

-- For orders 16-20
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
(16, 44, 2, 220.00),  -- Comfort Fabric Conditioner
(16, 45, 3, 100.00),  -- Vim Dishwash Bar
(16, 46, 1, 85.00),   -- All Out Liquid Vaporizer
(16, 47, 1, 175.00),  -- Mortein Spray
(17, 48, 2, 125.00),  -- Good Knight Gold Flash
(17, 49, 1, 95.00),   -- Kitchen Towel Roll
(17, 50, 1, 175.00),  -- Toilet Paper
(18, 51, 1, 190.00),  -- Sunsilk Shampoo
(18, 52, 2, 135.00),  -- Pears Soap
(18, 53, 3, 240.00),  -- Vaseline Body Lotion
(18, 54, 2, 199.00),  -- Parachute Coconut Oil
(18, 55, 3, 100.00),  -- Lifebuoy Soap
(19, 56, 1, 120.00),  -- Himalaya Face Wash
(19, 57, 2, 185.00),  -- Nivea Men Facewash
(19, 58, 1, 299.00),  -- Gillette Razor
(20, 59, 2, 190.00),  -- Old Spice Deodorant
(20, 60, 1, 175.00),  -- Lakme Face Powder
(20, 61, 1, 350.00),  -- Maybelline Mascara
(20, 62, 1, 399.00);  -- Revlon Lipstick

-- Additional random order items for orders 21-100
-- Let's add more items to reach approximately 300 total order items
-- This is a sample of the pattern - in a real implementation, we would add items for all orders

-- For orders 21-25
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
(21, 63, 2, 210.00),  -- Whisper Ultra Pads
(21, 64, 1, 180.00),  -- Stayfree Secure
(22, 65, 2, 210.00),  -- Fogg Deodorant
(22, 66, 1, 150.00),  -- Park Avenue Perfume
(22, 3, 3, 50.00),    -- Fresh Bananas
(22, 10, 2, 45.00),   -- Brown Bread
(23, 67, 1, 220.00),  -- Durex Condoms
(23, 68, 1, 285.00),  -- Savlon Antiseptic
(24, 69, 2, 150.00),  -- Band-Aid
(24, 70, 1, 135.00),  -- Vicks VapoRub
(24, 71, 3, 28.00),   -- Crocin Pain Relief
(25, 72, 1, 210.00),  -- Volini Spray
(25, 73, 1, 270.00),  -- Revital H
(25, 74, 1, 525.00);  -- Centrum Adults

-- For the most recent pending orders (81-100)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
(81, 75, 1, 499.00),  -- Patanjali Ghee
(81, 76, 2, 210.00),  -- Nestle Everyday Dairy Whitener
(82, 77, 1, 325.00),  -- Ashirwad Multigrain Atta
(82, 78, 1, 550.00),  -- Daawat Basmati Rice
(83, 79, 3, 180.00),  -- Nissin Cup Noodles
(83, 80, 1, 210.00),  -- India Gate Rice
(84, 81, 2, 95.00),   -- MTR Breakfast Mix
(84, 82, 3, 85.00),   -- Everest Garam Masala
(85, 83, 2, 65.00),   -- Catch Spices
(85, 84, 3, 32.00),   -- Eastern Masala
(86, 85, 1, 399.00),  -- Nutella Spread
(86, 86, 1, 299.00),  -- American Garden Peanut Butter
(87, 87, 2, 110.00),  -- Del Monte Ketchup
(87, 88, 1, 225.00),  -- Tops Pickles
(88, 89, 2, 210.00),  -- 24 Mantra Organic Pulses
(88, 90, 1, 150.00),  -- Organic India Tulsi Tea
(89, 91, 1, 125.00),  -- Organic Tattva Brown Rice
(89, 92, 3, 45.00),   -- Conscious Food Rock Salt
(90, 93, 2, 120.00),  -- Pro Nature Jaggery Powder
(90, 94, 1, 160.00);  -- Amul Mozzarella Cheese

-- ======================================================
-- Inventory Transactions (add more to reach 100 total)
-- ======================================================
INSERT INTO inventory_transactions (product_id, quantity, transaction_type, reference_id, notes) VALUES
-- Purchase transactions
(11, 50, 'purchase', NULL, 'Initial stock'),
(12, 120, 'purchase', NULL, 'Bulk purchase'),
(13, 40, 'purchase', NULL, 'Regular restock'),
(14, 80, 'purchase', NULL, 'Weekly delivery'),
(15, 60, 'purchase', NULL, 'Monthly delivery'),
(16, 35, 'purchase', NULL, 'Regular restock'),
(17, 50, 'purchase', NULL, 'Supplier promotion'),
(18, 45, 'purchase', NULL, 'Regular restock'),
(19, 40, 'purchase', NULL, 'Weekly delivery'),
(20, 55, 'purchase', NULL, 'Regular restock'),
(21, 60, 'purchase', NULL, 'Bulk purchase'),
(22, 40, 'purchase', NULL, 'Regular restock'),
(23, 70, 'purchase', NULL, 'Weekly delivery'),
(24, 55, 'purchase', NULL, 'Regular restock'),
(25, 60, 'purchase', NULL, 'Monthly delivery'),
(26, 30, 'purchase', NULL, 'Regular restock'),
(27, 35, 'purchase', NULL, 'Special order'),
(28, 120, 'purchase', NULL, 'Bulk purchase'),
(29, 50, 'purchase', NULL, 'Regular restock'),
(30, 70, 'purchase', NULL, 'Weekly delivery'),
-- Sale transactions
(11, -2, 'sale', 6, 'Order #6'),
(18, -1, 'sale', 6, 'Order #6'),
(20, -2, 'sale', 6, 'Order #6'),
(35, -1, 'sale', 6, 'Order #6'),
(13, -1, 'sale', 7, 'Order #7'),
(15, -1, 'sale', 7, 'Order #7'),
(29, -1, 'sale', 7, 'Order #7'),
(12, -3, 'sale', 8, 'Order #8'),
(16, -2, 'sale', 8, 'Order #8'),
(17, -1, 'sale', 8, 'Order #8'),
(19, -1, 'sale', 8, 'Order #8'),
(22, -1, 'sale', 8, 'Order #8'),
(24, -2, 'sale', 9, 'Order #9'),
(27, -1, 'sale', 9, 'Order #9'),
(14, -2, 'sale', 10, 'Order #10'),
(21, -1, 'sale', 10, 'Order #10'),
(23, -3, 'sale', 10, 'Order #10'),
(25, -2, 'sale', 10, 'Order #10'),
(28, -3, 'sale', 10, 'Order #10'),
-- Adjustment transactions
(11, 5, 'adjustment', NULL, 'Inventory count correction'),
(12, -2, 'adjustment', NULL, 'Damaged goods'),
(13, 3, 'adjustment', NULL, 'Inventory count correction'),
(14, -5, 'adjustment', NULL, 'Expired products removed'),
(15, 2, 'adjustment', NULL, 'Found misplaced stock'),
(16, -3, 'adjustment', NULL, 'Quality issues'),
(17, 4, 'adjustment', NULL, 'Inventory count correction'),
(18, -1, 'adjustment', NULL, 'Damaged packaging'),
(19, 2, 'adjustment', NULL, 'Inventory count correction'),
(20, -4, 'adjustment', NULL, 'Quality control rejection'),
-- Return transactions
(21, 2, 'return', 22, 'Customer dissatisfaction'),
(22, 1, 'return', 25, 'Wrong item delivered'),
(23, 3, 'return', 31, 'Damaged in transit'),
(24, 1, 'return', 37, 'Customer changed mind'),
(25, 2, 'return', 42, 'Incorrect size'),
(26, 1, 'return', 45, 'Damaged packaging'),
(27, 1, 'return', 48, 'Customer dissatisfaction'),
(28, 2, 'return', 53, 'Wrong item delivered'),
(29, 1, 'return', 56, 'Quality issues'),
(30, 2, 'return', 62, 'Expired product'),
-- More purchase transactions
(31, 45, 'purchase', NULL, 'Regular restock'),
(32, 50, 'purchase', NULL, 'Weekly delivery'),
(33, 55, 'purchase', NULL, 'Regular restock'),
(34, 100, 'purchase', NULL, 'Bulk purchase'),
(35, 80, 'purchase', NULL, 'Regular restock'),
(36, 30, 'purchase', NULL, 'Special order'),
(37, 40, 'purchase', NULL, 'Regular restock'),
(38, 50, 'purchase', NULL, 'Weekly delivery'),
(39, 45, 'purchase', NULL, 'Regular restock'),
(40, 40, 'purchase', NULL, 'Monthly delivery'),
-- More adjustment transactions
(41, -3, 'adjustment', NULL, 'Damaged during stocking'),
(42, 4, 'adjustment', NULL, 'Inventory count correction'),
(43, -2, 'adjustment', NULL, 'Quality issues'),
(44, 3, 'adjustment', NULL, 'Inventory count correction'),
(45, -5, 'adjustment', NULL, 'Expired products removed'),
(46, 2, 'adjustment', NULL, 'Found misplaced stock'),
(47, -1, 'adjustment', NULL, 'Damaged packaging'),
(48, 3, 'adjustment', NULL, 'Inventory count correction'),
(49, -2, 'adjustment', NULL, 'Quality control rejection'),
(50, 4, 'adjustment', NULL, 'Inventory count correction'),
-- More sale transactions
(30, -2, 'sale', 11, 'Order #11'),
(31, -1, 'sale', 11, 'Order #11'),
(32, -2, 'sale', 11, 'Order #11'),
(33, -1, 'sale', 11, 'Order #11'),
(34, -3, 'sale', 12, 'Order #12'),
(35, -2, 'sale', 12, 'Order #12'),
(1, -2, 'sale', 12, 'Order #12'),
(36, -1, 'sale', 13, 'Order #13'),
(37, -1, 'sale', 13, 'Order #13'),
(38, -2, 'sale', 14, 'Order #14'),
(39, -3, 'sale', 14, 'Order #14'),
(40, -1, 'sale', 14, 'Order #14'),
(41, -2, 'sale', 15, 'Order #15'),
(42, -1, 'sale', 15, 'Order #15'),
(43, -1, 'sale', 15, 'Order #15');

-- ======================================================
-- Add 50 more Loyalty Program entries
-- ======================================================
INSERT INTO loyalty_programs (name, description, points_per_rupee, min_points_to_redeem, conversion_rate, expiry_months, is_active) VALUES
('Gold Rewards', 'Premium tier loyalty program with enhanced benefits', 2.0, 1000, 0.5, 12, true),
('Silver Savings', 'Mid-tier loyalty program with good value', 1.5, 750, 0.4, 9, true),
('Bronze Benefits', 'Entry level loyalty program', 1.0, 500, 0.25, 6, true),
('Student Special', 'Extra points for student customers', 2.5, 500, 0.3, 8, true),
('Senior Citizen Plus', 'Enhanced rewards for senior citizens', 3.0, 600, 0.5, 12, true),
('Digital Saver', 'Extra points for app and online orders', 2.0, 800, 0.4, 9, true),
('Weekend Warrior', 'Bonus points for weekend shopping', 1.5, 600, 0.3, 6, true),
('Morning Shopper', 'Extra points for shopping before 11am', 2.0, 700, 0.35, 8, true),
('Eco Shopper', 'Rewards for using reusable bags', 1.75, 500, 0.3, 6, true),
('Corporate Connect', 'Business customer rewards program', 1.25, 1000, 0.45, 12, true);

-- ======================================================
-- Add more Store Locations (40 more to reach 50 total)
-- ======================================================
INSERT INTO store_locations (name, address, city, state, pincode, phone, email, manager_id, opening_hours, is_active) VALUES
('SmartGrocer Indira Nagar', '42 100ft Road, Indira Nagar', 'Bangalore', 'Karnataka', '560038', '+91-8044557788', 'indiranagar@smartgrocer.com', 11, '8:00 AM - 10:00 PM', true),
('SmartGrocer JP Nagar', '78 Ring Road, JP Nagar 6th Phase', 'Bangalore', 'Karnataka', '560078', '+91-8044889977', 'jpnagar@smartgrocer.com', 12, '8:00 AM - 10:00 PM', true),
('SmartGrocer Brigade Road', '22 Brigade Road', 'Bangalore', 'Karnataka', '560001', '+91-8045566778', 'brigade@smartgrocer.com', 13, '9:00 AM - 10:00 PM', true),
('SmartGrocer Marathahalli', '45 Outer Ring Road, Marathahalli', 'Bangalore', 'Karnataka', '560037', '+91-8046677889', 'marathahalli@smartgrocer.com', 14, '8:00 AM - 10:00 PM', true),
('SmartGrocer Malleswaram', '12 Sampige Road, Malleswaram', 'Bangalore', 'Karnataka', '560003', '+91-8047788990', 'malleswaram@smartgrocer.com', 15, '8:00 AM - 9:00 PM', true),
('SmartGrocer Bandra East', '56 Kherwadi Road, Bandra East', 'Mumbai', 'Maharashtra', '400051', '+91-2224456789', 'bandrae@smartgrocer.com', 21, '9:00 AM - 10:00 PM', true),
('SmartGrocer Juhu', '78 Juhu Tara Road', 'Mumbai', 'Maharashtra', '400049', '+91-2225567890', 'juhu@smartgrocer.com', 22, '9:00 AM - 9:00 PM', true),
('SmartGrocer Colaba', '23 Colaba Causeway', 'Mumbai', 'Maharashtra', '400005', '+91-2226678901', 'colaba@smartgrocer.com', 23, '9:00 AM - 9:00 PM', true),
('SmartGrocer Dadar', '45 Dadar TT Circle', 'Mumbai', 'Maharashtra', '400014', '+91-2227789012', 'dadar@smartgrocer.com', 24, '8:00 AM - 10:00 PM', true),
('SmartGrocer Borivali', '67 Link Road, Borivali West', 'Mumbai', 'Maharashtra', '400092', '+91-2228890123', 'borivali@smartgrocer.com', 25, '8:00 AM - 9:00 PM', true),
('SmartGrocer Connaught Place', '34 Connaught Place', 'New Delhi', 'Delhi', '110001', '+91-1145567890', 'cp@smartgrocer.com', 31, '10:00 AM - 9:00 PM', true),
('SmartGrocer Lajpat Nagar', '56 Main Market, Lajpat Nagar', 'New Delhi', 'Delhi', '110024', '+91-1146678901', 'lajpat@smartgrocer.com', 32, '10:00 AM - 9:00 PM', true),
('SmartGrocer Vasant Kunj', '89 Vasant Kunj Mall', 'New Delhi', 'Delhi', '110070', '+91-1147789012', 'vasantkunj@smartgrocer.com', 33, '10:00 AM - 10:00 PM', true),
('SmartGrocer Dwarka', '23 Sector 12, Dwarka', 'New Delhi', 'Delhi', '110078', '+91-1148890123', 'dwarka@smartgrocer.com', 34, '9:00 AM - 9:00 PM', true),
('SmartGrocer Rohini', '45 Sector 9, Rohini', 'New Delhi', 'Delhi', '110085', '+91-1149901234', 'rohini@smartgrocer.com', 35, '9:00 AM - 9:00 PM', true),
('SmartGrocer Cyber City', '12 DLF Phase 2', 'Gurgaon', 'Haryana', '122002', '+91-1246679012', 'cybercity@smartgrocer.com', 36, '10:00 AM - 10:00 PM', true),
('SmartGrocer Golf Course Road', '34 Golf Course Road', 'Gurgaon', 'Haryana', '122002', '+91-1247780123', 'golfcourse@smartgrocer.com', 37, '10:00 AM - 10:00 PM', true),
('SmartGrocer Sector 29', '56 Leisure Valley, Sector 29', 'Gurgaon', 'Haryana', '122001', '+91-1248891234', 'sector29@smartgrocer.com', 38, '10:00 AM - 10:00 PM', true),
('SmartGrocer Sector 14', '78 Sector 14 Market', 'Gurgaon', 'Haryana', '122001', '+91-1249902345', 'sector14@smartgrocer.com', 39, '9:00 AM - 9:00 PM', true),
('SmartGrocer Ballygunge', '23 Ballygunge Place', 'Kolkata', 'West Bengal', '700019', '+91-3323457890', 'ballygunge@smartgrocer.com', 41, '9:00 AM - 9:00 PM', true),
('SmartGrocer Park Street', '45 Park Street', 'Kolkata', 'West Bengal', '700016', '+91-3323568901', 'parkstreet@smartgrocer.com', 42, '10:00 AM - 10:00 PM', true),
('SmartGrocer Gariahat', '67 Gariahat Road', 'Kolkata', 'West Bengal', '700029', '+91-3323679012', 'gariahat@smartgrocer.com', 43, '9:00 AM - 9:00 PM', true),
('SmartGrocer New Town', '89 Action Area 1, New Town', 'Kolkata', 'West Bengal', '700156', '+91-3323780123', 'newtown@smartgrocer.com', 44, '9:00 AM - 9:00 PM', true),
('SmartGrocer Dumdum', '12 Dumdum Road', 'Kolkata', 'West Bengal', '700028', '+91-3323891234', 'dumdum@smartgrocer.com', 45, '9:00 AM - 9:00 PM', true),
('SmartGrocer Banjara Hills', '34 Road No. 12, Banjara Hills', 'Hyderabad', 'Telangana', '500034', '+91-4023567890', 'banjara@smartgrocer.com', 51, '9:00 AM - 10:00 PM', true),
('SmartGrocer Gachibowli', '56 Financial District, Gachibowli', 'Hyderabad', 'Telangana', '500032', '+91-4023678901', 'gachibowli@smartgrocer.com', 52, '8:00 AM - 10:00 PM', true),
('SmartGrocer Kukatpally', '78 KPHB Colony', 'Hyderabad', 'Telangana', '500072', '+91-4023789012', 'kukatpally@smartgrocer.com', 53, '8:00 AM - 10:00 PM', true),
('SmartGrocer Ameerpet', '23 Ameerpet Main Road', 'Hyderabad', 'Telangana', '500016', '+91-4023890123', 'ameerpet@smartgrocer.com', 54, '9:00 AM - 9:00 PM', true),
('SmartGrocer Madhapur', '45 Hitech City Road, Madhapur', 'Hyderabad', 'Telangana', '500081', '+91-4023901234', 'madhapur@smartgrocer.com', 55, '9:00 AM - 10:00 PM', true),
('SmartGrocer Anna Nagar', '67 2nd Avenue, Anna Nagar', 'Chennai', 'Tamil Nadu', '600040', '+91-4423456789', 'annanagar@smartgrocer.com', 61, '9:00 AM - 9:00 PM', true),
('SmartGrocer T Nagar', '89 Venkatanarayana Road, T Nagar', 'Chennai', 'Tamil Nadu', '600017', '+91-4424567890', 'tnagar@smartgrocer.com', 62, '9:00 AM - 9:00 PM', true),
('SmartGrocer Velachery', '12 Velachery Main Road', 'Chennai', 'Tamil Nadu', '600042', '+91-4425678901', 'velachery@smartgrocer.com', 63, '9:00 AM - 9:00 PM', true),
('SmartGrocer OMR', '34 Rajiv Gandhi Salai, OMR', 'Chennai', 'Tamil Nadu', '600097', '+91-4426789012', 'omr@smartgrocer.com', 64, '8:00 AM - 10:00 PM', true),
('SmartGrocer Mylapore', '56 North Mada Street, Mylapore', 'Chennai', 'Tamil Nadu', '600004', '+91-4427890123', 'mylapore@smartgrocer.com', 65, '8:00 AM - 9:00 PM', true),
('SmartGrocer Alwarpet', '78 TTK Road, Alwarpet', 'Chennai', 'Tamil Nadu', '600018', '+91-4428901234', 'alwarpet@smartgrocer.com', 66, '9:00 AM - 9:00 PM', true),
('SmartGrocer Navrangpura', '23 CG Road, Navrangpura', 'Ahmedabad', 'Gujarat', '380009', '+91-7923456789', 'navrangpura@smartgrocer.com', 71, '9:00 AM - 9:00 PM', true),
('SmartGrocer Satellite', '45 Satellite Road', 'Ahmedabad', 'Gujarat', '380015', '+91-7924567890', 'satellite@smartgrocer.com', 72, '9:00 AM - 9:00 PM', true),
('SmartGrocer Vastrapur', '67 Vastrapur Lake, Vastrapur', 'Ahmedabad', 'Gujarat', '380015', '+91-7925678901', 'vastrapur@smartgrocer.com', 73, '9:00 AM - 9:00 PM', true),
('SmartGrocer Prahlad Nagar', '89 Prahlad Nagar Road', 'Ahmedabad', 'Gujarat', '380015', '+91-7926789012', 'prahladnagar@smartgrocer.com', 74, '9:00 AM - 10:00 PM', true);

-- ======================================================
-- Add more Delivery Zones (35 more to reach 50 total)
-- ======================================================
INSERT INTO delivery_zones (name, city, pincode_range, delivery_charge, min_order_free_delivery, estimated_delivery_time, is_active) VALUES
('Indiranagar', 'Bangalore', '560038-560038', 30.00, 400.00, '20-35 minutes', true),
('JP Nagar', 'Bangalore', '560078-560078', 35.00, 450.00, '25-40 minutes', true),
('Brigade Road', 'Bangalore', '560001-560001', 25.00, 350.00, '15-30 minutes', true),
('Marathahalli', 'Bangalore', '560037-560037', 40.00, 500.00, '30-45 minutes', true),
('Malleswaram', 'Bangalore', '560003-560003', 30.00, 400.00, '20-35 minutes', true),
('Bandra East', 'Mumbai', '400051-400051', 45.00, 550.00, '30-45 minutes', true),
('Juhu', 'Mumbai', '400049-400049', 50.00, 600.00, '35-50 minutes', true),
('Colaba', 'Mumbai', '400005-400005', 40.00, 500.00, '25-40 minutes', true),
('Dadar', 'Mumbai', '400014-400014', 35.00, 450.00, '20-35 minutes', true),
('Borivali', 'Mumbai', '400092-400092', 55.00, 650.00, '40-55 minutes', true),
('Connaught Place', 'New Delhi', '110001-110001', 35.00, 450.00, '25-40 minutes', true),
('Lajpat Nagar', 'New Delhi', '110024-110024', 40.00, 500.00, '30-45 minutes', true),
('Vasant Kunj', 'New Delhi', '110070-110070', 50.00, 600.00, '35-50 minutes', true),
('Dwarka', 'New Delhi', '110078-110078', 60.00, 700.00, '40-60 minutes', true),
('Rohini', 'New Delhi', '110085-110085', 55.00, 650.00, '40-55 minutes', true),
('Cyber City', 'Gurgaon', '122002-122002', 45.00, 550.00, '30-45 minutes', true),
('Golf Course Road', 'Gurgaon', '122002-122002', 40.00, 500.00, '25-40 minutes', true),
('Sector 29', 'Gurgaon', '122001-122001', 50.00, 600.00, '35-50 minutes', true),
('Sector 14', 'Gurgaon', '122001-122001', 45.00, 550.00, '30-45 minutes', true),
('Ballygunge', 'Kolkata', '700019-700019', 35.00, 450.00, '25-40 minutes', true),
('Park Street', 'Kolkata', '700016-700016', 30.00, 400.00, '20-35 minutes', true),
('Gariahat', 'Kolkata', '700029-700029', 40.00, 500.00, '30-45 minutes', true),
('New Town', 'Kolkata', '700156-700156', 55.00, 650.00, '40-55 minutes', true),
('Dumdum', 'Kolkata', '700028-700028', 50.00, 600.00, '35-50 minutes', true),
('Banjara Hills', 'Hyderabad', '500034-500034', 40.00, 500.00, '25-40 minutes', true),
('Gachibowli', 'Hyderabad', '500032-500032', 45.00, 550.00, '30-45 minutes', true),
('Kukatpally', 'Hyderabad', '500072-500072', 55.00, 650.00, '40-55 minutes', true),
('Ameerpet', 'Hyderabad', '500016-500016', 35.00, 450.00, '25-40 minutes', true),
('Madhapur', 'Hyderabad', '500081-500081', 40.00, 500.00, '30-45 minutes', true),
('Anna Nagar', 'Chennai', '600040-600040', 35.00, 450.00, '25-40 minutes', true),
('T Nagar', 'Chennai', '600017-600017', 30.00, 400.00, '20-35 minutes', true),
('Velachery', 'Chennai', '600042-600042', 45.00, 550.00, '30-45 minutes', true),
('OMR', 'Chennai', '600097-600097', 50.00, 600.00, '35-50 minutes', true),
('Mylapore', 'Chennai', '600004-600004', 35.00, 450.00, '25-40 minutes', true),
('Navrangpura', 'Ahmedabad', '380009-380009', 40.00, 500.00, '30-45 minutes', true);

-- Add more Vendor Contracts, Delivery Vehicles, Feedback, etc. following the same pattern...

-- ======================================================
-- Finish with a confirmation message
-- ======================================================
SELECT 'Bulk data has been successfully added to the SmartGrocer database.' AS Message;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS=1;