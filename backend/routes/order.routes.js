import {Router} from 'express';
import { 
    createOrder,
    getOrderById, 
    updateOrderToPaid, 
    updateOrderToDelivered,
    getMyOrders,
    getOrders,
    updateOrder
} from '../controllers/order.controller.js';
import authorize from '../middlewares/auth.middleware.js';
import admin from '../middlewares/admin.middleware.js';

const orderRouter = Router();

// Public routes (none for orders)

// Protected routes (user must be authenticated)
orderRouter.post('/', authorize, createOrder)  // Create a new order (including COD)
orderRouter.get('/', authorize, admin, getOrders);  // Get all orders (admin only)
orderRouter.get('/myorders', authorize, getMyOrders);  // Get logged in user's orders
orderRouter.get('/:id', authorize, getOrderById);  // Get order by ID

// Admin routes
orderRouter.put('/:id/pay', authorize, admin, updateOrderToPaid);  // Update order to paid
orderRouter.put('/:id/edit', authorize, admin, updateOrder);  // Update order details
orderRouter.put('/:id/deliver', authorize, admin, updateOrderToDelivered);  // Update order to delivered

export default orderRouter;