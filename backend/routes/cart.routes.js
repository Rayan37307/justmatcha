import {Router} from "express";
import authorize from "../middlewares/auth.middleware.js";
import { addToCart, deleteCart, getCart, updateCart, removeProductFromCart } from "../controllers/cart.controller.js";

const cartRouter = Router();

cartRouter.get('/', authorize, getCart)
cartRouter.post('/', authorize, addToCart)
cartRouter.put('/', authorize, updateCart)
cartRouter.delete('/', authorize, deleteCart)
cartRouter.delete('/remove', authorize, removeProductFromCart)

export default cartRouter;
