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
import { Search, RefreshCcw, MessageSquare, Star, ThumbsUp, ThumbsDown, Check, X } from "lucide-react"
import { feedbackApi } from "../../lib/api"

interface Feedback {
  id: number
  customer_id: number
  order_id: number | null
  product_id: number | null
  rating: number
  comments: string
  feedback_date: string
  status: 'pending' | 'approved' | 'rejected'
  is_public: boolean
  customer_name: string
  product_name: string | null
}

const Feedback = () => {
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  
  const fetchFeedback = async () => {
    try {
      setIsLoading(true)
      setError('')
      
      const data = await feedbackApi.getAll()
      
      if (Array.isArray(data)) {
        setFeedback(data)
      }
    } catch (error) {
      console.error('Error fetching feedback:', error)
      setError('Failed to load customer feedback. Please try again.')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchFeedback()
  }, [])

  // Handle feedback status updates
  const handleApprove = async (feedbackId: number) => {
    try {
      await feedbackApi.updateStatus(feedbackId, 'approved')
      // Update local state
      setFeedback(prev => 
        prev.map(item => 
          item.id === feedbackId ? { ...item, status: 'approved' } : item
        )
      )
    } catch (error) {
      console.error(`Error approving feedback ${feedbackId}:`, error)
      setError('Failed to approve feedback. Please try again.')
    }
  }

  const handleReject = async (feedbackId: number) => {
    try {
      await feedbackApi.updateStatus(feedbackId, 'rejected')
      // Update local state
      setFeedback(prev => 
        prev.map(item => 
          item.id === feedbackId ? { ...item, status: 'rejected' } : item
        )
      )
    } catch (error) {
      console.error(`Error rejecting feedback ${feedbackId}:`, error)
      setError('Failed to reject feedback. Please try again.')
    }
  }

  // Filter feedback based on search term and status filter
  const filteredFeedback = feedback.filter(item => {
    // Status filter
    if (statusFilter !== 'all' && item.status !== statusFilter) {
      return false
    }
    
    // Search term filter
    return (
      item.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.comments?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchFeedback()
  }

  // Calculate stats
  const pendingCount = feedback.filter(item => item.status === 'pending').length
  const approvedCount = feedback.filter(item => item.status === 'approved').length
  const averageRating = feedback.length 
    ? (feedback.reduce((sum, item) => sum + item.rating, 0) / feedback.length).toFixed(1)
    : '0.0'

  // Get rating stars
  const getRatingStars = (rating: number) => {
    const stars = []
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star 
          key={i} 
          className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
        />
      )
    }
    return <div className="flex">{stars}</div>
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

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>
      case 'approved':
        return <Badge variant="success">Approved</Badge>
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Customer Feedback</h2>
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
              Average Rating
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating}/5</div>
            <div className="flex mt-1">
              {getRatingStars(parseInt(averageRating))}
              <span className="text-xs text-muted-foreground ml-2">
                Based on {feedback.length} reviews
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Feedback
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">
              Requires review and approval
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Public Reviews
            </CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedCount}</div>
            <p className="text-xs text-muted-foreground">
              Displayed on the website
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Feedback Management</CardTitle>
          <CardDescription>
            Review and manage customer feedback
          </CardDescription>
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center">
              <Search className="h-4 w-4 mr-2 text-muted-foreground" />
              <Input 
                placeholder="Search feedback..." 
                className="max-w-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant={statusFilter === 'all' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setStatusFilter('all')}
              >
                All
              </Button>
              <Button 
                variant={statusFilter === 'pending' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setStatusFilter('pending')}
              >
                Pending
              </Button>
              <Button 
                variant={statusFilter === 'approved' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setStatusFilter('approved')}
              >
                Approved
              </Button>
              <Button 
                variant={statusFilter === 'rejected' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setStatusFilter('rejected')}
              >
                Rejected
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center text-muted-foreground">Loading feedback...</div>
          ) : error ? (
            <div className="py-8 text-center">
              <div className="text-red-500 mb-4">{error}</div>
              <Button variant="outline" onClick={handleRefresh}>
                <RefreshCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          ) : filteredFeedback.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">No feedback found</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Comments</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFeedback.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{formatDate(item.feedback_date)}</TableCell>
                      <TableCell className="font-medium">{item.customer_name}</TableCell>
                      <TableCell>{item.product_name || 'N/A'}</TableCell>
                      <TableCell>{getRatingStars(item.rating)}</TableCell>
                      <TableCell className="max-w-xs truncate">{item.comments}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>
                        {item.status === 'pending' && (
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 w-8 p-0" 
                              onClick={() => handleApprove(item.id)}
                              title="Approve"
                            >
                              <Check className="h-4 w-4 text-green-500" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 w-8 p-0" 
                              onClick={() => handleReject(item.id)}
                              title="Reject"
                            >
                              <X className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        )}
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

export default Feedback 