import Order from '../models/order.model.js';
import Product from '../models/product.model.js';
import asyncHandler from 'express-async-handler';

// @desc    Create new order with COD
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    }

    try {
        // Verify products and calculate prices
        let orderItemsWithPrices = [];
        let calculatedItemsPrice = 0;

        for (const item of orderItems) {
            const product = await Product.findById(item.product);
            if (!product) {
                res.status(404);
                throw new Error(`Product not found: ${item.product}`);
            }
            
            if (product.stock < item.quantity) {
                res.status(400);
                throw new Error(`Not enough stock for product: ${product.name}`);
            }

            const itemTotal = product.price * item.quantity;
            calculatedItemsPrice += itemTotal;

            orderItemsWithPrices.push({
                product: product._id,
                name: product.name,
                quantity: item.quantity,
                price: product.price,
                image: product.image
            });
        }

        // Verify calculated prices match the request
        if (Math.abs(calculatedItemsPrice - itemsPrice) > 0.01) {
            res.status(400);
            throw new Error('Cart items price does not match');
        }

        // Create order
        const order = new Order({
            user: req.user._id,
            orderItems: orderItemsWithPrices,
            shippingAddress,
            paymentMethod,
            itemsPrice: calculatedItemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice: calculatedItemsPrice + taxPrice + shippingPrice,
            status: 'pending',
            isPaid: paymentMethod === 'CashOnDelivery' ? false : true,
            paidAt: paymentMethod === 'CashOnDelivery' ? null : new Date()
        });

        const createdOrder = await order.save();

        // Update product stock
        for (const item of orderItems) {
            await Product.updateOne(
                { _id: item.product },
                { $inc: { stock: -item.quantity } }
            );
        }

        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500);
        throw new Error(error.message || 'Error creating order');
    }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    
    if (order && (order.user._id.toString() === req.user._id.toString() || req.user.isAdmin)) {
        res.json(order);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private/Admin
const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    
    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.status = 'processing';
        
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    
    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        order.status = 'delivered';
        
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
});

export {
    createOrder,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getMyOrders,
    getOrders
};