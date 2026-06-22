import { pool } from '../config/db.js';

export const getDeliveryZones = async () => {
  const [rows] = await pool.query('SELECT * FROM delivery_zones ORDER BY city, name');
  return rows;
};

export const getDeliveryVehicles = async () => {
  const [rows] = await pool.query('SELECT * FROM delivery_vehicles ORDER BY vehicle_number');
  return rows;
};

export const getDeliveryAssignments = async () => {
  const [rows] = await pool.query(`
    SELECT da.*, o.order_date, c.name as customer_name, dz.name as zone_name, 
           dv.vehicle_number, dv.vehicle_type
    FROM delivery_assignments da
    JOIN orders o ON da.order_id = o.id
    JOIN customers c ON o.customer_id = c.id
    JOIN delivery_zones dz ON da.delivery_zone_id = dz.id
    JOIN delivery_vehicles dv ON da.vehicle_id = dv.id
    ORDER BY da.scheduled_date DESC
  `);
  return rows;
};
