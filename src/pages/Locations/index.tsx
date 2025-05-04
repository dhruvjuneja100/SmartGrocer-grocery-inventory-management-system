import { useState, useEffect } from 'react'
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
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Search, RefreshCcw, Store, MapPin, Phone, Mail } from "lucide-react"
import { storeLocationsApi } from "../../lib/api"

interface StoreLocation {
  id: number
  name: string
  address: string
  city: string
  state: string
  pincode: string
  phone: string
  email: string
  manager_id: number
  opening_hours: string
  is_active: boolean
}

const Locations = () => {
  const [locations, setLocations] = useState<StoreLocation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchLocations = async () => {
    try {
      setIsLoading(true)
      setError('')
      console.log('Locations component: Fetching store locations data')
      const data = await storeLocationsApi.getAll()
      console.log('Locations component: Store locations data received', data)
      
      if (!data || !Array.isArray(data)) {
        throw new Error('Invalid data format received from server')
      }
      
      setLocations(data)
    } catch (error) {
      console.error('Error fetching store locations:', error)
      setError('Failed to load store locations. Please try again.')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchLocations()
  }, [])

  // Filter locations based on search term
  const filteredLocations = locations.filter(location => 
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.pincode.includes(searchTerm)
  )

  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchLocations()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Store Locations</h2>
        <Button 
          variant="outline" 
          onClick={handleRefresh}
          disabled={isLoading || isRefreshing}
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Locations
            </CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{locations.length}</div>
            <p className="text-xs text-muted-foreground">
              Across {new Set(locations.map(loc => loc.city)).size} cities
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Stores
            </CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {locations.filter(loc => loc.is_active).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently operating stores
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Service Coverage
            </CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(locations.map(loc => loc.state)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              States covered by our stores
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Store Locations</CardTitle>
          <CardDescription>
            Manage your store locations across India
          </CardDescription>
          <div className="flex items-center mt-4">
            <Search className="h-4 w-4 mr-2 text-muted-foreground" />
            <Input 
              placeholder="Search stores by name, city or pincode..." 
              className="max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center text-muted-foreground">Loading store locations...</div>
          ) : error ? (
            <div className="py-8 text-center">
              <div className="text-red-500 mb-4">{error}</div>
              <Button variant="outline" onClick={handleRefresh}>
                <RefreshCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          ) : filteredLocations.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">No store locations found</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Store</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLocations.map((location) => (
                    <TableRow key={location.id}>
                      <TableCell className="font-medium">
                        {location.name}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{location.address}</span>
                          <span className="text-xs text-muted-foreground">{location.city}, {location.state}, {location.pincode}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="flex items-center"><Phone className="h-3 w-3 mr-1" /> {location.phone}</span>
                          <span className="flex items-center text-xs"><Mail className="h-3 w-3 mr-1" /> {location.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>{location.opening_hours}</TableCell>
                      <TableCell>
                        {location.is_active 
                          ? <Badge variant="default">Active</Badge>
                          : <Badge variant="outline">Inactive</Badge>
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Locations 