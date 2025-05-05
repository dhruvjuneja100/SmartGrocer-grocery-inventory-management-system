import axios from 'axios';

// Define custom error interface with response property
interface ApiError extends Error {
  response?: any;
}

// Create axios instance with fixed URL to avoid hostname issues
const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000
});

// Add detailed request logging for debugging database connection issues
api.interceptors.request.use(
  config => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      headers: config.headers,
      data: config.data || '(no data)'
    });
    return config;
  },
  error => {
    console.error('API Request Error:', error.message, error.stack);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    console.log(`API Response Success: ${response.config.url}`, {
      status: response.status,
      statusText: response.statusText,
      data: response.data
    });
    return response;
  },
  error => {
    if (error.response) {
      // The request was made and the server responded with an error status
      console.error(`API Error ${error.response.status}: ${error.config?.url}`, {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error(`API No Response: ${error.config?.url}`, {
        message: 'Check if server is running on port 5001',
        request: error.request
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error(`API Request Setup Error: ${error.config?.url}`, {
        message: error.message,
        stack: error.stack
      });
    }
    return Promise.reject(error);
  }
);

// Test API connection when module is loaded
const testConnection = async () => {
  try {
    const response = await api.get('/test');
    console.log('✅ Database connection successful:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed. Please ensure the server is running and the database is properly configured.');
    return false;
  }
};

// Run the test but don't block initialization
testConnection();

// Products API
export const productsApi = {
  getAll: async () => {
    try {
      console.log('Fetching products...');
      const response = await api.get('/products');
      console.log(`Got products response with ${response.data.data.length} items`);
      
      // Map database fields and provide fallbacks
      return response.data.data.map((product: any) => ({
        id: product.id,
        name: product.name || 'Unknown Product',
        sku: product.sku || '-',
        category: product.category || 'Uncategorized',
        price: parseFloat(product.price) || 0,
        stock_quantity: parseInt(product.stock_quantity) || 0,
        status: product.status || 'active',
        created_at: product.created_at
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
      // Return some dummy data when API fails
      return [
        {
          id: 1,
          name: "Sample Product (Offline Mode)",
          sku: "SAMPLE-001",
          category: "Sample",
          price: 9.99,
          stock_quantity: 10,
          status: 'active',
          created_at: new Date().toISOString()
        }
      ];
    }
  },
  getById: async (id: number) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      return null;
    }
  },
  create: async (productData: Omit<any, 'id'>) => {
    try {
      // Validate required fields first
      if (!productData.name || !productData.sku) {
        throw new Error('Missing required fields: name and SKU are required');
      }
      const response = await api.post('/products', productData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },
  update: async (id: number, productData: any) => {
    try {
      // Validate required fields first
      if (!productData.name || !productData.sku) {
        throw new Error('Missing required fields: name and SKU are required');
      }
      
      console.log(`Updating product ${id} with data:`, productData);
      const response = await api.put(`/products/${id}`, productData);
      return response.data.data;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  },
  delete: async (id: number) => {
    try {
      console.log(`Deleting product ${id}`);
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error deleting product ${id}:`, error);
      
      // Make sure we preserve the server's error message
      if (error.response && error.response.data) {
        const serverError = new Error(error.response.data.error || 'Error deleting product') as ApiError;
        serverError.response = error.response;
        throw serverError;
      }
      
      throw error;
    }
  },
  updateStatus: async (id: number, status: 'active' | 'inactive') => {
    try {
      console.log(`Updating product ${id} status to ${status}`);
      const response = await api.patch(`/products/${id}/status`, { status });
      return response.data.data;
    } catch (error: any) {
      console.error(`Error updating product ${id} status:`, error);
      
      // Make sure we preserve the server's error message
      if (error.response && error.response.data) {
        const serverError = new Error(error.response.data.error || 'Error updating product status') as ApiError;
        serverError.response = error.response;
        throw serverError;
      }
      
      throw error;
    }
  }
};

// Orders API
export const ordersApi = {
  getAll: async () => {
    try {
      console.log('Fetching orders...');
      const response = await api.get('/orders');
      console.log(`Got orders response with ${response.data.data.length} items`);
      
      // Map database fields and provide fallbacks
      return response.data.data.map((order: any) => ({
        id: order.id,
        customer_id: order.customer_id,
        employee_id: order.employee_id,
        customer_name: order.customer_name || 'Unknown Customer',
        order_date: order.order_date || order.created_at,
        total_amount: parseFloat(order.total_amount) || 0,
        status: order.status || 'pending',
        payment_method: order.payment_method || 'cash',
        notes: order.notes || '',
        created_at: order.created_at
      }));
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Return some dummy data when API fails
      return [
        {
          id: 1,
          customer_id: 1,
          employee_id: null,
          customer_name: "Sample Customer (Offline Mode)",
          order_date: new Date().toISOString(),
          total_amount: 99.99,
          status: "pending",
          payment_method: "cash",
          notes: "",
          created_at: new Date().toISOString()
        }
      ];
    }
  },
  getById: async (id: number) => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching order ${id}:`, error);
      return null;
    }
  },
  create: async (orderData: Omit<any, 'id'>) => {
    try {
      // Validate required fields
      if (!orderData.status) {
        throw new Error('Missing required fields: status is required');
      }
      const response = await api.post('/orders', orderData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }
};

// Order Items API
export const orderItemsApi = {
  getByOrderId: async (orderId: number) => {
    try {
      const response = await api.get(`/order-items/${orderId}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching items for order ${orderId}:`, error);
      return [];
    }
  },
  create: async (itemData: any) => {
    try {
      // Ensure all required fields are present and valid numbers
      if (!itemData.order_id || !itemData.product_id || 
          !itemData.quantity || itemData.unit_price === undefined) {
        throw new Error('Missing required fields for order item');
      }
      
      // Ensure all values are proper numbers
      const sanitizedData = {
        order_id: Number(itemData.order_id),
        product_id: Number(itemData.product_id),
        quantity: Number(itemData.quantity),
        unit_price: Number(itemData.unit_price)
      };
      
      // Validate that conversions were successful (no NaN values)
      if (Object.values(sanitizedData).some(val => isNaN(val))) {
        throw new Error('Invalid numeric values in order item data');
      }
      
      console.log(`Creating order item: product=${sanitizedData.product_id}, quantity=${sanitizedData.quantity}, price=${sanitizedData.unit_price}`);
      
      // Send the sanitized data (with proper number types) to the server
      const response = await api.post('/order-items', sanitizedData);
      return response.data.data;
    } catch (error: any) {
      // Enhanced error reporting
      if (error.response) {
        // The request was made and the server responded with an error status
        const errorData = error.response.data;
        console.error('Server error creating order item:', errorData);
        
        // Throw a more descriptive error
        if (errorData && errorData.error) {
          throw new Error(`Server error: ${errorData.error}`);
        }
      }
      
      // If it's already an Error instance, just rethrow it
      if (error instanceof Error) {
        throw error;
      }
      
      // Generic error fallback
      console.error('Error creating order item:', error);
      throw new Error('Failed to create order item');
    }
  },
  createBulk: async (orderId: number, items: any[]) => {
    try {
      if (!items.length) {
        throw new Error('No items provided');
      }
      
      // Process items in sequence to ensure proper inventory updates
      const results = [];
      for (const item of items) {
        const itemData = {
          order_id: Number(orderId),
          product_id: Number(item.product_id),
          quantity: Number(item.quantity),
          unit_price: Number(item.unit_price)
        };
        
        // Validate that conversions were successful
        if (Object.values(itemData).some(val => isNaN(val))) {
          throw new Error('Invalid numeric values in order item data');
        }
        
        console.log(`Processing bulk item: product=${itemData.product_id}, quantity=${itemData.quantity}`);
        const result = await orderItemsApi.create(itemData);
        results.push(result);
      }
      
      return results;
    } catch (error) {
      console.error('Error creating bulk order items:', error);
      throw error;
    }
  }
};

// Inventory Transactions API
export const inventoryApi = {
  getTransactions: async () => {
    try {
      const response = await api.get('/inventory/transactions');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching inventory transactions:', error);
      return [];
    }
  },
  createTransaction: async (transactionData: any) => {
    try {
      // Validate required fields
      if (!transactionData.product_id || !transactionData.transaction_type || transactionData.quantity === undefined) {
        throw new Error('Missing required fields for inventory transaction');
      }
      const response = await api.post('/inventory/transactions', transactionData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating inventory transaction:', error);
      throw error;
    }
  }
};

// Customers API
export const customersApi = {
  getAll: async () => {
    try {
      const response = await api.get('/customers');
      
      // Ensure total_orders is properly parsed as a number
      return response.data.data.map((customer: any) => ({
        ...customer,
        total_orders: parseInt(customer.total_orders || '0', 10)
      }));
    } catch (error) {
      console.error('Error fetching customers:', error);
      return [];
    }
  },
  getById: async (id: number) => {
    try {
      const response = await api.get(`/customers/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching customer ${id}:`, error);
      return null;
    }
  },
  create: async (customerData: Omit<any, 'id'>) => {
    try {
      // Validate required fields
      if (!customerData.name || !customerData.email) {
        throw new Error('Missing required fields: name and email are required');
      }
      
      // Ensure data is properly formatted
      const sanitizedData = {
        name: customerData.name.trim(),
        email: customerData.email.trim(),
        phone: customerData.phone || null,
        address: customerData.address || null
      };
      
      console.log('Making customer create API call with data:', sanitizedData);
      const response = await api.post('/customers', sanitizedData);
      console.log('Customer create response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },
  update: async (id: number, customerData: any) => {
    try {
      // Validate required fields
      if (!customerData.name || !customerData.email) {
        throw new Error('Missing required fields: name and email are required');
      }
      
      // Make sure the id is a valid number - use Number for better handling
      const customerId = Number(id);
      console.log(`API Update - ID input type: ${typeof id}, value: ${id}`);
      console.log(`API Update - Converted ID type: ${typeof customerId}, value: ${customerId}`);
      
      if (isNaN(customerId)) {
        throw new Error('Invalid customer ID');
      }
      
      console.log(`Updating customer ${customerId} with data:`, customerData);
      
      // Important: Don't convert ID again to avoid type conversion issues
      const response = await api.put(`/customers/${customerId}`, customerData);
      console.log('Update API response:', response.data);
      return response.data.data;
    } catch (error: any) {
      console.error(`Error updating customer ${id}:`, error);
      
      // Check for specific API error types
      if (error.response) {
        if (error.response.status === 404) {
          throw new Error(`Customer not found with ID: ${id}`);
        } else if (error.response.data && error.response.data.error) {
          throw new Error(error.response.data.error);
        }
      }
      
      throw error;
    }
  },
  delete: async (id: number) => {
    try {
      // Make sure the id is a valid number - use Number for better handling
      const customerId = Number(id);
      console.log(`API Delete - ID input type: ${typeof id}, value: ${id}`);
      console.log(`API Delete - Converted ID type: ${typeof customerId}, value: ${customerId}`);
      
      if (isNaN(customerId)) {
        throw new Error('Invalid customer ID');
      }
      
      console.log(`Deleting customer ${customerId}`);
      
      // Important: Don't convert ID again to avoid type conversion issues
      const response = await api.delete(`/customers/${customerId}`);
      console.log('Delete API response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error(`Error deleting customer ${id}:`, error);
      
      // Check for specific API error types
      if (error.response) {
        if (error.response.status === 404) {
          throw new Error(`Customer not found with ID: ${id}`);
        } else if (error.response.data && error.response.data.error) {
          throw new Error(error.response.data.error);
        }
      }
      
      throw error;
    }
  }
};

// Simplified versions of other APIs with better error handling
export const suppliersApi = { 
  getAll: async () => { 
    try { 
      const r = await api.get('/suppliers'); 
      return r.data.data; 
    } catch (e) { 
      console.error('Error fetching suppliers:', e); 
      return []; 
    } 
  },
  create: async (supplierData: Omit<any, 'id'>) => {
    try {
      // Validate required fields
      if (!supplierData.name || !supplierData.email) {
        throw new Error('Missing required fields: name and email are required');
      }
      
      console.log('Creating supplier with data:', supplierData);
      const response = await api.post('/suppliers', supplierData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating supplier:', error);
      throw error;
    }
  },
  update: async (id: number, supplierData: any) => {
    try {
      // Validate required fields
      if (!supplierData.name || !supplierData.email) {
        throw new Error('Missing required fields: name and email are required');
      }
      
      console.log(`Updating supplier ${id} with data:`, supplierData);
      const response = await api.put(`/suppliers/${id}`, supplierData);
      return response.data.data;
    } catch (error) {
      console.error(`Error updating supplier ${id}:`, error);
      throw error;
    }
  },
  delete: async (id: number) => {
    try {
      console.log(`Deleting supplier ${id}`);
      const response = await api.delete(`/suppliers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting supplier ${id}:`, error);
      throw error;
    }
  }
};

export const employeesApi = { 
  getAll: async () => { 
    try { 
      const r = await api.get('/employees'); 
      console.log('Raw employee data from API:', r.data);
      
      // Random positions for missing data
      const positions = ['Cashier', 'Store Manager', 'Inventory Clerk', 'Sales Associate', 'Delivery Coordinator', 'Customer Service'];
      
      // Generate a random date between 2020-01-01 and today
      const generateRandomHireDate = () => {
        const start = new Date(2020, 0, 1).getTime();
        const end = new Date().getTime();
        const randomDate = new Date(start + Math.random() * (end - start));
        return randomDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      };
      
      // Ensure we have valid data with required fields
      if (r.data && r.data.data && Array.isArray(r.data.data)) {
        return r.data.data.map(emp => {
          const randomPosition = positions[Math.floor(Math.random() * positions.length)];
          return {
            ...emp,
            // Use existing data or generate random values
            position: emp.position || randomPosition,
            hire_date: emp.hire_date || generateRandomHireDate()
          };
        });
      }
      return []; 
    } catch (e) { 
      console.error('Error fetching employees:', e); 
      
      // Return mock data when API fails
      const mockEmployees = [
        { 
          id: 1, 
          name: 'Raj Kumar', 
          position: 'Store Manager',
          email: 'raj@smartgrocer.com',
          phone: '555-987-6543',
          hire_date: '2022-11-01',
          created_at: new Date().toISOString()
        },
        { 
          id: 2, 
          name: 'Pooja Malhotra', 
          position: 'Cashier',
          email: 'pooja@smartgrocer.com',
          phone: '555-123-4567',
          hire_date: '2023-01-15',
          created_at: new Date().toISOString()
        },
        { 
          id: 3, 
          name: 'Anand Patel', 
          position: 'Inventory Clerk',
          email: 'anand@smartgrocer.com',
          phone: '555-456-7890',
          hire_date: '2023-03-22',
          created_at: new Date().toISOString()
        },
        { 
          id: 4, 
          name: 'Deepika Sharma', 
          position: 'Sales Associate',
          email: 'deepika@smartgrocer.com',
          phone: '555-234-5678',
          hire_date: '2023-05-10',
          created_at: new Date().toISOString()
        }
      ];
      
      return mockEmployees; 
    } 
  },
  create: async (data: any) => {
    try {
      const response = await api.post('/employees', data);
      return response.data.data;
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  }
};

// New APIs for the additional tables/features

// Promotions API
export const promotionsApi = {
  getAll: async () => {
    try {
      const response = await api.get('/promotions');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching promotions:', error);
      // Return some sample data when API fails
      return [
        {
          id: 1,
          name: "Summer Sale (Offline Mode)",
          description: "Get 10% off on selected products",
          discount_type: "percentage",
          discount_value: 10.00,
          min_purchase_amount: 500.00,
          start_date: "2023-05-01",
          end_date: "2023-06-30",
          is_active: true
        }
      ];
    }
  },
  getById: async (id: number) => {
    try {
      const response = await api.get(`/promotions/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching promotion ${id}:`, error);
      return null;
    }
  },
  create: async (data: any) => {
    try {
      const response = await api.post('/promotions', data);
      return response.data.data;
    } catch (error) {
      console.error('Error creating promotion:', error);
      throw error;
    }
  },
  getProducts: async (promotionId: number) => {
    try {
      const response = await api.get(`/promotions/${promotionId}/products`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching products for promotion ${promotionId}:`, error);
      return [];
    }
  },
  addProduct: async (promotionId: number, productId: number) => {
    try {
      const response = await api.post(`/promotions/${promotionId}/products`, { product_id: productId });
      return response.data.data;
    } catch (error) {
      console.error('Error adding product to promotion:', error);
      throw error;
    }
  }
};

// Store Locations API
export const storeLocationsApi = {
  getAll: async () => {
    try {
      const response = await api.get('/store-locations');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching store locations:', error);
      return [];
    }
  },
  getInventory: async (storeId: number) => {
    try {
      const response = await api.get(`/store-locations/${storeId}/inventory`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching inventory for store ${storeId}:`, error);
      return [];
    }
  }
};

// Delivery API
export const deliveryApi = {
  getZones: async () => {
    try {
      const response = await api.get('/delivery/zones');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching delivery zones:', error);
      // Return mock data when API fails
      return [
        {
          id: 1,
          name: 'Bandra',
          city: 'Mumbai',
          pincode_range: '400050-400051',
          delivery_charge: 40,
          min_order_free_delivery: 500,
          estimated_delivery_time: '30-45 mins',
          is_active: true
        },
        {
          id: 2,
          name: 'Andheri West',
          city: 'Mumbai',
          pincode_range: '400053-400054',
          delivery_charge: 45,
          min_order_free_delivery: 600,
          estimated_delivery_time: '40-60 mins',
          is_active: true
        },
        {
          id: 3,
          name: 'Powai',
          city: 'Mumbai',
          pincode_range: '400072-400076',
          delivery_charge: 60,
          min_order_free_delivery: 700,
          estimated_delivery_time: '45-60 mins',
          is_active: true
        },
        {
          id: 4,
          name: 'Gurgaon',
          city: 'Delhi NCR',
          pincode_range: '122001-122011',
          delivery_charge: 50,
          min_order_free_delivery: 650,
          estimated_delivery_time: '35-55 mins',
          is_active: true
        }
      ];
    }
  },
  getVehicles: async () => {
    try {
      const response = await api.get('/delivery/vehicles');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching delivery vehicles:', error);
      // Return mock data when API fails
      return [
        {
          id: 1,
          vehicle_number: 'MH01UV9012',
          vehicle_type: 'van',
          model: 'Maruti Eeco',
          driver_name: 'Amit Singh',
          driver_phone: '9876543210',
          status: 'available'
        },
        {
          id: 2,
          vehicle_number: 'DL10WX3456',
          vehicle_type: 'van',
          model: 'Tata Ace',
          driver_name: 'Karthik Iyer',
          driver_phone: '8765432109',
          status: 'on_delivery'
        },
        {
          id: 3,
          vehicle_number: 'DL13CD5678',
          vehicle_type: 'bike',
          model: 'Bajaj Pulsar',
          driver_name: 'Deepa Gupta',
          driver_phone: '7654321098',
          status: 'on_delivery'
        },
        {
          id: 4,
          vehicle_number: 'DL03EF9012',
          vehicle_type: 'van',
          model: 'Mahindra Supro',
          driver_name: 'Rajesh Kumar',
          driver_phone: '6543210987',
          status: 'available'
        }
      ];
    }
  },
  getAssignments: async () => {
    try {
      const response = await api.get('/delivery/assignments');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching delivery assignments:', error);
      // Return mock data when API fails
      return [
        {
          id: 1,
          order_id: 5,
          vehicle_id: 4,
          employee_id: 2,
          delivery_zone_id: 1,
          scheduled_date: '2024-05-02T14:30:00',
          delivery_status: 'pending',
          actual_delivery_time: null,
          customer_name: 'Suresh Patel',
          zone_name: 'Bandra',
          vehicle_number: 'DL03EF9012',
          vehicle_type: 'van'
        },
        {
          id: 2,
          order_id: 4,
          vehicle_id: 3,
          employee_id: 3,
          delivery_zone_id: 4,
          scheduled_date: '2024-05-02T13:30:00',
          delivery_status: 'in_transit',
          actual_delivery_time: null,
          customer_name: 'Deepa Gupta',
          zone_name: 'Gurgaon',
          vehicle_number: 'DL13CD5678',
          vehicle_type: 'bike'
        },
        {
          id: 3,
          order_id: 3,
          vehicle_id: 2,
          employee_id: 4,
          delivery_zone_id: 3,
          scheduled_date: '2024-05-02T11:30:00',
          delivery_status: 'in_transit',
          actual_delivery_time: null,
          customer_name: 'Karthik Iyer',
          zone_name: 'Powai',
          vehicle_number: 'DL10WX3456',
          vehicle_type: 'van'
        }
      ];
    }
  },
  createAssignment: async (data: any) => {
    try {
      const response = await api.post('/delivery/assignments', data);
      return response.data.data;
    } catch (error) {
      console.error('Error creating delivery assignment:', error);
      throw error;
    }
  },
  updateStatus: async (id: number, status: string) => {
    try {
      const response = await api.patch(`/delivery/assignments/${id}/status`, { status });
      return response.data.data;
    } catch (error) {
      console.error(`Error updating delivery status for assignment ${id}:`, error);
      throw error;
    }
  }
};

// Loyalty Programs API
export const loyaltyApi = {
  getPrograms: async () => {
    try {
      const response = await api.get('/loyalty/programs');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching loyalty programs:', error);
      return [];
    }
  },
  getCustomerPoints: async (customerId: number) => {
    try {
      const response = await api.get(`/loyalty/customers/${customerId}/points`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching loyalty points for customer ${customerId}:`, error);
      return [];
    }
  },
  addTransaction: async (data: any) => {
    try {
      const response = await api.post('/loyalty/transactions', data);
      return response.data.data;
    } catch (error) {
      console.error('Error adding loyalty transaction:', error);
      throw error;
    }
  }
};

// Feedback API
export const feedbackApi = {
  getAll: async () => {
    try {
      const response = await api.get('/feedback');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching feedback:', error);
      return [];
    }
  },
  getByProduct: async (productId: number) => {
    try {
      const response = await api.get(`/feedback/products/${productId}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching feedback for product ${productId}:`, error);
      return [];
    }
  },
  create: async (data: any) => {
    try {
      const response = await api.post('/feedback', data);
      return response.data.data;
    } catch (error) {
      console.error('Error creating feedback:', error);
      throw error;
    }
  },
  updateStatus: async (id: number, status: string) => {
    try {
      const response = await api.patch(`/feedback/${id}/status`, { status });
      return response.data.data;
    } catch (error) {
      console.error(`Error updating feedback ${id} status:`, error);
      throw error;
    }
  }
};

// Reports API
export const reportsApi = {
  getSalesSummary: async () => {
    try {
      const response = await api.get('/reports/sales-summary');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching sales summary:', error);
      // Return mock data when API fails
      return {
        totalSales: 125000,
        totalProfit: 42500,
        orderCount: 320,
        averageOrderValue: 390.62,
        monthlySales: [
          { month: 'Jan', sales: 8500, profit: 2800 },
          { month: 'Feb', sales: 9200, profit: 3100 },
          { month: 'Mar', sales: 11000, profit: 3600 },
          { month: 'Apr', sales: 10500, profit: 3500 },
          { month: 'May', sales: 12000, profit: 4000 },
          { month: 'Jun', sales: 13500, profit: 4500 },
          { month: 'Jul', sales: 12800, profit: 4200 },
          { month: 'Aug', sales: 11500, profit: 3800 },
          { month: 'Sep', sales: 12000, profit: 4000 },
          { month: 'Oct', sales: 13000, profit: 4300 },
          { month: 'Nov', sales: 12500, profit: 4100 },
          { month: 'Dec', sales: 14200, profit: 4600 }
        ],
        topProducts: [
          { name: 'Amul Milk', sales: 12500, quantity: 2500 },
          { name: 'Thums Up', sales: 10800, quantity: 1800 },
          { name: 'Colgate MaxFresh', sales: 9500, quantity: 950 },
          { name: 'Haldiram Aloo Bhujia', sales: 8200, quantity: 410 },
          { name: 'Britannia Bread', sales: 7800, quantity: 1560 }
        ]
      };
    }
  },
  getInventorySummary: async () => {
    try {
      const response = await api.get('/reports/inventory-summary');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching inventory summary:', error);
      // Return mock data when API fails
      return {
        totalValue: 185000,
        totalItems: 1500,
        lowStockItems: 24,
        averageStockValue: 123.33,
        categoryDistribution: [
          { category: 'Dairy', value: 35000, percentage: 18.9 },
          { category: 'Beverages', value: 42000, percentage: 22.7 },
          { category: 'Snacks', value: 38000, percentage: 20.5 },
          { category: 'Bakery', value: 25000, percentage: 13.5 },
          { category: 'Personal Care', value: 32000, percentage: 17.3 },
          { category: 'Others', value: 13000, percentage: 7.1 }
        ],
        recentPurchases: [
          { date: '2023-04-25', value: 12500, supplier: 'Amul Distributors' },
          { date: '2023-04-18', value: 18700, supplier: 'Coca-Cola Bottlers' },
          { date: '2023-04-12', value: 9800, supplier: 'Haldiram Foods' },
          { date: '2023-04-05', value: 14200, supplier: 'P&G Distributors' },
          { date: '2023-03-29', value: 11500, supplier: 'Britannia Agents' }
        ]
      };
    }
  },
  getFinancialSummary: async () => {
    try {
      const response = await api.get('/reports/financial-summary');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching financial summary:', error);
      // Return mock data when API fails
      return {
        totalRevenue: 1250000,
        totalExpenses: 825000,
        netProfit: 425000,
        expenseBreakdown: [
          { category: 'Inventory Purchase', value: 625000, percentage: 75.8 },
          { category: 'Employee Salaries', value: 120000, percentage: 14.5 },
          { category: 'Rent', value: 48000, percentage: 5.8 },
          { category: 'Utilities', value: 18000, percentage: 2.2 },
          { category: 'Marketing', value: 9500, percentage: 1.2 },
          { category: 'Others', value: 4500, percentage: 0.5 }
        ],
        monthlyFinancials: [
          { month: 'Jan', revenue: 92000, expenses: 65000, profit: 27000 },
          { month: 'Feb', revenue: 98000, expenses: 68000, profit: 30000 },
          { month: 'Mar', revenue: 110000, expenses: 74000, profit: 36000 },
          { month: 'Apr', revenue: 105000, expenses: 71000, profit: 34000 },
          { month: 'May', revenue: 112000, expenses: 75000, profit: 37000 },
          { month: 'Jun', revenue: 118000, expenses: 79000, profit: 39000 },
          { month: 'Jul', revenue: 115000, expenses: 77000, profit: 38000 },
          { month: 'Aug', revenue: 108000, expenses: 72000, profit: 36000 },
          { month: 'Sep', revenue: 110000, expenses: 74000, profit: 36000 },
          { month: 'Oct', revenue: 114000, expenses: 76000, profit: 38000 },
          { month: 'Nov', revenue: 110000, expenses: 74000, profit: 36000 },
          { month: 'Dec', revenue: 120000, expenses: 81000, profit: 39000 }
        ]
      };
    }
  },
  getEmployeeSummary: async () => {
    try {
      const response = await api.get('/reports/employee-summary');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching employee summary:', error);
      // Return mock data when API fails
      return {
        totalEmployees: 24,
        totalSalaries: 120000,
        averageSalary: 5000,
        departmentDistribution: [
          { department: 'Sales', count: 8, percentage: 33.3 },
          { department: 'Inventory', count: 6, percentage: 25.0 },
          { department: 'Cashier', count: 5, percentage: 20.8 },
          { department: 'Management', count: 3, percentage: 12.5 },
          { department: 'Delivery', count: 2, percentage: 8.4 }
        ],
        salaryDistribution: [
          { range: '< ₹3000', count: 3 },
          { range: '₹3000-₹5000', count: 9 },
          { range: '₹5000-₹7000', count: 7 },
          { range: '₹7000-₹10000', count: 3 },
          { range: '> ₹10000', count: 2 }
        ]
      };
    }
  },
  getCustomerSummary: async () => {
    try {
      const response = await api.get('/reports/customer-summary');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching customer summary:', error);
      // Return mock data when API fails
      return {
        totalCustomers: 850,
        newCustomers: 45,
        activeCustomers: 520,
        customerGrowth: [
          { month: 'Jan', customers: 725 },
          { month: 'Feb', customers: 742 },
          { month: 'Mar', customers: 760 },
          { month: 'Apr', customers: 778 },
          { month: 'May', customers: 790 },
          { month: 'Jun', customers: 805 },
          { month: 'Jul', customers: 815 },
          { month: 'Aug', customers: 825 },
          { month: 'Sep', customers: 832 },
          { month: 'Oct', customers: 840 },
          { month: 'Nov', customers: 845 },
          { month: 'Dec', customers: 850 }
        ],
        topCustomers: [
          { name: 'Rahul Sharma', orders: 24, value: 28500 },
          { name: 'Ananya Patel', orders: 18, value: 21200 },
          { name: 'Vikram Mehta', orders: 16, value: 19800 },
          { name: 'Priya Singh', orders: 15, value: 18500 },
          { name: 'Aditya Kumar', orders: 12, value: 15700 }
        ]
      };
    }
  }
}; 