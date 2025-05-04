import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { PackageIcon, ShoppingCart, Database, Server, Code, Sun, Moon } from "lucide-react";
import { ThemeToggle } from "../../components/ThemeToggle";

const Home = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2 md:gap-3">
          <PackageIcon className="h-6 w-6 text-primary" />
          <span className="font-bold">SmartGrocer</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link to="/login">
            <Button variant="outline">Login</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 py-12 md:py-24 lg:py-32 flex items-center justify-center">
        <div className="container flex flex-col items-center text-center gap-4">
          <PackageIcon className="h-16 w-16 text-primary" />
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            SmartGrocer
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-[800px]">
            A comprehensive inventory management system for grocery stores
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Link to="/login">
              <Button size="lg">Get Started</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted/40 py-12 md:py-24">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <ShoppingCart className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Inventory Management</CardTitle>
                <CardDescription>
                  Track product quantities, set reorder levels, and manage stock efficiently
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Database className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Order Processing</CardTitle>
                <CardDescription>
                  Create and manage customer orders with real-time inventory updates
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Server className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Supplier Management</CardTitle>
                <CardDescription>
                  Manage supplier information and streamline procurement processes
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-12 md:py-24">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Technology Stack</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Frontend</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>React with TypeScript</li>
                  <li>React Router for navigation</li>
                  <li>Tailwind CSS for styling</li>
                  <li>Shadcn UI components</li>
                  <li>Lucide React for icons</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Backend</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Node.js with Express</li>
                  <li>MySQL database</li>
                  <li>RESTful API architecture</li>
                  <li>Axios for API requests</li>
                  <li>CORS for cross-origin support</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Dark/Light theme support</li>
                  <li>Responsive design</li>
                  <li>Form validation</li>
                  <li>Error handling</li>
                  <li>Real-time data updates</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Developers */}
      <section className="bg-muted/40 py-12 md:py-24">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Development Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Dhruv Juneja</CardTitle>
                <CardDescription>
                  Reg. No: RA2311030010184
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Frontend & Backend Developer</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Arnab Datta</CardTitle>
                <CardDescription>
                  Reg. No: RA2311030010183
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Frontend & Backend Developer</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle>Project Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">Dr. Safa M</p>
                <p className="text-muted-foreground mt-1">Faculty Guide</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-2">
            <PackageIcon className="h-5 w-5" />
            <span className="font-semibold">SmartGrocer</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} SmartGrocer Inventory Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home; 