import { Link } from 'react-router-dom'
import { 
  LayoutDashboard, 
  ShoppingCart, 
  PackageOpen, 
  Users, 
  Truck, 
  UserCircle, 
  BarChart, 
  Settings 
} from 'lucide-react'

const Sidebar = () => {
  const menuItems = [
    { icon: <LayoutDashboard className="h-5 w-5" />, label: 'Dashboard', path: '/' },
    { icon: <ShoppingCart className="h-5 w-5" />, label: 'Orders', path: '/orders' },
    { icon: <PackageOpen className="h-5 w-5" />, label: 'Products', path: '/products' },
    { icon: <Users className="h-5 w-5" />, label: 'Customers', path: '/customers' },
    { icon: <Truck className="h-5 w-5" />, label: 'Suppliers', path: '/suppliers' },
    { icon: <UserCircle className="h-5 w-5" />, label: 'Employees', path: '/employees' },
    { icon: <BarChart className="h-5 w-5" />, label: 'Reports', path: '/reports' },
    { icon: <Settings className="h-5 w-5" />, label: 'Settings', path: '/settings' },
  ]

  return (
    <div className="w-64 h-screen bg-card border-r">
      <div className="flex items-center justify-center h-16 border-b">
        <h1 className="text-xl font-bold">SmartGrocer</h1>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className="flex items-center gap-3 p-3 rounded-md hover:bg-accent transition-colors"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar 