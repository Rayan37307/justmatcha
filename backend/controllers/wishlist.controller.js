import Wishlist from "../models/wishlist.model.js";

export const addToWishlist = async (req, res, next) => {
    try {
        const { productId } = req.body;
        const userId = req.user._id;
        
        if (!userId) {
            const error = new Error("User not authenticated");
            error.statusCode = 401;
            throw error;
        }

        let wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            wishlist = new Wishlist({ 
                user: userId, 
                products: [{ product: productId }] 
            });
        } else {
            // Check if product already exists in wishlist
            const existingProduct = wishlist.products.some(
                item => item.product.toString() === productId
            );
            
            if (existingProduct) {
                return res.status(200).json({
                    success: true,
                    message: "Product already in wishlist",
                    data: wishlist
                });
            }
            
            // Add new product to wishlist
            wishlist.products.push({ product: productId });
        }

        const savedWishlist = await wishlist.save();
        const populatedWishlist = await Wishlist
            .findById(savedWishlist._id)
            .populate('products.product');

        res.status(200).json({
            success: true, 
            message: "Product added to wishlist successfully", 
            data: populatedWishlist
        });
    } catch (error) {
        next(error);
    }
};

export const getWishlist = async (req, res, next) => {
    try {
        const userId = req.user._id;
        
        if (!userId) {
            const error = new Error("User not authenticated");
            error.statusCode = 401;
            throw error;
        }

        let wishlist = await Wishlist
            .findOne({ user: userId })
            .populate('products.product');
            
        if (!wishlist) {
            // Create empty wishlist if not exists
            wishlist = new Wishlist({ 
                user: userId, 
                products: [] 
            });
            await wishlist.save();
        }
        
        res.status(200).json({
            success: true, 
            message: "Wishlist fetched successfully", 
            data: wishlist
        });
    } catch (error) {
        next(error);
    }
};

export const removeProductFromWishlist = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const userId = req.user._id;
        
        if (!userId) {
            const error = new Error("User not authenticated");
            error.statusCode = 401;
            throw error;
        }

        const wishlist = await Wishlist.findOne({ user: userId });
        
        if (!wishlist) {
            return res.status(200).json({
                success: true,
                message: "Wishlist is already empty",
                data: { products: [] }
            });
        }

        // Remove the product from wishlist
        wishlist.products = wishlist.products.filter(
            item => item.product.toString() !== productId
        );
        
        const updatedWishlist = await wishlist.save();
        const populatedWishlist = await Wishlist
            .findById(updatedWishlist._id)
            .populate('products.product');

        res.status(200).json({
            success: true,
            message: "Product removed from wishlist",
            data: populatedWishlist
        });
    } catch (error) {
        next(error);
    }
};

export const clearWishlist = async (req, res, next) => {
    try {
        const userId = req.user._id;
        
        if (!userId) {
            const error = new Error("User not authenticated");
            error.statusCode = 401;
            throw error;
        }

        const wishlist = await Wishlist.findOneAndUpdate(
            { user: userId },
            { $set: { products: [] } },
            { new: true, runValidators: true }
        ).populate('products.product');

        res.status(200).json({
            success: true,
            message: "Wishlist cleared successfully",
            data: wishlist || { products: [] }
        });
    } catch (error) {
        next(error);
    }
};

