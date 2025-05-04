import { useState } from 'react'
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import SimplePromotionForm from '../../components/SimplePromotionForm'
import { Link } from 'react-router-dom'

const SimplePromotions = () => {
  const [isAddOpen, setIsAddOpen] = useState(false)
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Simple Promotions</h2>
        <Button onClick={() => setIsAddOpen(true)}>
          Add New
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Test Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is a simplified test card to check if the component renders.</p>
          <div className="mt-4">
            <Link to="/promotions" className="underline text-blue-500">
              Go to Regular Promotions Page
            </Link>
          </div>
        </CardContent>
      </Card>
      
      {isAddOpen && (
        <SimplePromotionForm 
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
        />
      )}
    </div>
  )
}

export default SimplePromotions 