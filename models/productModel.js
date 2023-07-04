import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please enter a name"]
    },
    slug: {
        type: String,
        required: [true, "please enter slug"]
    },
    description: {
        type: String,
        required: [true, "please enter description"]
    },
    price: {
        type: Number,
        required: [true, "please enter price"]
    },
    quantity: {
        type: Number,
        required: [true, "Please enter quantity"]
    },
    category: {
        type: mongoose.ObjectId,
        ref: "category",
        required: [true, "please enter category"]
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    imgLink: {
        type: String
    },
    shipping: {
        type: Boolean
    }
}, { timestamps: true })

export const Product = mongoose.model("product", productSchema)
