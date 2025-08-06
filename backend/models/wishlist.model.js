import mongoose from 'mongoose'

const wishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"],
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: [true, "Product is required"],
            },
        },
    ],
}, {
    timestamps: true,
})

const Wishlist = mongoose.model("Wishlist", wishlistSchema)

export default Wishlist

