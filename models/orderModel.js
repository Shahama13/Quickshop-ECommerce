import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({
    products: [{
        type: mongoose.ObjectId,
        ref: "product",
    }],
    payment: {},
    buyer: {
        type: mongoose.ObjectId,
        ref: "user"
    },
    status: {
        type: String,
        default: "Processing",
        enum: [ "Processing", "Shipped", "Delivered", "Cancel"]
    }
}, { timestamps: true })
export const Order = mongoose.model("Order", orderSchema)
