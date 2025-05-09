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
import { Search, RefreshCcw, FilterX, Filter } from "lucide-react"
import { Badge } from "../../components/ui/badge"
import { inventoryApi } from "../../lib/api"
import { format, parseISO } from 'date-fns'

interface InventoryTransaction {
  id: number
  product_id: number
  product_name: string
  sku: string
  transaction_type: 'purchase' | 'sale' | 'adjustment' | 'return'
  quantity: number
  notes: string | null
  created_at: string
}

const Inventory = () => {
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [typeFilter, setTypeFilter] = useState<string | null>(null)
  
  const fetchTransactions = async () => {
    try {
      setIsLoading(true)
      setError('')
      console.log('Inventory component: Fetching transaction data')
      const data = await inventoryApi.getTransactions()
      console.log('Inventory component: Transaction data received', data)
      
      // Verify that we received valid data
      if (!data || !Array.isArray(data)) {
        throw new Error('Invalid data format received from server')
      }
      
      setTransactions(data)
    } catch (error) {
      console.error('Error fetching inventory transactions:', error)
      setError('Failed to load transaction history. Please try again.')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    console.log('Inventory component: useEffect running')
    fetchTransactions()
  }, [])

  // Filter transactions based on search term and type filter
  const filteredTransactions = transactions.filter(transaction => {
    // First apply search filter
    const matchesSearch = searchTerm === '' || 
      transaction.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      transaction.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.transaction_type.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Then apply type filter if enabled
    if (typeFilter) {
      return matchesSearch && transaction.transaction_type === typeFilter;
    }
    
    return matchesSearch;
  });
  
  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchTransactions()
  }

  const handleClearSearch = () => {
    setSearchTerm('')
  }
  
  const handleFilterByType = (type: string | null) => {
    setTypeFilter(type === typeFilter ? null : type)
  }

  // Helper function to format transaction date
  const formatDate = (dateString: string) => {
    try {
      // Ensure we're parsing a valid ISO date string
      const date = parseISO(dateString);
      return format(date, 'dd MMM yyyy, h:mm a');
    } catch (error) {
      console.error('Date formatting error:', error, dateString);
      return dateString || 'Unknown';
    }
  }

  // Helper function to get transaction type badge
  const getTransactionTypeBadge = (type: string) => {
    switch (type) {
      case 'purchase':
        return <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Purchase</Badge>
      case 'sale':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">Sale</Badge>
      case 'adjustment':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 hover:bg-orange-50">Adjustment</Badge>
      case 'return':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-50">Return</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Inventory Transactions</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isLoading || isRefreshing}
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Inventory Transaction History</CardTitle>
          <CardDescription>
            View all inventory movements and adjustments
          </CardDescription>
          <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search transactions..." 
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute right-1 top-1 h-6 w-6 p-0" 
                  onClick={handleClearSearch}
                >
                  <FilterX className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <div className="text-sm text-muted-foreground mr-2 flex items-center">
                <Filter className="h-4 w-4 mr-1" /> Filter:
              </div>
              <Button 
                variant={typeFilter === 'purchase' ? 'default' : 'outline'} 
                size="sm"
                className={typeFilter === 'purchase' ? 'bg-green-600' : ''}
                onClick={() => handleFilterByType('purchase')}
              >
                Purchases
              </Button>
              <Button 
                variant={typeFilter === 'sale' ? 'default' : 'outline'} 
                size="sm"
                className={typeFilter === 'sale' ? 'bg-blue-600' : ''}
                onClick={() => handleFilterByType('sale')}
              >
                Sales
              </Button>
              <Button 
                variant={typeFilter === 'adjustment' ? 'default' : 'outline'} 
                size="sm"
                className={typeFilter === 'adjustment' ? 'bg-orange-600' : ''}
                onClick={() => handleFilterByType('adjustment')}
              >
                Adjustments
              </Button>
              <Button 
                variant={typeFilter === 'return' ? 'default' : 'outline'} 
                size="sm"
                className={typeFilter === 'return' ? 'bg-purple-600' : ''}
                onClick={() => handleFilterByType('return')}
              >
                Returns
              </Button>
              {typeFilter && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setTypeFilter(null)}
                >
                  <FilterX className="h-4 w-4 mr-1" /> Clear
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center text-muted-foreground">Loading transactions...</div>
          ) : error ? (
            <div className="py-8 text-center">
              <div className="text-red-500 mb-4">{error}</div>
              <Button variant="outline" onClick={handleRefresh}>
                <RefreshCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              {searchTerm || typeFilter ? 'No transactions matching your search or filter' : 'No transactions found'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="whitespace-nowrap">
                        {formatDate(transaction.created_at)}
                      </TableCell>
                      <TableCell className="font-medium">{transaction.product_name}</TableCell>
                      <TableCell>{transaction.sku}</TableCell>
                      <TableCell>{getTransactionTypeBadge(transaction.transaction_type)}</TableCell>
                      <TableCell className={
                        transaction.transaction_type === 'sale' 
                          ? 'text-red-600 font-medium' 
                          : transaction.transaction_type === 'purchase' || transaction.transaction_type === 'return'
                            ? 'text-green-600 font-medium'
                            : ''
                      }>
                        {transaction.transaction_type === 'sale' ? `-${transaction.quantity}` : transaction.quantity}
                      </TableCell>
                      <TableCell className="max-w-md truncate">
                        {transaction.notes || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Inventory 