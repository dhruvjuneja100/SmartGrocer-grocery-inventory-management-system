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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { productsApi } from '../lib/api'

interface ProductFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  productId?: number // Optional - if provided, we're editing an existing product
}

const ProductForm = ({ isOpen, onClose, onSuccess, productId }: ProductFormProps) => {
  const [productData, setProductData] = useState({
    name: '',
    sku: '',
    category: '',
    price: '',
    stock_quantity: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  // Determine if we're editing or creating
  const isEditMode = !!productId

  // Load product data if in edit mode
  useEffect(() => {
    if (isOpen && isEditMode && productId) {
      const fetchProductData = async () => {
        setIsLoading(true)
        setError(null)
        try {
          const product = await productsApi.getById(productId)
          if (product) {
            setProductData({
              name: product.name || '',
              sku: product.sku || '',
              category: product.category || '',
              price: product.price?.toString() || '',
              stock_quantity: product.stock_quantity?.toString() || ''
            })
          } else {
            setError('Product not found')
          }
        } catch (err) {
          console.error('Error loading product:', err)
          setError('Failed to load product data')
        } finally {
          setIsLoading(false)
        }
      }
      
      fetchProductData()
    }
  }, [isOpen, isEditMode, productId])
  
  // Reset form when dialog opens or closes
  useEffect(() => {
    if (!isOpen && !isEditMode) {
      setProductData({
        name: '',
        sku: '',
        category: '',
        price: '',
        stock_quantity: ''
      })
      setError(null)
    }
  }, [isOpen, isEditMode])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProductData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setProductData(prev => ({ ...prev, category: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      // Validate data
      if (!productData.name || !productData.sku || !productData.category) {
        throw new Error('Please fill in all required fields')
      }

      // Convert to appropriate types
      const numericPrice = Number(productData.price)
      const numericStock = Number(productData.stock_quantity)

      if (isNaN(numericPrice) || numericPrice <= 0) {
        throw new Error('Price must be a positive number')
      }

      if (isNaN(numericStock) || numericStock < 0 || !Number.isInteger(numericStock)) {
        throw new Error('Stock quantity must be a non-negative integer')
      }

      const formattedData = {
        ...productData,
        price: numericPrice,
        stock_quantity: numericStock
      }

      // Either update or create depending on mode
      if (isEditMode && productId) {
        await productsApi.update(productId, formattedData)
      } else {
        await productsApi.create(formattedData)
      }

      // Reset form if not editing
      if (!isEditMode) {
        setProductData({
          name: '',
          sku: '',
          category: '',
          price: '',
          stock_quantity: ''
        })
      }

      // Close dialog and refresh products
      onSuccess()
      onClose()
    } catch (err) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} product:`, err)
      setError(err instanceof Error ? err.message : `Failed to ${isEditMode ? 'update' : 'create'} product`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? 'Update the details of the existing product.' 
              : 'Enter the details of the new product below.'}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="py-6 text-center">Loading product data...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            {error && (
              <div className="text-red-500 text-sm">
                {error}
              </div>
            )}

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="name">Product Name <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                name="name"
                value={productData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="sku">SKU <span className="text-red-500">*</span></Label>
              <Input
                id="sku"
                name="sku"
                value={productData.sku}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
              <Select 
                value={productData.category} 
                onValueChange={handleSelectChange}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dairy">Dairy</SelectItem>
                  <SelectItem value="Bakery">Bakery</SelectItem>
                  <SelectItem value="Fruits & Vegetables">Fruits & Vegetables</SelectItem>
                  <SelectItem value="Meat & Poultry">Meat & Poultry</SelectItem>
                  <SelectItem value="Beverages">Beverages</SelectItem>
                  <SelectItem value="Snacks & Sweets">Snacks & Sweets</SelectItem>
                  <SelectItem value="Household">Household</SelectItem>
                  <SelectItem value="Personal Care">Personal Care</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="price">Price (₹) <span className="text-red-500">*</span></Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0.01"
                step="0.01"
                value={productData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="stock_quantity">Stock Quantity <span className="text-red-500">*</span></Label>
              <Input
                id="stock_quantity"
                name="stock_quantity"
                type="number"
                min="0"
                step="1"
                value={productData.stock_quantity}
                onChange={handleChange}
                required
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Update Product' : 'Add Product')}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ProductForm 