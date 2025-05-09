import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
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
import { Search, PlusCircle, Package, ArrowUpDown, RefreshCcw, Pencil, Trash2, BarChart2, Filter } from "lucide-react"
import { Badge } from "../../components/ui/badge"
import { productsApi } from "../../lib/api"
import ProductForm from "../../components/ProductForm"
import StockForm from "../../components/StockForm"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog"
import { toast } from "../../components/ui/use-toast"

interface Product {
  id: number
  name: string
  sku: string
  category: string
  price: number
  stock_quantity: number
  status?: 'active' | 'inactive'
  created_at: string
}

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [editProductId, setEditProductId] = useState<number | null>(null)
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null)
  const [stockProduct, setStockProduct] = useState<{id: number, name: string, stock_quantity: number} | null>(null)
  const [error, setError] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showLowStockOnly, setShowLowStockOnly] = useState(searchParams.get('lowStock') === 'true')
  
  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      setError('')
      console.log('Products component: Fetching products data')
      const data = await productsApi.getAll()
      console.log('Products component: Products data received', data)
      
      // Verify that we received valid data
      if (!data || !Array.isArray(data)) {
        throw new Error('Invalid data format received from server')
      }
      
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
      setError('Failed to load products. Please try again.')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    console.log('Products component: useEffect running')
    fetchProducts()
    
    // Initialize showLowStockOnly from URL parameter
    const lowStockParam = searchParams.get('lowStock')
    if (lowStockParam === 'true') {
      setShowLowStockOnly(true)
    }
  }, [searchParams])

  // Filter products based on search term and low stock filter
  const filteredProducts = products.filter(product => {
    // First apply search filter
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Then apply low stock filter if enabled
    if (showLowStockOnly) {
      return matchesSearch && product.stock_quantity < 20;
    }
    
    return matchesSearch;
  });

  // Helper function to determine stock status badge
  const getStockStatusBadge = (product: Product) => {
    // First check if product is inactive
    if (product.status === 'inactive') {
      return <Badge variant="secondary">Inactive</Badge>
    }
    
    // Then check stock levels
    const stock = product.stock_quantity;
    if (stock <= 0) {
      return <Badge variant="destructive">Out of Stock</Badge>
    } else if (stock < 20) {
      return <Badge variant="outline">Low Stock</Badge>
    } else {
      return <Badge variant="outline">In Stock</Badge>
    }
  }

  const handleAddProduct = () => {
    setIsAddProductOpen(true)
  }
  
  const handleEditProduct = (productId: number) => {
    setEditProductId(productId)
  }
  
  const handleConfirmDelete = (productId: number) => {
    setDeleteProductId(productId)
  }
  
  const handleDeleteProduct = async () => {
    if (!deleteProductId) return
    
    setIsDeleting(true)
    try {
      await productsApi.delete(deleteProductId)
      toast({
        title: "Product deleted",
        description: "The product has been successfully deleted.",
      })
      fetchProducts()
    } catch (error: any) {
      console.error('Error deleting product:', error)
      
      // Check for specific error message about product being referenced in orders or inventory transactions
      const errorMessage = error?.response?.data?.error || error?.message || "Failed to delete product. Please try again.";
      const isConstraintError = error?.response?.data?.constraint || 
                               (error?.response?.data?.error && 
                               (error.response.data.error.includes("foreign key constraint") ||
                                error.response.data.error.includes("referenced in")));
      
      // If the product is referenced in orders or inventory, offer to set it as inactive
      if (isConstraintError) {
        // Set product as inactive instead
        try {
          await productsApi.updateStatus(deleteProductId, 'inactive');
          toast({
            title: "Product marked as inactive",
            description: "The product can't be deleted due to existing references, so it has been marked as inactive instead.",
          });
          fetchProducts();
        } catch (statusError: any) {
          console.error('Error setting product as inactive:', statusError);
          toast({
            title: "Error",
            description: "Failed to mark product as inactive. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        // Show regular error toast
        toast({
          title: "Cannot Delete Product",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setIsDeleting(false)
      setDeleteProductId(null)
    }
  }

  const handleProductAdded = () => {
    fetchProducts()
  }
  
  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchProducts()
  }

  // Format price with Rupee symbol
  const formatPrice = (price: number) => {
    return `₹${typeof price === 'number' ? price.toFixed(2) : '0.00'}`
  }

  const handleEditStock = (product: Product) => {
    setStockProduct({
      id: product.id,
      name: product.name,
      stock_quantity: product.stock_quantity
    })
  }

  // Toggle low stock filter
  const toggleLowStockFilter = () => {
    const newValue = !showLowStockOnly
    setShowLowStockOnly(newValue)
    
    // Update URL parameter
    if (newValue) {
      searchParams.set('lowStock', 'true')
    } else {
      searchParams.delete('lowStock')
    }
    setSearchParams(searchParams)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isLoading || isRefreshing}
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleAddProduct}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            {error && <div className="text-xs text-red-500 mt-1">Error loading data</div>}
          </CardContent>
        </Card>
        <Card className={`cursor-pointer transition-colors ${showLowStockOnly ? 'bg-amber-100 border-amber-600' : ''}`} onClick={toggleLowStockFilter}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Low Stock Items
            </CardTitle>
            <ArrowUpDown className={`h-4 w-4 ${showLowStockOnly ? 'text-amber-600' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${showLowStockOnly ? 'text-amber-700' : ''}`}>
              {products.filter(p => p.stock_quantity < 20).length}
            </div>
            <div className={`text-xs ${showLowStockOnly ? 'text-amber-900' : 'text-muted-foreground'} mt-1`}>
              {showLowStockOnly ? "Showing low stock items only" : "Click to show low stock items only"}
            </div>
            {error && <div className="text-xs text-red-500 mt-1">Error loading data</div>}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
          <CardDescription>
            Manage your product catalog and inventory
          </CardDescription>
          <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
            <div className="flex items-center">
              <Search className="h-4 w-4 mr-2 text-muted-foreground" />
              <Input 
                placeholder="Search products..." 
                className="max-w-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={showLowStockOnly ? "default" : "outline"}
                onClick={toggleLowStockFilter}
                className={`flex items-center gap-2 ${showLowStockOnly ? 'bg-amber-600 text-white hover:bg-amber-700' : ''}`}
              >
                <Filter className="h-4 w-4" />
                {showLowStockOnly ? (
                  <>Show All Products</>
                ) : (
                  <>Show Low Stock Only</>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center text-muted-foreground">Loading products...</div>
          ) : error ? (
            <div className="py-8 text-center">
              <div className="text-red-500 mb-4">{error}</div>
              <Button variant="outline" onClick={handleRefresh}>
                <RefreshCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">No products found</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow 
                      key={product.id}
                      className=""
                    >
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.sku}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{formatPrice(product.price)}</TableCell>
                      <TableCell>{product.stock_quantity}</TableCell>
                      <TableCell>{getStockStatusBadge(product)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handleEditStock(product)}
                            title="Update Stock"
                          >
                            <BarChart2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handleEditProduct(product.id)}
                            title="Edit Product"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleConfirmDelete(product.id)}
                            title="Delete Product"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Product Form */}
      <ProductForm 
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onSuccess={handleProductAdded}
      />
      
      {/* Edit Product Form */}
      {editProductId && (
        <ProductForm 
          isOpen={!!editProductId}
          onClose={() => setEditProductId(null)}
          onSuccess={handleProductAdded}
          productId={editProductId}
        />
      )}
      
      {/* Stock Edit Form */}
      <StockForm
        isOpen={!!stockProduct}
        onClose={() => setStockProduct(null)}
        onSuccess={handleProductAdded}
        product={stockProduct}
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteProductId} onOpenChange={(open) => !open && setDeleteProductId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteProduct}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default Products 