import { Link, useLocation, Outlet } from "react-router-dom"
import { cn } from "../lib/utils"
import {
  BarChart3,
  PackageIcon,
  ShoppingCart,
  Users,
  Truck,
  UserRound,
  FileBarChart,
  Settings,
  Menu,
  Sun,
  Moon,
  LogOut,
  Tag,
  MapPin,
  Store,
  Star,
  MessageSquare,
  Layers
} from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { ThemeToggle } from "./ThemeToggle"
import { useAuth } from "./AuthProvider"

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    title: "Products",
    href: "/products",
    icon: <PackageIcon className="h-5 w-5" />,
  },
  {
    title: "Inventory",
    href: "/inventory",
    icon: <Layers className="h-5 w-5" />,
  },
  {
    title: "Orders",
    href: "/orders",
    icon: <ShoppingCart className="h-5 w-5" />,
  },
  {
    title: "Customers",
    href: "/customers",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Suppliers",
    href: "/suppliers",
    icon: <Truck className="h-5 w-5" />,
  },
  {
    title: "Employees",
    href: "/employees",
    icon: <UserRound className="h-5 w-5" />,
  },
  {
    title: "Locations",
    href: "/locations",
    icon: <Store className="h-5 w-5" />,
  },
  {
    title: "Delivery",
    href: "/delivery",
    icon: <MapPin className="h-5 w-5" />,
  },
  {
    title: "Feedback",
    href: "/feedback",
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: <FileBarChart className="h-5 w-5" />,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <Settings className="h-5 w-5" />,
  },
]

export default function Layout() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { logout } = useAuth()
  
  // Close mobile menu when location changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
        <Link to="/dashboard" className="flex items-center gap-2 md:gap-3">
          <PackageIcon className="h-6 w-6 text-primary" />
          <span className="font-bold">SmartGrocer</span>
        </Link>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={logout}
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Logout</span>
          </Button>
          <ThemeToggle />
        <Button
          variant="outline"
          size="icon"
            className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        </div>
      </header>
      
      <div className="flex flex-1">
        <aside className={cn(
          "w-64 border-r bg-background hidden md:block",
          "fixed left-0 top-16 bottom-0 z-40 overflow-y-auto"
        )}>
          <nav className="flex flex-col p-4 gap-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 transition-colors",
                  location.pathname === item.href
                    ? "bg-secondary/50 text-foreground"
                    : "text-muted-foreground hover:bg-secondary/20 hover:text-foreground"
                )}
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
          </nav>
        </aside>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="fixed inset-0 bg-background/80" onClick={() => setMobileMenuOpen(false)} />
            <nav className="fixed left-0 top-16 bottom-0 w-3/4 bg-background border-r p-4 overflow-y-auto">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 mb-1 transition-colors",
                    location.pathname === item.href
                      ? "bg-secondary/50 text-foreground"
                      : "text-muted-foreground hover:bg-secondary/20 hover:text-foreground"
                  )}
                >
                  {item.icon}
                  {item.title}
                </Link>
              ))}

              <Button 
                variant="ghost"
                className="w-full mt-4 flex items-center justify-start gap-3 px-3"
                onClick={logout}
              >
                <LogOut className="h-5 w-5" />
                Logout
              </Button>
            </nav>
          </div>
        )}
        
        <main className="flex-1 md:ml-64 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
} 