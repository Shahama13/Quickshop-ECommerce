import { User } from "../models/userModel.js"
import { comparePassword, hashPassword } from "../helpers/authHelper.js"
import jwt from "jsonwebtoken"
import { Order } from "../models/orderModel.js"


// REGISTER
export const registerController = async (req, res, next) => {
    try {
        const { name, email, password, phone, address, answer } = req.body
        let user = await User.findOne({ email })
        if (user) return next(new Error("user already exists"))
        const hashedPassword = await hashPassword(password)
        user = await User.create({ name, email, password: hashedPassword, phone, address, answer })
        res.status(200).json({
            success: true,
            message: "User created successfully",
            user
        })
    } catch (error) {
        next(new Error(error.message))
    }
}

//LOGIN
export const loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body
        if (!email || !password) return next(new Error("Please enter email and password"))

        const user = await User.findOne({ email })
        if (!user) return next(new Error("email not registered"))
        const match = await comparePassword(password, user.password)
        if (!match) return next(new Error("invalid email or password"))

        const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "4d" })
        res.status(200).send({
            success: true,
            message: "login successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
            },
            token
        })

    } catch (error) {
        next(new Error(error.message))
    }
}

export const testing = async (req, res, next) => {
    res.status(200).json({
        message: "PROTECTED ROUTE"
    })
}

// Forgot password
export const forgotpasswordController = async (req, res, next) => {
    try {
        const { email, answer, newPassword } = req.body
        if (!newPassword) return next(new Error("new password is required"))

        const user = await User.findOne({ email, answer })

        if (!user) return next(new Error("Wrong email or answer"))

        const hashed = await hashPassword(newPassword)
        await User.findByIdAndUpdate(user._id, { password: hashed })
        res.status(200).send({
            success: "true",
            message: "Password reset successfully"
        })


    } catch (error) {
        next(new Error(error.message))
    }
}

// update profile
export const updateProfileController = async (req, res, next) => {
    try {
        const { name, address, phone } = req.body
        const user = await User.findById(req.user._id)
        // password
        // if (password?.length < 6) return next(new Error("password is required and should be more than 6 chracters"))
        // if (password) {
        //     const hashedPassword = await hashPassword(password)
        // }
        // const hashedPassword = password ? await hashPassword(password) : undefined
        const updatedUser = await User.findByIdAndUpdate
            (req.user._id, {
                name: name || user.name,
                phone: phone || user.phone,
                address: address || user.address,
            }, { new: true })
        res.status(200).json({
            success: true,
            message: "Profile updated sucessfully",
            updatedUser
        })
    } catch (error) {
        next(new Error(error.message))
    }
}

// orders
export const getOrdersController = async (req, res, next) => {
    try {
        const orders = await Order
            .find({ buyer: req.user._id })
            .populate("products", "-photo")
            .populate("buyer", "name")
        res.json(orders)
    } catch (error) {
        next(new Error(error.message))
    }
}

// all user orders
export const getAllUserOrdersController = async (req, res, next) => {
    try {
        const orders = await Order
            .find({})
            .populate("products", "-photo")
            .populate("buyer", "name")
            .sort({ createdAt: "-1" })
        res.json(orders)
    } catch (error) {
        next(new Error(error.message))
    }
}

// update user order
export const updateUserOrderController = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body
        const orders = await Order.findByIdAndUpdate(orderId, {status}, {new:true})
        res.json(orders)
    } catch (error) {
        next(new Error(error.message))
    }
}