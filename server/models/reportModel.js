import { pool } from '../config/db.js';

export const getSalesSummary = async () => {
  // Get total sales
  const [salesTotal] = await pool.query(`
    SELECT SUM(total_amount) as total_sales
    FROM orders
  `);
  
  // Get average profit margin (simplified calculation)
  const profitMargin = 0.34; // 34% average profit margin
  const totalSales = salesTotal[0].total_sales || 0;
  const totalProfit = totalSales * profitMargin;
  
  // Get order count
  const [orderCount] = await pool.query(`
    SELECT COUNT(*) as count
    FROM orders
  `);
  
  // Calculate average order value
  const avgOrderValue = orderCount[0].count > 0 
    ? totalSales / orderCount[0].count 
    : 0;
  
  // Monthly sales data (simplified with mock data)
  const monthlySales = [
    { month: 'Jan', sales: 8500, profit: 2800 },
    { month: 'Feb', sales: 9200, profit: 3100 },
    { month: 'Mar', sales: 11000, profit: 3600 },
    { month: 'Apr', sales: 10500, profit: 3500 },
    { month: 'May', sales: 12000, profit: 4000 },
    { month: 'Jun', sales: 13500, profit: 4500 },
    { month: 'Jul', sales: 12800, profit: 4200 },
    { month: 'Aug', sales: 11500, profit: 3800 },
    { month: 'Sep', sales: 12000, profit: 4000 },
    { month: 'Oct', sales: 13000, profit: 4300 },
    { month: 'Nov', sales: 12500, profit: 4100 },
    { month: 'Dec', sales: 14200, profit: 4600 }
  ];
  
  // Get top products by sales
  const [topProducts] = await pool.query(`
    SELECT p.name, SUM(oi.quantity * oi.unit_price) as sales, SUM(oi.quantity) as quantity
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    GROUP BY p.id
    ORDER BY sales DESC
    LIMIT 5
  `);
  
  return {
    totalSales,
    totalProfit,
    orderCount: orderCount[0].count,
    averageOrderValue: avgOrderValue,
    monthlySales,
    topProducts: topProducts.map(p => ({
      name: p.name,
      sales: parseFloat(p.sales) || 0,
      quantity: parseInt(p.quantity) || 0
    }))
  };
};

export const getInventorySummary = async () => {
  // Get total inventory value
  const [inventoryTotal] = await pool.query(`
    SELECT SUM(stock_quantity * price) as total_value, COUNT(*) as total_items
    FROM products
  `);
  
  // Get low stock items count
  const [lowStockCount] = await pool.query(`
    SELECT COUNT(*) as count
    FROM products
    WHERE stock_quantity < 20
  `);
  
  // Category distribution
  const [categoryDistribution] = await pool.query(`
    SELECT category, SUM(stock_quantity * price) as value
    FROM products
    GROUP BY category
    ORDER BY value DESC
  `);
  
  // Calculate total for percentages
  const totalValue = parseFloat(inventoryTotal[0].total_value) || 0;
  
  // Recent purchases (simplified with mock data)
  const recentPurchases = [
    { date: '2023-04-25', value: 12500, supplier: 'Amul Distributors' },
    { date: '2023-04-18', value: 18700, supplier: 'Coca-Cola Bottlers' },
    { date: '2023-04-12', value: 9800, supplier: 'Haldiram Foods' },
    { date: '2023-04-05', value: 14200, supplier: 'P&G Distributors' },
    { date: '2023-03-29', value: 11500, supplier: 'Britannia Agents' }
  ];
  
  return {
    totalValue,
    totalItems: inventoryTotal[0].total_items || 0,
    lowStockItems: lowStockCount[0].count || 0,
    averageStockValue: totalValue / (inventoryTotal[0].total_items || 1),
    categoryDistribution: categoryDistribution.map(cat => ({
      category: cat.category || 'Uncategorized',
      value: parseFloat(cat.value) || 0,
      percentage: totalValue > 0 ? (parseFloat(cat.value) / totalValue * 100) : 0
    })),
    recentPurchases
  };
};

