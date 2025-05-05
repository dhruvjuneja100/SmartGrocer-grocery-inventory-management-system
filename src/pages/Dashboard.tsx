import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { PackageIcon, ShoppingCart, Users, Truck, DollarSign, RefreshCcw, Tag, Store, MapPin, Star, MessageSquare } from "lucide-react"
import { productsApi, ordersApi, customersApi, suppliersApi, employeesApi, promotionsApi, loyaltyApi, feedbackApi, storeLocationsApi, deliveryApi } from "../lib/api"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalSales: 0,
    ordersCount: 0,
    productsCount: 0,
    customersCount: 0,
    suppliersCount: 0,
    activePromotions: 0,
    storeLocations: 0,
    pendingDeliveries: 0,
    loyaltyMembers: 0,
    feedbackCount: 0
  })
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      setError('')

      // Fetch core data in parallel
      const [products, orders, customers, suppliers] = await Promise.all([
        productsApi.getAll(),
        ordersApi.getAll(),
        customersApi.getAll(),
        suppliersApi.getAll()
      ])
      
      // Try to fetch new feature data as well, but don't block if these fail
      const promotionsPromise = promotionsApi.getAll().catch(() => []);
      const storeLocationsPromise = storeLocationsApi.getAll().catch(() => []);
      const deliveryAssignmentsPromise = deliveryApi.getAssignments().catch(() => []);
      const loyaltyProgramsPromise = loyaltyApi.getPrograms().catch(() => []);
      const feedbackPromise = feedbackApi.getAll().catch(() => []);
      
      // Wait for all the additional data
      const [
        promotions, 
        storeLocations, 
        deliveryAssignments,
        loyaltyPrograms,
        feedback
      ] = await Promise.all([
        promotionsPromise,
        storeLocationsPromise,
        deliveryAssignmentsPromise,
        loyaltyProgramsPromise,
        feedbackPromise
      ]);
      
      // Calculate total sales from completed/processing orders
      const totalSales = orders
        .filter((order: any) => order.status !== 'cancelled')
        .reduce((sum: number, order: any) => sum + (typeof order.total_amount === 'number' ? order.total_amount : 0), 0)
      
      // Count active promotions
      const activePromotions = promotions.filter((promo: any) => {
        if (!promo.is_active) return false;
        const now = new Date();
        const startDate = new Date(promo.start_date);
        const endDate = new Date(promo.end_date);
        return now >= startDate && now <= endDate;
      }).length;
      
      // Count pending deliveries
      const pendingDeliveries = deliveryAssignments.filter(
        (assignment: any) => assignment.delivery_status === 'pending' || 
                          assignment.delivery_status === 'in_transit'
      ).length;
      
      // Set statistics
      setStats({
        totalSales,
        ordersCount: orders.length,
        productsCount: products.length,
        customersCount: customers.length,
        suppliersCount: suppliers.length,
        activePromotions,
        storeLocations: storeLocations.length,
        pendingDeliveries,
        loyaltyMembers: customers.length, // Simplified - in a real app would count customers in loyalty programs
        feedbackCount: feedback.length
      })
      
      // Recent orders (last 5)
      const sortedOrders = [...orders].sort((a, b) => {
        return new Date(b.order_date).getTime() - new Date(a.order_date).getTime()
      }).slice(0, 5)
      setRecentOrders(sortedOrders)
      
      // Low stock products (stock_quantity < 20)
      const productsWithLowStock = products
        .filter(product => product.stock_quantity < 20)
        .sort((a, b) => a.stock_quantity - b.stock_quantity)
        .slice(0, 5)
      setLowStockProducts(productsWithLowStock)
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setError('Failed to load dashboard data. Please try again.')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchDashboardData()
  }

  // Format price with Rupee symbol
  const formatPrice = (price: number) => {
    return `₹${typeof price === 'number' ? price.toFixed(2) : '0.00'}`
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString()
    } catch (e) {
      return 'Invalid date'
    }
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch ((status || '').toLowerCase()) {
      case 'pending':
        return <Badge variant="outline">Pending</Badge>
      case 'processing':
        return <Badge variant="warning">Processing</Badge>
      case 'completed':
        return <Badge variant="default">Completed</Badge>
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status || 'Unknown'}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome to SmartGrocer, your grocery inventory management system
        </p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleRefresh}
          disabled={isLoading || isRefreshing}
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Sales
            </CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "Loading..." : formatPrice(stats.totalSales)}
            </div>
            {error ? (
              <p className="text-xs text-red-500">Error loading data</p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Total sales from orders
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Orders
            </CardTitle>
            <ShoppingCart className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "Loading..." : stats.ordersCount}
            </div>
            {error ? (
              <p className="text-xs text-red-500">Error loading data</p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Total orders
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Products
            </CardTitle>
            <PackageIcon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "Loading..." : stats.productsCount}
            </div>
            {error ? (
              <p className="text-xs text-red-500">Error loading data</p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Total products
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Customers
            </CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "Loading..." : stats.customersCount}
            </div>
            {error ? (
              <p className="text-xs text-red-500">Error loading data</p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Total customers
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
              Suppliers
              </CardTitle>
            <Truck className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "Loading..." : stats.suppliersCount}
            </div>
            {error ? (
              <p className="text-xs text-red-500">Error loading data</p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Total suppliers
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* New features stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Promotions
            </CardTitle>
            <Tag className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "Loading..." : stats.activePromotions}
            </div>
            <p className="text-xs text-muted-foreground">
              Current active promotions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Store Locations
            </CardTitle>
            <Store className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "Loading..." : stats.storeLocations}
            </div>
            <p className="text-xs text-muted-foreground">
              Active store locations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Deliveries
            </CardTitle>
            <MapPin className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "Loading..." : stats.pendingDeliveries}
            </div>
            <p className="text-xs text-muted-foreground">
              Deliveries in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Loyalty Members
            </CardTitle>
            <Star className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "Loading..." : stats.loyaltyMembers}
            </div>
            <p className="text-xs text-muted-foreground">
              Enrolled customers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Feedback
            </CardTitle>
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "Loading..." : stats.feedbackCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Customer reviews
              </p>
            </CardContent>
          </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              Latest orders processed in your store
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-8 text-center text-muted-foreground">Loading orders...</div>
            ) : error ? (
              <div className="py-8 text-center text-red-500">{error}</div>
            ) : recentOrders.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">No orders found</div>
            ) : (
            <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center">
                    <ShoppingCart className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                      <p className="text-sm font-medium">Order #{order.id}</p>
                      <p className="text-xs text-muted-foreground">{order.customer_name || 'Unknown Customer'}</p>
                  </div>
                  <div className="text-right">
                      <p className="text-sm">{formatPrice(order.total_amount)}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(order.order_date)}</p>
                    </div>
                    <div>
                      {getStatusBadge(order.status)}
                  </div>
                </div>
              ))}
            </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Low Stock Products</CardTitle>
            <CardDescription>
              Products that need to be restocked soon
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-8 text-center text-muted-foreground">Loading products...</div>
            ) : error ? (
              <div className="py-8 text-center text-red-500">{error}</div>
            ) : lowStockProducts.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">No low stock products found</div>
            ) : (
            <div className="space-y-4">
                {lowStockProducts.map((product) => (
                  <div key={product.id} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center">
                    <PackageIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                  </div>
                  <div className="text-right">
                      <p className={`text-sm ${product.stock_quantity <= 0 ? 'text-red-500' : 'text-amber-500'}`}>
                        {product.stock_quantity} in stock
                      </p>
                      <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                  </div>
                </div>
              ))}
            </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 