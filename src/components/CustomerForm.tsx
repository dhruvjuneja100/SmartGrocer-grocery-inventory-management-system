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
import { customersApi } from '../lib/api'

interface Customer {
  id: number
  name: string
  email: string
  phone: string
  address: string
}

interface CustomerFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  customer?: Customer // Optional customer for editing
}

const CustomerForm = ({ isOpen, onClose, onSuccess, customer }: CustomerFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debugMode, setDebugMode] = useState(false)
  
  // Populate form data when editing
  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        address: customer.address || ''
      })
    } else {
      // Reset form when adding new
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: ''
      })
    }
  }, [customer, isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      // Validate form
      if (!formData.name || !formData.email) {
        throw new Error('Name and email are required')
      }

      // Log the request to help with debugging
      console.log('Customer form submitted with data:', formData)

      if (customer?.id) {
        // Update existing customer - ensure ID is a valid number and handled properly
        const customerId = Number(customer.id); // More reliable than parseInt
        console.log(`Customer ID type: ${typeof customer.id}, value: ${customer.id}`);
        console.log(`Converted ID type: ${typeof customerId}, value: ${customerId}`);
        
        if (isNaN(customerId)) {
          throw new Error('Invalid customer ID')
        }
        
        console.log(`Attempting to update customer with ID: ${customerId}`)
        await customersApi.update(customerId, formData)
      } else {
        // Create new customer
        console.log('Creating new customer')
        await customersApi.create(formData)
      }
      
      // Reset form and close dialog
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: ''
      })
      onSuccess()
      onClose()
    } catch (err) {
      console.error('Error in CustomerForm submission:', err)
      
      // Check for specific API error types
      if (err && typeof err === 'object' && 'response' in err) {
        const apiError = err as any
        if (apiError.response && apiError.response.data) {
          setError(`API Error: ${apiError.response.data.error || 'Unknown server error'}`)
        } else if (apiError.message) {
          setError(apiError.message)
        } else {
          setError('Failed to connect to server. Please check your network connection.')
        }
      } else {
        setError(err instanceof Error ? err.message : 'An error occurred')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{customer ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
          <DialogDescription>
            {customer ? 'Update customer details below.' : 'Enter the customer details below.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter customer name"
            />
          </div>

          <div className="grid w-full items-center gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter customer email"
            />
          </div>

          <div className="grid w-full items-center gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter customer phone"
            />
          </div>

          <div className="grid w-full items-center gap-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter customer address"
            />
          </div>

          {error && (
            <div className="text-sm font-medium text-red-500">
              {error}
            </div>
          )}

          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <input 
              type="checkbox" 
              id="debugMode" 
              checked={debugMode}
              onChange={() => setDebugMode(!debugMode)}
            />
            <label htmlFor="debugMode">Debug Mode</label>
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (customer ? 'Saving...' : 'Adding...') : (customer ? 'Save Changes' : 'Add Customer')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CustomerForm 