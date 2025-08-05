import Order from '../models/order.model.js';
import Product from '../models/product.model.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
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
            taxPrice: taxPrice || 0,
            shippingPrice: shippingPrice || 0,
            totalPrice: calculatedItemsPrice + (taxPrice || 0) + (shippingPrice || 0),
            isPaid: paymentMethod === 'CashOnDelivery' ? false : true,
            paidAt: paymentMethod === 'CashOnDelivery' ? null : new Date(),
            status: 'pending'
        });

        const createdOrder = await order.save();

        // Update product stock
        for (const item of orderItems) {
            await Product.updateOne(
                { _id: item.product },
                { $inc: { stock: -item.quantity } }
            );
        }

        res.status(201).json({
            _id: createdOrder._id,
            user: createdOrder.user,
            orderItems: createdOrder.orderItems,
            shippingAddress: createdOrder.shippingAddress,
            paymentMethod: createdOrder.paymentMethod,
            itemsPrice: createdOrder.itemsPrice,
            taxPrice: createdOrder.taxPrice,
            shippingPrice: createdOrder.shippingPrice,
            totalPrice: createdOrder.totalPrice,
            isPaid: createdOrder.isPaid,
            status: createdOrder.status,
            createdAt: createdOrder.createdAt
        });
    } catch (error) {
        res.status(500);
        throw new Error(error.message || 'Error creating order');
    }
}

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    
    if (order && (order.user._id.toString() === req.user._id.toString() || req.user.isAdmin)) {
        res.json(order);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
}
// @desc    Update order details (admin only)
// @route   PUT /api/orders/:id/edit
// @access  Private/Admin
const updateOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            res.status(404);
            throw new Error('Order not found');
        }

        const {
            status,
            isPaid,
            isDelivered,
            shippingAddress
        } = req.body;

        // Update order status and dates
        if (status) order.status = status;
        
        // Update payment status and date if marked as paid
        if (isPaid !== undefined) {
            order.isPaid = isPaid;
            if (isPaid && !order.paidAt) {
                order.paidAt = Date.now();
            }
        }

        // Update delivery status and date if marked as delivered
        if (isDelivered !== undefined) {
            order.isDelivered = isDelivered;
            if (isDelivered && !order.deliveredAt) {
                order.deliveredAt = Date.now();
            }
        }

        // Update shipping address if provided
        if (shippingAddress) {
            order.shippingAddress = {
                ...order.shippingAddress,
                ...shippingAddress
            };
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ 
            message: error.message || 'Error updating order',
            stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack 
        });
    }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private/Admin
const updateOrderToPaid = async (req, res) => {
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
}

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res) => {
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
}

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('user', 'name email')
            .populate({
                path: 'orderItems.product',
                select: 'name image price',
                model: 'Product'
            })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching orders',
            error: error.message
        });
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
}

export {
    createOrder,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getMyOrders,
    getOrders,
    updateOrder
};