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
import { suppliersApi } from '../lib/api'

interface Supplier {
  id: number
  name: string
  contact_person: string
  email: string
  phone: string
  address: string
}

interface SupplierFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  supplier?: Supplier // Optional supplier for editing
}

const SupplierForm = ({ isOpen, onClose, onSuccess, supplier }: SupplierFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    contact_person: '',
    email: '',
    phone: '',
    address: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Populate form data when editing
  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name || '',
        contact_person: supplier.contact_person || '',
        email: supplier.email || '',
        phone: supplier.phone || '',
        address: supplier.address || ''
      })
    } else {
      // Reset form when adding new
      setFormData({
        name: '',
        contact_person: '',
        email: '',
        phone: '',
        address: ''
      })
    }
  }, [supplier, isOpen])

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
        throw new Error('Company name and email are required')
      }

      if (supplier?.id) {
        // Update existing supplier
        await suppliersApi.update(supplier.id, formData)
      } else {
        // Create new supplier
        await suppliersApi.create(formData)
      }
      
      // Reset form and close dialog
      setFormData({
        name: '',
        contact_person: '',
        email: '',
        phone: '',
        address: ''
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
          <DialogTitle>{supplier ? 'Edit Supplier' : 'Add New Supplier'}</DialogTitle>
          <DialogDescription>
            {supplier ? 'Update supplier details below.' : 'Enter the supplier details below.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="name">Company Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter supplier company name"
            />
          </div>

          <div className="grid w-full items-center gap-2">
            <Label htmlFor="contact_person">Contact Person</Label>
            <Input
              id="contact_person"
              name="contact_person"
              value={formData.contact_person}
              onChange={handleChange}
              placeholder="Enter contact person name"
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
              placeholder="Enter supplier email"
            />
          </div>

          <div className="grid w-full items-center gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter supplier phone"
            />
          </div>

          <div className="grid w-full items-center gap-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter supplier address"
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
              {isSubmitting ? (supplier ? 'Saving...' : 'Adding...') : (supplier ? 'Save Changes' : 'Add Supplier')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default SupplierForm 