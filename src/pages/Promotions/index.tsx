import React, { useState, useEffect } from 'react'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { PlusCircle } from "lucide-react"
import { promotionsApi } from "../../lib/api"

// Define the Promotion type
interface Promotion {
  id: number
  name: string
  description: string
  discount_type: string
  discount_value: number
  min_purchase_amount: number | null
  start_date: string
  end_date: string
  is_active: boolean
}

const Promotions: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [promotions, setPromotions] = useState<Promotion[]>([])
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching promotions data...")
        setIsLoading(true)
        const data = await promotionsApi.getAll()
        console.log("Received promotions data:", data)
        setPromotions(data || [])
        setError('')
      } catch (err) {
        console.error("Error fetching promotions:", err)
        setError('Failed to load promotions')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Promotions</h2>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Promotion
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Promotion Management</CardTitle>
          <CardDescription>
            {isLoading ? 'Loading...' : error ? error : 'Manage your store promotions and discounts'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center">Loading promotions...</div>
          ) : error ? (
            <div className="py-8 text-center text-red-500">{error}</div>
          ) : promotions.length === 0 ? (
            <div className="py-8 text-center">No promotions found</div>
          ) : (
            <div className="py-8">
              <h3 className="text-center mb-4">Found {promotions.length} promotions</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {promotions.map(promotion => (
                  <Card key={promotion.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{promotion.name}</CardTitle>
                      <CardDescription>{promotion.description || 'No description'}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1 text-sm">
                        <div>
                          <span className="font-semibold">Discount:</span> {promotion.discount_type === 'percentage' 
                            ? `${promotion.discount_value}%` 
                            : `₹${promotion.discount_value}`}
                        </div>
                        <div>
                          <span className="font-semibold">Period:</span> {new Date(promotion.start_date).toLocaleDateString()} - {new Date(promotion.end_date).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-semibold">Status:</span> {promotion.is_active ? 'Active' : 'Inactive'}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Promotions 
