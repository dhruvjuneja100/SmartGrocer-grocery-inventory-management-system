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
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from './ui/table'
import { X, Plus, Printer, CheckCircle, UserPlus } from 'lucide-react'
import { customersApi, productsApi, ordersApi, employeesApi } from '../lib/api'
import CustomerForm from './CustomerForm'
import axios from 'axios'

interface Customer {
  id: number
  name: string
}

interface Employee {
  id: number
  name: string
}

interface Product {
  id: number
  name: string
  sku: string
  category: string
  price: number
  stock_quantity: number
}

interface CartItem {
  product: Product
  quantity: number
}

interface PurchaseFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const PurchaseForm = ({ isOpen, onClose, onSuccess }: PurchaseFormProps) => {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [currentProduct, setCurrentProduct] = useState<string>('')
  const [currentQuantity, setCurrentQuantity] = useState<number>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [customerOption, setCustomerOption] = useState<'existing' | 'new' | 'nil'>('nil')
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false)
  const [formData, setFormData] = useState({
    customer_id: '',
    employee_id: '',
    payment_method: 'cash',
    notes: ''
  })

  // Calculate total
  const totalAmount = cart.reduce((total, item) => 
    total + (item.product.price * item.quantity), 0)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const [customersData, productsData, employeesData] = await Promise.all([
        customersApi.getAll(),
        productsApi.getAll(),
        employeesApi.getAll()
      ])
      setCustomers(customersData)
      setProducts(productsData)
      setEmployees(employeesData)
    } catch (error) {
      console.error('Error fetching data:', error)
      setError('Failed to load required data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchData()
    }
  }, [isOpen])

  const handleReset = () => {
    setCart([])
    setCurrentProduct('')
    setCurrentQuantity(1)
    setCustomerOption('nil')
    setFormData({
      customer_id: '',
      employee_id: '',
      payment_method: 'cash',
      notes: ''
    })
    setError(null)
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCustomerOption = (value: 'existing' | 'new' | 'nil') => {
    setCustomerOption(value)
    // Reset customer_id when switching options
    if (value !== 'existing') {
      setFormData(prev => ({ ...prev, customer_id: '' }))
    }
  }
  
  const handleNewCustomer = async () => {
    setIsAddCustomerOpen(true)
  }

  const handleCustomerAdded = async (customerId: number) => {
    // Refresh the customer list
    try {
      const customersData = await customersApi.getAll()
      setCustomers(customersData)
      
      // Set the new customer as selected
      setFormData(prev => ({ ...prev, customer_id: customerId.toString() }))
      setCustomerOption('existing')
    } catch (error) {
      console.error('Error refreshing customers:', error)
    }
  }

  const handleAddToCart = () => {
    if (!currentProduct) {
      setError('Please select a product')
      return
    }

    if (currentQuantity <= 0) {
      setError('Quantity must be greater than 0')
      return
    }

    const selectedProduct = products.find(p => p.id.toString() === currentProduct)
    
    if (!selectedProduct) {
      setError('Selected product not found')
      return
    }

    if (selectedProduct.stock_quantity < currentQuantity) {
      setError(`Only ${selectedProduct.stock_quantity} units available in stock`)
      return
    }

    // Check if product already in cart
    const existingItem = cart.find(item => item.product.id === selectedProduct.id)
    
    if (existingItem) {
      // Update quantity if already in cart
      setCart(cart.map(item => 
        item.product.id === selectedProduct.id 
          ? { ...item, quantity: item.quantity + currentQuantity }
          : item
      ))
    } else {
      // Add new item to cart
      setCart([...cart, { product: selectedProduct, quantity: currentQuantity }])
    }

    // Reset product selection and quantity
    setCurrentProduct('')
    setCurrentQuantity(1)
    setError(null)
  }

  const handleRemoveFromCart = (productId: number) => {
    setCart(cart.filter(item => item.product.id !== productId))
  }

  const handlePrintBill = () => {
    const printWindow = window.open('', '_blank')
    
    if (!printWindow) {
      setError('Unable to open print window. Please check your browser settings.')
      return
    }

    const selectedCustomer = customers.find(c => c.id.toString() === formData.customer_id)
    const selectedEmployee = employees.find(e => e.id.toString() === formData.employee_id)
    const date = new Date().toLocaleString()
    
    // Customer display based on option selected
    let customerDisplay = 'Walk-in Customer'
    if (customerOption === 'existing' && selectedCustomer) {
      customerDisplay = selectedCustomer.name
    }

    let billContent = `
      <html>
      <head>
        <title>Purchase Receipt - SmartGrocer</title>
        <style>
          body { font-family: 'Arial', sans-serif; margin: 0; padding: 20px; }
          .receipt { max-width: 80mm; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 20px; }
          .logo { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
          .info { margin-bottom: 20px; }
          .info div { margin-bottom: 5px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { text-align: left; padding: 8px 4px; }
          th { border-bottom: 1px solid #ddd; }
          .total { font-weight: bold; text-align: right; margin-top: 10px; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <div class="logo">SmartGrocer</div>
            <div>Grocery Inventory System</div>
          </div>
          
          <div class="info">
            <div><strong>Date:</strong> ${date}</div>
            <div><strong>Customer:</strong> ${customerDisplay}</div>
            <div><strong>Served by:</strong> ${selectedEmployee?.name || 'Staff'}</div>
            <div><strong>Payment Method:</strong> ${formData.payment_method.toUpperCase()}</div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
    `

    cart.forEach(item => {
      billContent += `
        <tr>
          <td>${item.product.name}</td>
          <td>${item.quantity}</td>
          <td>₹${item.product.price.toFixed(2)}</td>
          <td>₹${(item.product.price * item.quantity).toFixed(2)}</td>
        </tr>
      `
    })

    billContent += `
            </tbody>
          </table>
          
          <div class="total">
            <div>Total Amount: ₹${totalAmount.toFixed(2)}</div>
          </div>
          
          <div class="footer">
            <p>Thank you for shopping with us!</p>
            <p>For returns or exchanges, please present this receipt.</p>
          </div>
        </div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `

    printWindow.document.open()
    printWindow.document.write(billContent)
    printWindow.document.close()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)
    setIsSubmitting(true)

    try {
      // Validate form
      if (cart.length === 0) {
        throw new Error('Cart is empty. Please add products to purchase.')
      }

      // Validate customer selection if customer option is 'existing'
      if (customerOption === 'existing' && !formData.customer_id) {
        throw new Error('Please select a customer or choose "No Customer" option')
      }

      // Check stock availability once more before submission
      for (const item of cart) {
        if (item.quantity > item.product.stock_quantity) {
          throw new Error(`Not enough stock for ${item.product.name}. Only ${item.product.stock_quantity} available.`)
        }
      }

      // Create order with customer_id only if an existing customer is selected
      const orderData = {
        customer_id: customerOption === 'existing' ? parseInt(formData.customer_id) : null,
        employee_id: formData.employee_id ? parseInt(formData.employee_id) : null,
        total_amount: totalAmount,
        status: 'completed',
        payment_method: formData.payment_method,
        notes: formData.notes
      }

      // Submit order to API using direct axios call
      console.log('Creating order with data:', JSON.stringify(orderData));
      try {
        const orderResponse = await axios.post('http://localhost:5001/api/orders', orderData);
        const order = orderResponse.data.data;
        console.log('Order created successfully:', JSON.stringify(order));

        // Create order items and update inventory
        if (order?.id) {
          let allItemsCreated = true;
          const failedItems = [];

          // Process items one by one with separate try-catch for each
          for (const item of cart) {
            try {
              // Explicitly format the data with proper number types
              const orderItemData = {
                order_id: Number(order.id),
                product_id: Number(item.product.id),
                quantity: Number(item.quantity),
                unit_price: Number(item.product.price)
              };
              
              console.log('Processing order item:', JSON.stringify(orderItemData));
              
              // Use direct axios call to create the item
              const response = await axios.post('http://localhost:5001/api/order-items', orderItemData);
              console.log('Order item created:', response.data);
            } catch (itemError: any) {
              console.error('Failed to create order item:', itemError);
              if (itemError.response) {
                console.error('Response error:', itemError.response.status, itemError.response.data);
              }
              allItemsCreated = false;
              failedItems.push(item.product.name);
            }
          }

          if (allItemsCreated) {
            // Show success message
            setSuccessMessage(`Purchase completed successfully! Order #${order.id}`)
            
            // Refresh product data to get updated stock counts
            await fetchData()
            
            // Delay closing the dialog to show the success message
            setTimeout(() => {
              handleReset()
              onSuccess()
              onClose()
            }, 1500)
          } else {
            // Some items failed to be created
            setError(`Failed to create some order items: ${failedItems.join(', ')}. The order has been created but inventory may not be updated correctly.`)
          }
        } else {
          throw new Error('Failed to create order')
        }
      } catch (orderError: any) {
        console.error('Order creation error:', orderError);
        if (orderError.response) {
          console.error('Response status:', orderError.response.status);
          console.error('Response data:', orderError.response.data);
          
          if (orderError.response.data && orderError.response.data.error) {
            throw new Error(`Server error: ${orderError.response.data.error}`);
          }
        }
        throw orderError;
      }
    } catch (err: any) {
      console.error('Purchase form error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatPrice = (price: number) => {
    return `₹${price.toFixed(2)}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>New Purchase</DialogTitle>
          <DialogDescription>
            Create a new purchase, update inventory, and generate bill
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Customer & Purchase Info */}
            <div className="space-y-5">
              <div>
                <Label className="text-sm font-medium mb-1.5 block">Customer Option</Label>
                <div className="flex space-x-2">
                  <Button 
                    type="button" 
                    variant={customerOption === 'existing' ? "default" : "outline"}
                    onClick={() => handleCustomerOption('existing')}
                    className="flex-1"
                  >
                    Existing Customer
                  </Button>
                  <Button 
                    type="button" 
                    variant={customerOption === 'new' ? "default" : "outline"}
                    onClick={handleNewCustomer}
                    className="flex-1"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    New Customer
                  </Button>
                  <Button 
                    type="button" 
                    variant={customerOption === 'nil' ? "default" : "outline"}
                    onClick={() => handleCustomerOption('nil')}
                    className="flex-1"
                  >
                    No Customer
                  </Button>
                </div>
              </div>

              {customerOption === 'existing' && (
                <div>
                  <Label htmlFor="customer_id" className="text-sm font-medium mb-1.5 block">Select Customer</Label>
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
              )}

              <div>
                <Label htmlFor="employee_id" className="text-sm font-medium mb-1.5 block">Employee</Label>
                <Select 
                  name="employee_id"
                  value={formData.employee_id} 
                  onValueChange={(value) => handleSelectChange('employee_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoading ? (
                      <SelectItem value="loading" disabled>Loading employees...</SelectItem>
                    ) : employees.length === 0 ? (
                      <SelectItem value="none" disabled>No employees found</SelectItem>
                    ) : (
                      employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id.toString()}>
                          {employee.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="payment_method" className="text-sm font-medium mb-1.5 block">Payment Method</Label>
                <Select 
                  name="payment_method"
                  value={formData.payment_method} 
                  onValueChange={(value) => handleSelectChange('payment_method', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="debit_card">Debit Card</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes" className="text-sm font-medium mb-1.5 block">Notes</Label>
                <Input
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Additional notes (optional)"
                />
              </div>
            </div>

            {/* Right Column: Product Selection & Cart */}
            <div className="space-y-5">
              <div>
                <div className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-6">
                    <Label htmlFor="product_id" className="text-sm font-medium mb-1.5 block">Add Product</Label>
                    <Select 
                      name="product_id"
                      value={currentProduct} 
                      onValueChange={setCurrentProduct}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoading ? (
                          <SelectItem value="loading" disabled>Loading products...</SelectItem>
                        ) : products.length === 0 ? (
                          <SelectItem value="none" disabled>No products found</SelectItem>
                        ) : (
                          products.map((product) => (
                            <SelectItem key={product.id} value={product.id.toString()}>
                              {product.name} ({formatPrice(product.price)})
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-3">
                    <Label htmlFor="quantity" className="text-sm font-medium mb-1.5 block">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={currentQuantity}
                      onChange={(e) => setCurrentQuantity(parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div className="col-span-3">
                    <Button 
                      type="button" 
                      onClick={handleAddToCart}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>
                </div>
              </div>

              <Card className="mt-1">
                <CardContent className="p-4">
                  <div className="font-medium mb-3">Shopping Cart</div>
                  {cart.length === 0 ? (
                    <div className="text-sm text-muted-foreground py-6 text-center">
                      No items in cart. Add products to proceed.
                    </div>
                  ) : (
                    <div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Qty</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {cart.map((item) => (
                            <TableRow key={item.product.id}>
                              <TableCell className="font-medium">{item.product.name}</TableCell>
                              <TableCell>{formatPrice(item.product.price)}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>{formatPrice(item.product.price * item.quantity)}</TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveFromCart(item.product.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <div className="flex justify-between items-center mt-4">
                        <Badge className="text-lg" variant="outline">
                          Total: {formatPrice(totalAmount)}
                        </Badge>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={handlePrintBill}
                          disabled={cart.length === 0}
                        >
                          <Printer className="h-4 w-4 mr-2" /> Print Bill
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {error && (
            <div className="text-sm font-medium text-red-500 mt-2">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="flex items-center gap-2 text-sm font-medium text-green-500 mt-2">
              <CheckCircle className="h-4 w-4" />
              {successMessage}
            </div>
          )}

          <DialogFooter className="mt-6">
            <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || cart.length === 0}>
              {isSubmitting ? 'Processing...' : 'Complete Purchase'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
      
      {/* New Customer Form */}
      <CustomerForm
        isOpen={isAddCustomerOpen}
        onClose={() => setIsAddCustomerOpen(false)}
        onSuccess={handleCustomerAdded}
      />
    </Dialog>
  )
}

export default PurchaseForm 