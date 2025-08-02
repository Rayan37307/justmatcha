import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import { 
    addToWishlist, 
    getWishlist, 
    removeProductFromWishlist, 
    clearWishlist 
} from "../controllers/wishlist.controller.js";

const wishlistRouter = Router();

// Get user's wishlist
wishlistRouter.get('/', authorize, getWishlist);

// Add product to wishlist
wishlistRouter.post('/', authorize, addToWishlist);

// Remove product from wishlist
wishlistRouter.delete('/:productId', authorize, removeProductFromWishlist);

// Clear entire wishlist
wishlistRouter.delete('/clear', authorize, clearWishlist);

export default wishlistRouter;