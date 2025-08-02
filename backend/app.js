import express from 'express'
import { PORT } from './config/env.js'
import userRouter from './routes/user.routes.js'
import productRouter from './routes/products.routes.js'
import authRouter from './routes/auth.routes.js'
import connectToDatabase from './database/mongodb.js'
import errorMiddleware from './middlewares/error.middleware.js'
import cookieParser from 'cookie-parser'
import cartRouter from './routes/cart.routes.js'
import wishlistRouter from './routes/wishlist.routes.js'
import cors from 'cors'
const app = express()
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/cart', cartRouter)
app.use('/api/v1/wishlist', wishlistRouter)

app.use(errorMiddleware)

app.get('/', (req, res) => {
    res.send("Welcome to the JustMatcha backend")
})

app.listen(PORT, async () => {
    console.log(`JustMatcha api is running on http://localhost:${PORT}`)
    await connectToDatabase();
})

export default app