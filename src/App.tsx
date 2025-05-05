import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Customers from './pages/Customers'
import Orders from './pages/Orders'
import Suppliers from './pages/Suppliers'
import Employees from './pages/Employees'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import Locations from './pages/Locations'
import Delivery from './pages/Delivery'
import Loyalty from './pages/Loyalty'
import Feedback from './pages/Feedback'
import Inventory from './pages/Inventory'
import Home from './pages/Home'
import Login from './pages/Login'
import { ThemeProvider } from './components/theme-provider'
import { AuthProvider } from './components/AuthProvider'
import { Toaster } from './components/ui/toaster'

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="sg-theme">
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes */}
          <Route path="/" element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="customers" element={<Customers />} />
            <Route path="orders" element={<Orders />} />
            <Route path="suppliers" element={<Suppliers />} />
            <Route path="employees" element={<Employees />} />
            <Route path="locations" element={<Locations />} />
            <Route path="delivery" element={<Delivery />} />
            <Route path="loyalty" element={<Loyalty />} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App 