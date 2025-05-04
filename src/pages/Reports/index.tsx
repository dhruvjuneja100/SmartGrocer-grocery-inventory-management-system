import { useState, useEffect } from 'react'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "../../components/ui/card"
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "../../components/ui/tabs"
import { 
  BarChart, 
  LineChart,
  PieChart,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  Layers,
  ArrowDown,
  ArrowUp,
  Percent
} from "lucide-react"
import { reportsApi } from "../../lib/api"
import {
  Bar,
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
  PieChart as RechartsPieChart,
  Pie,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts'

// Custom currency formatter
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
};

// Color array for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A259FF', '#4CAF50', '#FF6384'];

const Reports = () => {
  // State for different report data
  const [salesData, setSalesData] = useState<any>(null)
  const [inventoryData, setInventoryData] = useState<any>(null)
  const [financialData, setFinancialData] = useState<any>(null)
  const [employeeData, setEmployeeData] = useState<any>(null)
  const [customerData, setCustomerData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('financial')

  // Fetch all report data
  useEffect(() => {
    const fetchReportData = async () => {
      setIsLoading(true)
      try {
        const [sales, inventory, financial, employee, customer] = await Promise.all([
          reportsApi.getSalesSummary(),
          reportsApi.getInventorySummary(),
          reportsApi.getFinancialSummary(),
          reportsApi.getEmployeeSummary(),
          reportsApi.getCustomerSummary()
        ])
        
        setSalesData(sales)
        setInventoryData(inventory)
        setFinancialData(financial)
        setEmployeeData(employee)
        setCustomerData(customer)
      } catch (error) {
        console.error('Error fetching report data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchReportData()
  }, [])

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Reports & Analytics</h2>
      </div>
      
      {isLoading ? (
        <div className="h-[500px] flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading report data...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(financialData?.totalRevenue || 0)}</div>
                <p className="text-xs text-muted-foreground">
                  Financial year 2023-24
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Net Profit
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(financialData?.netProfit || 0)}</div>
                <div className="flex items-center pt-1">
                  <ArrowUp className="h-3 w-3 text-emerald-500 mr-1" />
                  <span className="text-xs text-emerald-500">+2.5% from last year</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Inventory Value
                </CardTitle>
                <Layers className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(inventoryData?.totalValue || 0)}</div>
                <div className="flex items-center pt-1">
                  <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                  <span className="text-xs text-red-500">-1.2% from last month</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Customers
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{customerData?.activeCustomers || 0}</div>
                <div className="flex items-center pt-1">
                  <ArrowUp className="h-3 w-3 text-emerald-500 mr-1" />
                  <span className="text-xs text-emerald-500">+5.3% from last month</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Tabs For Different Reports */}
          <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="sales">Sales</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="employees">Employees</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
            </TabsList>
            
            {/* Financial Tab */}
            <TabsContent value="financial" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Monthly Financial Overview</CardTitle>
                    <CardDescription>Revenue, expenses, and profit trends over the year</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={financialData?.monthlyFinancials || []}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                        <Legend />
                        <Bar dataKey="revenue" name="Revenue" fill="#0088FE" />
                        <Bar dataKey="expenses" name="Expenses" fill="#FF8042" />
                        <Bar dataKey="profit" name="Profit" fill="#00C49F" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Expense Breakdown</CardTitle>
                    <CardDescription>Distribution of expenses by category</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={financialData?.expenseBreakdown || []}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {financialData?.expenseBreakdown.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card className="md:col-span-3">
                  <CardHeader>
                    <CardTitle>Financial Metrics</CardTitle>
                    <CardDescription>Key performance indicators</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <p className="text-muted-foreground text-sm">Total Revenue</p>
                        <p className="text-2xl font-bold">{formatCurrency(financialData?.totalRevenue || 0)}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-muted-foreground text-sm">Total Expenses</p>
                        <p className="text-2xl font-bold">{formatCurrency(financialData?.totalExpenses || 0)}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-muted-foreground text-sm">Net Profit</p>
                        <p className="text-2xl font-bold">{formatCurrency(financialData?.netProfit || 0)}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-muted-foreground text-sm">Profit Margin</p>
                        <p className="text-2xl font-bold">
                          {((financialData?.netProfit / financialData?.totalRevenue) * 100 || 0).toFixed(1)}%
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-muted-foreground text-sm">Inventory Cost</p>
                        <p className="text-2xl font-bold">
                          {formatCurrency(financialData?.expenseBreakdown[0]?.value || 0)}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-muted-foreground text-sm">Employee Salaries</p>
                        <p className="text-2xl font-bold">
                          {formatCurrency(financialData?.expenseBreakdown[1]?.value || 0)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Sales Tab */}
            <TabsContent value="sales" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Monthly Sales & Profits</CardTitle>
                    <CardDescription>Sales and profit trends over the year</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart
                        data={salesData?.monthlySales || []}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                        <Legend />
                        <Line type="monotone" dataKey="sales" name="Sales" stroke="#0088FE" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="profit" name="Profit" stroke="#00C49F" />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Top Products</CardTitle>
                    <CardDescription>Best-selling products</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={salesData?.topProducts || []}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                        <Bar dataKey="sales" name="Sales" fill="#0088FE" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card className="md:col-span-3">
                  <CardHeader>
                    <CardTitle>Sales Metrics</CardTitle>
                    <CardDescription>Key performance indicators</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <p className="text-muted-foreground text-sm">Total Sales</p>
                        <p className="text-2xl font-bold">{formatCurrency(salesData?.totalSales || 0)}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-muted-foreground text-sm">Total Profit</p>
                        <p className="text-2xl font-bold">{formatCurrency(salesData?.totalProfit || 0)}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-muted-foreground text-sm">Order Count</p>
                        <p className="text-2xl font-bold">{salesData?.orderCount || 0}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-muted-foreground text-sm">Average Order Value</p>
                        <p className="text-2xl font-bold">{formatCurrency(salesData?.averageOrderValue || 0)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Inventory Tab */}
            <TabsContent value="inventory" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Category Distribution</CardTitle>
                    <CardDescription>Inventory value by category</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={inventoryData?.categoryDistribution || []}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {inventoryData?.categoryDistribution.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Recent Purchases</CardTitle>
                    <CardDescription>Recently purchased inventory</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={inventoryData?.recentPurchases || []}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                        <Legend />
                        <Bar dataKey="value" name="Purchase Value" fill="#0088FE" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card className="md:col-span-3">
                  <CardHeader>
                    <CardTitle>Inventory Metrics</CardTitle>
                    <CardDescription>Key inventory statistics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <p className="text-muted-foreground text-sm">Total Value</p>
                        <p className="text-2xl font-bold">{formatCurrency(inventoryData?.totalValue || 0)}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-muted-foreground text-sm">Total Items</p>
                        <p className="text-2xl font-bold">{inventoryData?.totalItems || 0}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-muted-foreground text-sm">Low Stock Items</p>
                        <p className="text-2xl font-bold">{inventoryData?.lowStockItems || 0}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-muted-foreground text-sm">Average Item Value</p>
                        <p className="text-2xl font-bold">{formatCurrency(inventoryData?.averageStockValue || 0)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Employees Tab */}
            <TabsContent value="employees" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Department Distribution</CardTitle>
                    <CardDescription>Employees by department</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={employeeData?.departmentDistribution || []}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {employeeData?.departmentDistribution.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Salary Distribution</CardTitle>
                    <CardDescription>Employee count by salary range</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={employeeData?.salaryDistribution || []}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="range" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" name="Employee Count" fill="#0088FE" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card className="md:col-span-3">
                  <CardHeader>
                    <CardTitle>Employee Metrics</CardTitle>
                    <CardDescription>Key employee statistics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <p className="text-muted-foreground text-sm">Total Employees</p>
                        <p className="text-2xl font-bold">{employeeData?.totalEmployees || 0}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-muted-foreground text-sm">Total Salary Expense</p>
                        <p className="text-2xl font-bold">{formatCurrency(employeeData?.totalSalaries || 0)}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-muted-foreground text-sm">Average Salary</p>
                        <p className="text-2xl font-bold">{formatCurrency(employeeData?.averageSalary || 0)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Customers Tab */}
            <TabsContent value="customers" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Customer Growth</CardTitle>
                    <CardDescription>Monthly customer acquisition</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart
                        data={customerData?.customerGrowth || []}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="customers" name="Customers" stroke="#0088FE" activeDot={{ r: 8 }} />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Top Customers</CardTitle>
                    <CardDescription>Customers by order value</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={customerData?.topCustomers || []}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                        <Bar dataKey="value" name="Order Value" fill="#0088FE" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card className="md:col-span-3">
                  <CardHeader>
                    <CardTitle>Customer Metrics</CardTitle>
                    <CardDescription>Key customer statistics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <p className="text-muted-foreground text-sm">Total Customers</p>
                        <p className="text-2xl font-bold">{customerData?.totalCustomers || 0}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-muted-foreground text-sm">New Customers (This Month)</p>
                        <p className="text-2xl font-bold">{customerData?.newCustomers || 0}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-muted-foreground text-sm">Active Customers</p>
                        <p className="text-2xl font-bold">{customerData?.activeCustomers || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}

export default Reports 