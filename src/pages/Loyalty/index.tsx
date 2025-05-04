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
import { Badge } from "../../components/ui/badge"
import { Search, RefreshCcw, Star, Award, Users, CreditCard } from "lucide-react"
import { loyaltyApi } from "../../lib/api"

interface LoyaltyProgram {
  id: number
  name: string
  description: string
  points_per_rupee: number
  min_points_to_redeem: number
  conversion_rate: number
  expiry_months: number
  is_active: boolean
  created_at: string
  updated_at: string
}

interface LoyaltyTransaction {
  id: number
  customer_id: number
  program_id: number
  order_id: number | null
  points: number
  transaction_type: 'earn' | 'redeem' | 'expire' | 'adjustment'
  reference_id: string
  notes: string
  created_at: string
  program_name: string
}

const Loyalty = () => {
  const [programs, setPrograms] = useState<LoyaltyProgram[]>([])
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState<'programs' | 'transactions'>('programs')
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null)
  
  const fetchPrograms = async () => {
    try {
      setIsLoading(true)
      setError('')
      
      const data = await loyaltyApi.getPrograms()
      
      if (Array.isArray(data)) {
        setPrograms(data)
      }
      
      // For demo purposes, fetch transactions for the first customer
      if (selectedCustomerId === null && data.length > 0) {
        try {
          const customerTransactions = await loyaltyApi.getCustomerPoints(1) // First customer ID
          if (Array.isArray(customerTransactions)) {
            setTransactions(customerTransactions)
            setSelectedCustomerId(1)
          }
        } catch (err) {
          console.error('Error fetching sample customer points:', err)
        }
      }
    } catch (error) {
      console.error('Error fetching loyalty programs:', error)
      setError('Failed to load loyalty programs. Please try again.')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  const fetchCustomerTransactions = async (customerId: number) => {
    if (!customerId) return

    try {
      setIsLoading(true)
      
      const data = await loyaltyApi.getCustomerPoints(customerId)
      
      if (Array.isArray(data)) {
        setTransactions(data)
        setSelectedCustomerId(customerId)
      }
    } catch (error) {
      console.error(`Error fetching transactions for customer ${customerId}:`, error)
      setError(`Failed to load transactions for customer ${customerId}. Please try again.`)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPrograms()
  }, [])

  // Filter programs based on search term
  const filteredPrograms = programs.filter(program => 
    program.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    program.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter(transaction => 
    transaction.program_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    transaction.transaction_type?.includes(searchTerm.toLowerCase()) ||
    transaction.reference_id?.includes(searchTerm) ||
    transaction.notes?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchPrograms()
  }

  // Calculate stats
  const activePrograms = programs.filter(p => p.is_active).length
  const totalEarnedPoints = transactions.reduce((sum, t) => t.transaction_type === 'earn' ? sum + t.points : sum, 0)
  const totalRedeemedPoints = transactions.reduce((sum, t) => t.transaction_type === 'redeem' ? sum + Math.abs(t.points) : sum, 0)
  const availablePoints = totalEarnedPoints - totalRedeemedPoints

  // Helper to format transaction type badge
  const getTransactionBadge = (type: string) => {
    switch (type) {
      case 'earn':
        return <Badge variant="success">Earned</Badge>
      case 'redeem':
        return <Badge variant="default">Redeemed</Badge>
      case 'expire':
        return <Badge variant="destructive">Expired</Badge>
      case 'adjustment':
        return <Badge variant="secondary">Adjusted</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).format(date)
    } catch (e) {
      return 'Invalid date'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Loyalty Programs</h2>
        <Button 
          variant="outline" 
          onClick={handleRefresh}
          disabled={isLoading || isRefreshing}
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Programs
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePrograms}</div>
            <p className="text-xs text-muted-foreground">
              Out of {programs.length} total programs
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Points Earned
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEarnedPoints}</div>
            <p className="text-xs text-muted-foreground">
              Total points earned by current customer
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Points
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availablePoints}</div>
            <p className="text-xs text-muted-foreground">
              {availablePoints > 0 ? `Worth approx. ₹${(availablePoints * 0.25).toFixed(2)}` : 'No points available'}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between flex-wrap gap-4">
            <div>
              <CardTitle>Loyalty Management</CardTitle>
              <CardDescription>
                Manage loyalty programs and customer rewards
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                variant={activeTab === 'programs' ? 'default' : 'outline'} 
                onClick={() => setActiveTab('programs')}
              >
                <Award className="h-4 w-4 mr-2" />
                Programs
              </Button>
              <Button 
                variant={activeTab === 'transactions' ? 'default' : 'outline'} 
                onClick={() => setActiveTab('transactions')}
              >
                <Star className="h-4 w-4 mr-2" />
                Transactions
              </Button>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <Search className="h-4 w-4 mr-2 text-muted-foreground" />
            <Input 
              placeholder="Search..." 
              className="max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center text-muted-foreground">Loading data...</div>
          ) : error ? (
            <div className="py-8 text-center">
              <div className="text-red-500 mb-4">{error}</div>
              <Button variant="outline" onClick={handleRefresh}>
                <RefreshCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {activeTab === 'programs' && (
                filteredPrograms.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">No loyalty programs found</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Program Name</TableHead>
                        <TableHead>Points Value</TableHead>
                        <TableHead>Min. Points</TableHead>
                        <TableHead>Expiry</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPrograms.map((program) => (
                        <TableRow key={program.id}>
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                              <span>{program.name}</span>
                              <span className="text-xs text-muted-foreground">{program.description}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{program.points_per_rupee} points per ₹1</span>
                              <span className="text-xs text-muted-foreground">₹1 = {1 / program.conversion_rate} points</span>
                            </div>
                          </TableCell>
                          <TableCell>{program.min_points_to_redeem} points</TableCell>
                          <TableCell>{program.expiry_months} months</TableCell>
                          <TableCell>
                            {program.is_active 
                              ? <Badge variant="default">Active</Badge>
                              : <Badge variant="outline">Inactive</Badge>
                            }
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )
              )}
              
              {activeTab === 'transactions' && (
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">
                        {selectedCustomerId 
                          ? `Showing transactions for Customer #${selectedCustomerId}` 
                          : 'No customer selected'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => fetchCustomerTransactions(1)}>
                        Customer #1
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => fetchCustomerTransactions(2)}>
                        Customer #2
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => fetchCustomerTransactions(3)}>
                        Customer #3
                      </Button>
                    </div>
                  </div>
                  
                  {filteredTransactions.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">No transactions found</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Program</TableHead>
                          <TableHead>Points</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Reference</TableHead>
                          <TableHead>Notes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTransactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell>{formatDate(transaction.created_at)}</TableCell>
                            <TableCell>{transaction.program_name}</TableCell>
                            <TableCell className={transaction.points < 0 ? 'text-red-500' : 'text-green-500'}>
                              {transaction.points > 0 ? `+${transaction.points}` : transaction.points}
                            </TableCell>
                            <TableCell>{getTransactionBadge(transaction.transaction_type)}</TableCell>
                            <TableCell className="font-mono text-xs">{transaction.reference_id || '-'}</TableCell>
                            <TableCell className="text-sm">{transaction.notes || '-'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Loyalty 