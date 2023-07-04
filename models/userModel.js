import mongoose from "mongoose"
import validator from "validator"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter your Name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [4, "Name cannot be less than 4 chsaracters"]
    },
    email: {
        type: String,
        required: [true, "Please Enter your Email"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [8, "Password should be greater than 8 characters"],
    },
    phone: {
        type: String,
        minLength:[10, "enter a valid phone number"],
        required: [true, "Please enter your phone number"]
    },
    address: {
        type: String,
        required: [true, "Please enter your address"]
    },
    answer:{
        type:String,
        required: [true, "Answer is required"]
    },
    role: {
        type: Number,
        default: 0,
    }
}, { timestamps: true })

export const User = mongoose.model("user", userSchema)