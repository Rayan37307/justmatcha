import {Router} from "express";
import { signUp, signIn, signOut, getUser } from "../controllers/auth.controller.js";
import authorize from '../middlewares/auth.middleware.js'

const authRouter = Router();

authRouter.post('/sign-up', signUp)
authRouter.post('/sign-in', signIn)
authRouter.post('/sign-out', signOut)
authRouter.get('/user', authorize, getUser)

export default authRouter;