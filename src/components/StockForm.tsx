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
import { inventoryApi } from '../lib/api'
import { toast } from './ui/use-toast'

interface StockFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  product: {
    id: number
    name: string
    stock_quantity: number
  } | null
}

const StockForm = ({ isOpen, onClose, onSuccess, product }: StockFormProps) => {
  const [quantity, setQuantity] = useState<number>(0)
  const [adjustment, setAdjustment] = useState<'add' | 'set'>('add')
  const [notes, setNotes] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen && product) {
      setQuantity(0)
      setAdjustment('add')
      setNotes('')
      setError(null)
    }
  }, [isOpen, product])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return

    setError(null)
    setIsSubmitting(true)

    try {
      // Validation
      if (adjustment === 'add' && quantity === 0) {
        throw new Error('Quantity cannot be zero')
      }

      if (adjustment === 'set' && quantity < 0) {
        throw new Error('New quantity cannot be negative')
      }

      // Calculate the change in stock
      let changeAmount: number
      let transactionType: string
      
      if (adjustment === 'set') {
        // Calculate difference between current and new stock
        changeAmount = quantity - product.stock_quantity
        
        // If no change, show message and return
        if (changeAmount === 0) {
          toast({
            title: "No change",
            description: "Stock quantity remained the same.",
          })
          onClose()
          return
        }
        
        // Determine transaction type based on whether we're adding or removing
        transactionType = changeAmount > 0 ? 'purchase' : 'adjustment'
      } else {
        // Direct add/remove mode
        changeAmount = quantity
        transactionType = quantity > 0 ? 'purchase' : 'adjustment'
      }
      
      // Make sure we're not trying to remove more than available
      if (changeAmount < 0 && Math.abs(changeAmount) > product.stock_quantity) {
        throw new Error(`Cannot remove more than current stock (${product.stock_quantity})`)
      }

      // Create the inventory transaction
      await inventoryApi.createTransaction({
        product_id: product.id,
        transaction_type: transactionType,
        quantity: Math.abs(changeAmount),
        notes: notes || `Stock ${changeAmount > 0 ? 'increased' : 'decreased'} by ${Math.abs(changeAmount)}`
      })

      toast({
        title: "Stock updated",
        description: `${product.name} stock has been ${changeAmount > 0 ? 'increased' : 'decreased'} by ${Math.abs(changeAmount)}.`,
      })
      
      onSuccess()
      onClose()
    } catch (err) {
      console.error('Error updating stock:', err)
      setError(err instanceof Error ? err.message : 'Failed to update stock')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!product) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Stock</DialogTitle>
          <DialogDescription>
            Update stock quantity for {product.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">Current Stock:</span>
            </div>
            <div>
              <span className="text-lg">{product.stock_quantity}</span>
            </div>
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="adjustment">Adjustment Type</Label>
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="add"
                  name="adjustment"
                  value="add"
                  checked={adjustment === 'add'}
                  onChange={() => setAdjustment('add')}
                  className="mr-2"
                  title="Add or remove stock"
                />
                <Label htmlFor="add">Add/Remove</Label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="set"
                  name="adjustment"
                  value="set"
                  checked={adjustment === 'set'}
                  onChange={() => setAdjustment('set')}
                  className="mr-2"
                  title="Set exact stock value"
                />
                <Label htmlFor="set">Set Exact</Label>
              </div>
            </div>
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="quantity">
              {adjustment === 'add' ? 'Quantity to Add/Remove' : 'New Quantity'}
            </Label>
            <Input
              id="quantity"
              type="number"
              min={adjustment === 'set' ? "0" : "-999999"}
              step="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              required
            />
            {adjustment === 'add' && (
              <p className="text-xs text-muted-foreground">
                Use positive number to add stock or negative to remove
              </p>
            )}
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Reason for stock adjustment"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Stock'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default StockForm 