export const getFinancialSummary = async () => {
  // Get total sales revenue
  const [revenue] = await pool.query(`
    SELECT SUM(total_amount) as total_revenue
    FROM orders
  `);
  
  const totalRevenue = parseFloat(revenue[0].total_revenue) || 0;
  
  // Simplified expense calculation
  const totalExpenses = totalRevenue * 0.66; // 66% of revenue goes to expenses
  const netProfit = totalRevenue - totalExpenses;
  
  // Expense breakdown (simplified with reasonable estimates)
  const expenseBreakdown = [
    { category: 'Inventory Purchase', value: totalExpenses * 0.758, percentage: 75.8 },
    { category: 'Employee Salaries', value: totalExpenses * 0.145, percentage: 14.5 },
    { category: 'Rent', value: totalExpenses * 0.058, percentage: 5.8 },
    { category: 'Utilities', value: totalExpenses * 0.022, percentage: 2.2 },
    { category: 'Marketing', value: totalExpenses * 0.012, percentage: 1.2 },
    { category: 'Others', value: totalExpenses * 0.005, percentage: 0.5 }
  ];
  
  // Monthly financials (simplified with mock data)
  const monthlyFinancials = [
    { month: 'Jan', revenue: 92000, expenses: 65000, profit: 27000 },
    { month: 'Feb', revenue: 98000, expenses: 68000, profit: 30000 },
    { month: 'Mar', revenue: 110000, expenses: 74000, profit: 36000 },
    { month: 'Apr', revenue: 105000, expenses: 71000, profit: 34000 },
    { month: 'May', revenue: 112000, expenses: 75000, profit: 37000 },
    { month: 'Jun', revenue: 118000, expenses: 79000, profit: 39000 },
    { month: 'Jul', revenue: 115000, expenses: 77000, profit: 38000 },
    { month: 'Aug', revenue: 108000, expenses: 72000, profit: 36000 },
    { month: 'Sep', revenue: 110000, expenses: 74000, profit: 36000 },
    { month: 'Oct', revenue: 114000, expenses: 76000, profit: 38000 },
    { month: 'Nov', revenue: 110000, expenses: 74000, profit: 36000 },
    { month: 'Dec', revenue: 120000, expenses: 81000, profit: 39000 }
  ];
  
  return {
    totalRevenue,
    totalExpenses,
    netProfit,
    expenseBreakdown,
    monthlyFinancials
  };
};

export const getEmployeeSummary = async () => {
  // Get employee count
  const [employeeCount] = await pool.query(`
    SELECT COUNT(*) as count
    FROM employees
  `);
  
  const totalEmployees = employeeCount[0].count || 0;
  
  // Simplified salary data
  const totalSalaries = 120000; // Estimated total monthly salaries
  const averageSalary = totalEmployees > 0 ? totalSalaries / totalEmployees : 0;
  
  // Department distribution (simplified with mock data)
  const departmentDistribution = [
    { department: 'Sales', count: 8, percentage: 33.3 },
    { department: 'Inventory', count: 6, percentage: 25.0 },
    { department: 'Cashier', count: 5, percentage: 20.8 },
    { department: 'Management', count: 3, percentage: 12.5 },
    { department: 'Delivery', count: 2, percentage: 8.4 }
  ];
  
  // Salary distribution (simplified with mock data)
  const salaryDistribution = [
    { range: '< ₹3000', count: 3 },
    { range: '₹3000-₹5000', count: 9 },
    { range: '₹5000-₹7000', count: 7 },
    { range: '₹7000-₹10000', count: 3 },
    { range: '> ₹10000', count: 2 }
  ];
  
  return {
    totalEmployees,
    totalSalaries,
    averageSalary,
    departmentDistribution,
    salaryDistribution
  };
};

export const getCustomerSummary = async () => {
  // Get total customers
  const [customerCount] = await pool.query(`
    SELECT COUNT(*) as count
    FROM customers
  `);
  
  const totalCustomers = customerCount[0].count || 0;
  
  // New customers in the last 30 days
  const [newCustomers] = await pool.query(`
    SELECT COUNT(*) as count
    FROM customers
    WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
  `);
  
  // Active customers (made an order in the last 90 days)
  const [activeCustomers] = await pool.query(`
    SELECT COUNT(DISTINCT c.id) as count
    FROM customers c
    JOIN orders o ON c.id = o.customer_id
    WHERE o.order_date >= DATE_SUB(CURDATE(), INTERVAL 90 DAY)
  `);
  
  // Customer growth (simplified with mock data)
  const customerGrowth = [
    { month: 'Jan', customers: 725 },
    { month: 'Feb', customers: 742 },
    { month: 'Mar', customers: 760 },
    { month: 'Apr', customers: 778 },
    { month: 'May', customers: 790 },
    { month: 'Jun', customers: 805 },
    { month: 'Jul', customers: 815 },
    { month: 'Aug', customers: 825 },
    { month: 'Sep', customers: 832 },
    { month: 'Oct', customers: 840 },
    { month: 'Nov', customers: 845 },
    { month: 'Dec', customers: 850 }
  ];
  
  // Top customers by order value
  const [topCustomers] = await pool.query(`
    SELECT c.name, COUNT(o.id) as orders, SUM(o.total_amount) as value
    FROM customers c
    JOIN orders o ON c.id = o.customer_id
    GROUP BY c.id
    ORDER BY value DESC
    LIMIT 5
  `);
  
  return {
    totalCustomers,
    newCustomers: newCustomers[0].count || 0,
    activeCustomers: activeCustomers[0].count || 0,
    customerGrowth,
    topCustomers: topCustomers.map(c => ({
      name: c.name,
      orders: parseInt(c.orders) || 0,
      value: parseFloat(c.value) || 0
    }))
  };
};
