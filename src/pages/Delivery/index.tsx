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
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"
import { Search, RefreshCcw, MapPin, Truck, Box, Timer } from "lucide-react"
import { deliveryApi } from "../../lib/api"

interface DeliveryAssignment {
  id: number
  order_id: number
  vehicle_id: number
  employee_id: number
  delivery_zone_id: number
  scheduled_date: string
  delivery_status: 'pending' | 'in_transit' | 'delivered' | 'failed' | 'returned'
  actual_delivery_time: string | null
  customer_name: string
  zone_name: string
  vehicle_number: string
  vehicle_type: string
}

interface DeliveryZone {
  id: number
  name: string
  city: string
  pincode_range: string
  delivery_charge: number
  min_order_free_delivery: number | null
  estimated_delivery_time: string
  is_active: boolean
}

interface DeliveryVehicle {
  id: number
  vehicle_number: string
  vehicle_type: string
  model: string
  driver_name: string
  driver_phone: string
  status: 'available' | 'on_delivery' | 'maintenance' | 'inactive'
}

const Delivery = () => {
  const [assignments, setAssignments] = useState<DeliveryAssignment[]>([])
  const [zones, setZones] = useState<DeliveryZone[]>([])
  const [vehicles, setVehicles] = useState<DeliveryVehicle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState<'assignments' | 'zones' | 'vehicles'>('assignments')

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError('')

      const [assignmentsData, zonesData, vehiclesData] = await Promise.all([
        deliveryApi.getAssignments(),
        deliveryApi.getZones(),
        deliveryApi.getVehicles()
      ])
      
      if (Array.isArray(assignmentsData)) setAssignments(assignmentsData)
      if (Array.isArray(zonesData)) setZones(zonesData)
      if (Array.isArray(vehiclesData)) setVehicles(vehiclesData)
    } catch (error) {
      console.error('Error fetching delivery data:', error)
      setError('Failed to load delivery data. Please try again.')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Filter based on search term
  const filteredAssignments = assignments.filter(assignment => 
    assignment.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.zone_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.vehicle_number?.includes(searchTerm) ||
    assignment.delivery_status?.includes(searchTerm)
  )

  const filteredZones = zones.filter(zone => 
    zone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    zone.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    zone.pincode_range.includes(searchTerm)
  )

  const filteredVehicles = vehicles.filter(vehicle => 
    vehicle.vehicle_number.includes(searchTerm) ||
    vehicle.driver_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.vehicle_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.status?.includes(searchTerm)
  )

  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchData()
  }

  // Helper to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>
      case 'in_transit':
        return <Badge variant="default">In Transit</Badge>
      case 'delivered':
        return <Badge variant="success">Delivered</Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
      case 'returned':
        return <Badge variant="warning">Returned</Badge>
      case 'available':
        return <Badge variant="success">Available</Badge>
      case 'on_delivery':
        return <Badge variant="default">On Delivery</Badge>
      case 'maintenance':
        return <Badge variant="warning">Maintenance</Badge>
      case 'inactive':
        return <Badge variant="outline">Inactive</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not available'
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date)
    } catch (e) {
      return 'Invalid date'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Delivery Management</h2>
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
              Active Deliveries
            </CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assignments.filter(a => a.delivery_status === 'in_transit').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently in transit
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Delivery Zones
            </CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{zones.length}</div>
            <p className="text-xs text-muted-foreground">
              Active service areas
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Vehicles
            </CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vehicles.filter(v => v.status === 'available').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Out of {vehicles.length} total vehicles
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between flex-wrap gap-4">
            <div>
              <CardTitle>Delivery Management</CardTitle>
              <CardDescription>
                Track and manage deliveries, zones, and vehicles
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                variant={activeTab === 'assignments' ? 'default' : 'outline'} 
                onClick={() => setActiveTab('assignments')}
              >
                <Box className="h-4 w-4 mr-2" />
                Assignments
              </Button>
              <Button 
                variant={activeTab === 'zones' ? 'default' : 'outline'} 
                onClick={() => setActiveTab('zones')}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Zones
              </Button>
              <Button 
                variant={activeTab === 'vehicles' ? 'default' : 'outline'} 
                onClick={() => setActiveTab('vehicles')}
              >
                <Truck className="h-4 w-4 mr-2" />
                Vehicles
              </Button>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <Search className="h-4 w-4 mr-2 text-muted-foreground" />
            <Input 
              placeholder="Search..." 
              className="max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center text-muted-foreground">Loading data...</div>
          ) : error ? (
            <div className="py-8 text-center">
              <div className="text-red-500 mb-4">{error}</div>
              <Button variant="outline" onClick={handleRefresh}>
                <RefreshCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {activeTab === 'assignments' && (
                filteredAssignments.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">No deliveries found</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Zone</TableHead>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>Scheduled</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAssignments.map((assignment) => (
                        <TableRow key={assignment.id}>
                          <TableCell className="font-medium">#{assignment.order_id}</TableCell>
                          <TableCell>{assignment.customer_name}</TableCell>
                          <TableCell>{assignment.zone_name}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{assignment.vehicle_number}</span>
                              <span className="text-xs text-muted-foreground">{assignment.vehicle_type}</span>
                            </div>
                          </TableCell>
                          <TableCell>{formatDate(assignment.scheduled_date)}</TableCell>
                          <TableCell>{getStatusBadge(assignment.delivery_status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )
              )}
              
              {activeTab === 'zones' && (
                filteredZones.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">No zones found</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Zone Name</TableHead>
                        <TableHead>City</TableHead>
                        <TableHead>Pincode Range</TableHead>
                        <TableHead>Delivery Charge</TableHead>
                        <TableHead>Est. Time</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredZones.map((zone) => (
                        <TableRow key={zone.id}>
                          <TableCell className="font-medium">{zone.name}</TableCell>
                          <TableCell>{zone.city}</TableCell>
                          <TableCell>{zone.pincode_range}</TableCell>
                          <TableCell>
                            ₹{zone.delivery_charge.toFixed(2)}
                            {zone.min_order_free_delivery && (
                              <div className="text-xs text-muted-foreground">
                                Free above ₹{zone.min_order_free_delivery.toFixed(2)}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Timer className="h-3 w-3 mr-1" />
                              {zone.estimated_delivery_time}
                            </div>
                          </TableCell>
                          <TableCell>
                            {zone.is_active 
                              ? <Badge variant="default">Active</Badge>
                              : <Badge variant="outline">Inactive</Badge>
                            }
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )
              )}
              
              {activeTab === 'vehicles' && (
                filteredVehicles.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">No vehicles found</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vehicle Number</TableHead>
                        <TableHead>Type & Model</TableHead>
                        <TableHead>Driver</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredVehicles.map((vehicle) => (
                        <TableRow key={vehicle.id}>
                          <TableCell className="font-medium">{vehicle.vehicle_number}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="capitalize">{vehicle.vehicle_type}</span>
                              <span className="text-xs text-muted-foreground">{vehicle.model}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{vehicle.driver_name}</span>
                              <span className="text-xs text-muted-foreground">{vehicle.driver_phone}</span>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Delivery 