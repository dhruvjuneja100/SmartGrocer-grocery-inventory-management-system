# SmartGrocer - Grocery Inventory Management System

SmartGrocer is a comprehensive inventory management system designed for grocery stores. It provides a user-friendly interface to manage products, track inventory, handle orders, manage customers, and more.

## Features

- **Dashboard**: Overview of sales, inventory, and key metrics
- **Products Management**: Add, edit, delete, and categorize products
- **Inventory Tracking**: Monitor stock levels and get low stock alerts
- **Order Management**: Track pending and completed orders
- **Customer Management**: Maintain customer records and purchase history
- **Supplier Management**: Track suppliers and manage procurement
- **Employee Management**: Manage staff information and access
- **Reports & Analytics**: Generate insights about business performance

## Tech Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- React Router for navigation
- TanStack Query for data fetching
- Shadcn UI components
- Tailwind CSS for styling

### Backend
- Node.js with Express
- MongoDB for database
- JWT for authentication
- RESTful API architecture

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas connection)

### Installation

1. Clone the repository:
```sh
git clone https://github.com/your-username/smartgrocer.git
cd smartgrocer
```

2. Install frontend dependencies:
```sh
npm install
```

3. Install backend dependencies:
```sh
cd backend
npm install
```

4. Set up environment variables:
   - Create a `.env` file in the backend directory
   - Add the following variables:
     ```
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/smartgrocer
     JWT_SECRET=your_jwt_secret
     ```

5. Start the development servers:

   Frontend:
   ```sh
   # From root directory
   npm run dev
   ```

   Backend:
   ```sh
   # From /backend directory
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:8080`

## API Documentation

The API documentation is available at `/api/docs` when the backend server is running.

## Deployment

### Frontend
The frontend can be deployed to services like Vercel, Netlify, or any static hosting provider:

```sh
npm run build
```

### Backend
The backend can be deployed to services like Heroku, DigitalOcean, or AWS:

```sh
cd backend
npm run build
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any questions or support, please contact the SmartGrocer team at support@smartgrocer.app
