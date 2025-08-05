import express from 'express';
import {
    createOrder,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getMyOrders,
    getOrders
} from '../controllers/order.controller.js';
import authorize from '../middleware/auth.middleware.js';
import admin from '../middleware/admin.middleware.js';

const router = express.Router();

// Public routes (none for orders)

// Protected routes (user must be authenticated)
router.post('/', authorize, createOrder)  // Create a new order (including COD)
router.get('/', authorize, admin, getOrders);  // Get all orders (admin only)
router.get('/myorders', authorize, getMyOrders);  // Get logged in user's orders
router.get('/:id', authorize, getOrderById);  // Get order by ID

// Admin routes
router.put('/:id/pay', authorize, admin, updateOrderToPaid);  // Update order to paid
router.put('/:id/deliver', authorize, admin, updateOrderToDelivered);  // Update order to delivered

export default router;