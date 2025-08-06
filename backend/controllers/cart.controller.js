import Cart from "../models/cart.model.js";

export const addToCart = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user._id;
        
        if (!userId) {
            const error = new Error("User not authenticated");
            error.statusCode = 401;
            throw error;
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({ user: userId, products: [] });
        }

        if(!quantity) {
            const error = new Error("Quantity is required")
            error.statusCode = 400
            throw error
        }

        if(quantity <= 0) {
            const error = new Error("Quantity must be greater than 0")
            error.statusCode = 400
            throw error
        }

        const existingProduct = cart.products.find(product => product.product.toString() === productId)

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({product: productId, quantity})
        }

        await cart.save()
        res.status(200).json({success: true, message: "Product added to cart successfully", data: cart})
    } catch (error) {
        next(error)
    }
}
    
export const getCart = async (req, res, next) => {
    try {
        const userId = req.user._id;
        if (!userId) {
            const error = new Error("User not authenticated");
            error.statusCode = 401;
            throw error;
        }

        let cart = await Cart.findOne({ user: userId }).populate("products.product");
        
        // If no cart exists, create an empty one
        if (!cart) {
            cart = new Cart({ user: userId, products: [] });
            await cart.save();
        }

        if(!cart) {
            const error = new Error("Cart not found")
            error.statusCode = 404
            throw error
        }


        res.status(200).json({success: true, message: "Cart fetched successfully", data: cart})
    } catch (error) {
        next(error)
    }
}

export const updateCart = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { productId, quantity } = req.body;
        
        if (!userId) {
            const error = new Error("User not authenticated");
            error.statusCode = 401;
            throw error;
        }

        let cart = await Cart.findOne({ user: userId });
        
        // If cart doesn't exist, create a new one
        if (!cart) {
            cart = new Cart({ user: userId, products: [] });
        }

        if(!cart) {
            const error = new Error("Cart not found")
            error.statusCode = 404
            throw error
        }

        if(!quantity) {
            const error = new Error("Quantity is required")
            error.statusCode = 400
            throw error
        }

        if(quantity <= 0) {
            const error = new Error("Quantity must be greater than 0")
            error.statusCode = 400
            throw error
        }

        let productInCart = cart.products.find((product) => {
            return product.product.toString() === productId
        });

        if (!productInCart) {
            // If product is not in cart, add it
            cart.products.push({
                product: productId,
                quantity: quantity
            });
        } else {
            // Update quantity if product exists
            productInCart.quantity = quantity;
        }

        const updatedCart = await cart.save()
        
        // Populate the product details before sending the response
        const populatedCart = await Cart.findById(updatedCart._id).populate('products.product')
        
        res.status(200).json({
            success: true, 
            message: "Product updated successfully", 
            data: populatedCart
        })
    } catch (error) {
        next(error)
    }
}

export const deleteCart = async (req, res, next) => {
    try {
        const userId = req.user._id; // Get user ID from authenticated user
        const cart = await Cart.findOneAndDelete({ user: userId })

        if(!cart) {
            const error = new Error("Cart not found")
            error.statusCode = 404
            throw error
        }
        res.status(200).json({success: true, message: "Cart cleared successfully", data: cart})
    } catch (error) {
        next(error)
    }
}

export const removeProductFromCart = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { productId } = req.body;
        
        if (!userId) {
            const error = new Error("User not authenticated");
            error.statusCode = 401;
            throw error;
        }

        let cart = await Cart.findOne({ user: userId });
        
        // If cart doesn't exist, there's nothing to remove
        if (!cart) {
            return res.status(200).json({
                success: true,
                message: "Product removed from cart",
                data: { _id: userId, products: [] }
            });
        }

        cart.products = cart.products.filter((product) => {
            return product.product.toString() !== productId
        })

        await cart.save()
        res.status(200).json({success: true, message: "Product removed from cart successfully", data: cart})
    } catch (error) {
        next(error)
    }
}

