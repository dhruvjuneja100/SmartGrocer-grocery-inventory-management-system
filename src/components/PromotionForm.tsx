import { useState } from 'react'
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
  SelectValue 
} from './ui/select'
import { Textarea } from './ui/textarea'
import { Switch } from './ui/switch'
import { promotionsApi, productsApi } from '../lib/api'
import { CheckCircle2 } from 'lucide-react'

interface PromotionFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  promotionId?: number // For editing existing promotions
}

const PromotionForm = ({ isOpen, onClose, onSuccess, promotionId }: PromotionFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    discount_type: 'percentage',
    discount_value: '',
    min_purchase_amount: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    is_active: true
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedProducts, setSelectedProducts] = useState<number[]>([])
  const [productOptions, setProductOptions] = useState<{id: number, name: string}[]>([])
  const [currentStep, setCurrentStep] = useState(1)
  const [isAddingProducts, setIsAddingProducts] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }))
  }

  const handleAddProducts = async () => {
    setIsAddingProducts(true)
    
    try {
      // Load products if not already loaded
      if (productOptions.length === 0) {
        const products = await productsApi.getAll()
        setProductOptions(products.map((p: any) => ({ id: p.id, name: p.name })))
      }
      
      setCurrentStep(2) // Move to product selection
    } catch (error) {
      console.error('Error fetching products:', error)
      setError('Failed to load products. Please try again.')
    } finally {
      setIsAddingProducts(false)
    }
  }

  const handleProductSelect = (productId: number) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId)
      } else {
        return [...prev, productId]
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      // Validate form
      if (!formData.name || !formData.discount_type || !formData.discount_value) {
        throw new Error('Name, discount type and discount value are required')
      }

      if (!formData.start_date || !formData.end_date) {
        throw new Error('Start and end dates are required')
      }

      // Convert to appropriate types
      const promotionData = {
        ...formData,
        discount_value: parseFloat(formData.discount_value),
        min_purchase_amount: formData.min_purchase_amount ? parseFloat(formData.min_purchase_amount) : null
      }

      // Submit to API
      const savedPromotion = await promotionsApi.create(promotionData)
      
      // Add selected products to the promotion if any
      if (selectedProducts.length > 0 && savedPromotion && savedPromotion.id) {
        await Promise.all(
          selectedProducts.map(productId => promotionsApi.addProduct(savedPromotion.id, productId))
        )
      }
      
      // Reset form and close dialog
      setFormData({
        name: '',
        description: '',
        discount_type: 'percentage',
        discount_value: '',
        min_purchase_amount: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        is_active: true
      })
      setSelectedProducts([])
      setCurrentStep(1)
      onSuccess()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Helper to get heading and description based on current step
  const getStepContent = () => {
    if (currentStep === 1) {
      return {
        title: 'Add New Promotion',
        description: 'Enter the details of the new promotion below.'
      }
    } else {
      return {
        title: 'Select Products',
        description: 'Choose which products this promotion applies to.'
      }
    }
  }

  const { title, description } = getStepContent()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>

        {currentStep === 1 ? (
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            {error && (
              <div className="text-sm font-medium text-red-500">
                {error}
              </div>
            )}

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="name">Promotion Name <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            <div className="grid w-full grid-cols-2 gap-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="discount_type">Discount Type <span className="text-red-500">*</span></Label>
                <Select 
                  value={formData.discount_type} 
                  onValueChange={(value) => handleSelectChange('discount_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select discount type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                    <SelectItem value="buy_x_get_y">Buy One Get One</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="discount_value">
                  {formData.discount_type === 'percentage' ? 'Percentage (%)' : 
                   formData.discount_type === 'fixed_amount' ? 'Amount (₹)' : 
                   'Value'} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="discount_value"
                  name="discount_value"
                  type="number"
                  min="0"
                  step={formData.discount_type === 'percentage' ? '1' : '0.01'}
                  value={formData.discount_value}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="min_purchase_amount">Minimum Purchase Amount (₹)</Label>
              <Input
                id="min_purchase_amount"
                name="min_purchase_amount"
                type="number"
                min="0"
                step="0.01"
                value={formData.min_purchase_amount}
                onChange={handleInputChange}
                placeholder="0.00"
              />
              <p className="text-xs text-muted-foreground">Leave empty if no minimum purchase required</p>
            </div>

            <div className="grid w-full grid-cols-2 gap-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="start_date">Start Date <span className="text-red-500">*</span></Label>
                <Input
                  id="start_date"
                  name="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="end_date">End Date <span className="text-red-500">*</span></Label>
                <Input
                  id="end_date"
                  name="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch 
                id="is_active" 
                checked={formData.is_active} 
                onCheckedChange={(checked) => handleSwitchChange('is_active', checked)} 
              />
              <Label htmlFor="is_active">Active</Label>
            </div>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => handleAddProducts()} disabled={isSubmitting || isAddingProducts}>
                {isAddingProducts ? 'Loading Products...' : 'Add Products'}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Promotion'}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-4 py-4">
            {error && (
              <div className="text-sm font-medium text-red-500">
                {error}
              </div>
            )}
            
            <div className="max-h-[300px] overflow-y-auto border rounded-md p-2">
              {productOptions.length === 0 ? (
                <div className="py-4 text-center text-muted-foreground">No products found</div>
              ) : (
                <div className="space-y-2">
                  {productOptions.map(product => (
                    <div 
                      key={product.id} 
                      className={`p-2 rounded flex items-center justify-between cursor-pointer ${
                        selectedProducts.includes(product.id) ? 'bg-primary/10' : 'hover:bg-secondary/50'
                      }`}
                      onClick={() => handleProductSelect(product.id)}
                    >
                      <span>{product.name}</span>
                      {selectedProducts.includes(product.id) && (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setCurrentStep(1)}>
                Back
              </Button>
              <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Promotion'}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default PromotionForm 