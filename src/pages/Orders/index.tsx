import { useState, useEffect } from 'react'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "../../components/ui/card"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../../components/ui/table"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Search, ShoppingCart, TrendingUp, PlusCircle, RefreshCcw, ShoppingBag } from "lucide-react"
import { Badge } from "../../components/ui/badge"
import { ordersApi } from "../../lib/api"
import OrderForm from "../../components/OrderForm"
import PurchaseForm from "../../components/PurchaseForm"

interface Order {
  id: number
  customer_id: number
  customer_name: string
  order_date: string
  status: string
  total_amount: number
  created_at: string
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false)
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false)
  const [error, setError] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      setError('')
      console.log('Orders component: Fetching orders data')
      const data = await ordersApi.getAll()
      console.log('Orders component: Orders data received', data)
      
      // Verify that we received valid data
      if (!data || !Array.isArray(data)) {
        throw new Error('Invalid data format received from server')
      }
      
      setOrders(data)
    } catch (error) {
      console.error('Error fetching orders:', error)
      setError('Failed to load orders. Please try again.')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    console.log('Orders component: useEffect running')
    fetchOrders()
  }, [])

  // Filter orders based on search term
  const filteredOrders = orders.filter(order => 
    (order.customer_name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (order.status || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toString().includes(searchTerm)
  )

  // Get badge for order status
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

  const handleAddPurchase = () => {
    setIsPurchaseOpen(true)
  }

  const handleOrderAdded = () => {
    fetchOrders()
  }
  
  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchOrders()
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
  
  // Format amount with Rupee symbol
  const formatAmount = (amount: number) => {
    return `₹${typeof amount === 'number' ? amount.toFixed(2) : '0.00'}`
  }

  // Calculate total sales
  const totalSales = orders
    .filter(order => (order.status || '').toLowerCase() !== 'cancelled')
    .reduce((sum, order) => sum + (typeof order.total_amount === 'number' ? order.total_amount : 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isLoading || isRefreshing}
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button 
            variant="secondary"
            onClick={handleAddPurchase}
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            New Purchase
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Orders
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            {error && <div className="text-xs text-red-500 mt-1">Error loading data</div>}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Sales
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatAmount(totalSales)}</div>
            {error && <div className="text-xs text-red-500 mt-1">Error loading data</div>}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>
            Manage your customer orders
          </CardDescription>
          <div className="flex items-center mt-4">
            <Search className="h-4 w-4 mr-2 text-muted-foreground" />
            <Input 
              placeholder="Search orders..." 
              className="max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center text-muted-foreground">Loading orders...</div>
          ) : error ? (
            <div className="py-8 text-center">
              <div className="text-red-500 mb-4">{error}</div>
              <Button variant="outline" onClick={handleRefresh}>
                <RefreshCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">No orders found</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.id}</TableCell>
                      <TableCell>{order.customer_name || 'Unknown'}</TableCell>
                      <TableCell>{formatDate(order.order_date)}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>{formatAmount(order.total_amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <OrderForm 
        isOpen={isAddOrderOpen}
        onClose={() => setIsAddOrderOpen(false)}
        onSuccess={handleOrderAdded}
      />
      
      <PurchaseForm
        isOpen={isPurchaseOpen}
        onClose={() => setIsPurchaseOpen(false)}
        onSuccess={handleOrderAdded}
      />
    </div>
  )
}

export default Orders 