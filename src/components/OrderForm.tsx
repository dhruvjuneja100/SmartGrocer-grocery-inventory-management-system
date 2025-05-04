import { useState, useEffect } from 'react'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from './ui/select'
import { ordersApi, customersApi } from '../lib/api'

interface Customer {
  id: number
  name: string
}

interface OrderFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const OrderForm = ({ isOpen, onClose, onSuccess }: OrderFormProps) => {
  const [formData, setFormData] = useState({
    customer_id: '',
    order_date: '',
    status: 'pending',
    total_amount: ''
  })
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setIsLoading(true)
        const data = await customersApi.getAll()
        setCustomers(data)
      } catch (error) {
        console.error('Error fetching customers:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (isOpen) {
      fetchCustomers()
      
      // Set default order date to today
      const today = new Date().toISOString().split('T')[0]
      setFormData(prev => ({ ...prev, order_date: today }))
    }
  }, [isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      // Validate form
      if (!formData.customer_id || !formData.status || !formData.total_amount) {
        throw new Error('Customer, status, and total amount are required')
      }

      const orderData = {
        customer_id: parseInt(formData.customer_id),
        order_date: formData.order_date,
        status: formData.status,
        total_amount: parseFloat(formData.total_amount)
      }

      if (isNaN(orderData.customer_id) || isNaN(orderData.total_amount)) {
        throw new Error('Customer ID and total amount must be valid numbers')
      }

      // Submit to API
      await ordersApi.create(orderData)
      
      // Reset form and close dialog
      setFormData({
        customer_id: '',
        order_date: '',
        status: 'pending',
        total_amount: ''
      })
      onSuccess()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Order</DialogTitle>
          <DialogDescription>
            Enter the order details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="customer_id">Customer</Label>
            <Select 
              name="customer_id"
              value={formData.customer_id} 
              onValueChange={(value) => handleSelectChange('customer_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select customer" />
              </SelectTrigger>
              <SelectContent>
                {isLoading ? (
                  <SelectItem value="loading" disabled>Loading customers...</SelectItem>
                ) : customers.length === 0 ? (
                  <SelectItem value="none" disabled>No customers found</SelectItem>
                ) : (
                  customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id.toString()}>
                      {customer.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid w-full items-center gap-2">
            <Label htmlFor="order_date">Order Date</Label>
            <Input
              id="order_date"
              name="order_date"
              type="date"
              value={formData.order_date}
              onChange={handleChange}
            />
          </div>

          <div className="grid w-full items-center gap-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              name="status"
              value={formData.status} 
              onValueChange={(value) => handleSelectChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid w-full items-center gap-2">
            <Label htmlFor="total_amount">Total Amount (₹)</Label>
            <Input
              id="total_amount"
              name="total_amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.total_amount}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>

          {error && (
            <div className="text-sm font-medium text-red-500">
              {error}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Order'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default OrderForm 