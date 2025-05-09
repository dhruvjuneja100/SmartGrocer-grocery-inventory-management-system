import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Define the shape of the auth context
interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
});

// Export a hook to use the auth context
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Demo credentials
  const DEMO_EMAIL = "admin@smartgrocer.com";
  const DEMO_PASSWORD = "admin123";

  // Check if user is already authenticated on load
  useEffect(() => {
    const checkAuth = () => {
      const storedAuth = localStorage.getItem("isLoggedIn");
      if (storedAuth === "true") {
        setIsAuthenticated(true);
      }
    };

    checkAuth();
  }, []);

  // Redirect logic
  useEffect(() => {
    const publicPages = ["/", "/login", "/register", "/forgot-password"];
    const authRequired = !publicPages.includes(location.pathname);
    
    if (authRequired && !isAuthenticated) {
      // Redirect to login if trying to access protected page while not authenticated
      navigate("/login", { state: { from: location } });
    }
  }, [isAuthenticated, location, navigate]);

  const login = async (email: string, password: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
          localStorage.setItem("isLoggedIn", "true");
          setIsAuthenticated(true);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 800);
    });
  };

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; 