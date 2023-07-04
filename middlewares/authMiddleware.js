import jwt from 'jsonwebtoken'
import { User } from '../models/userModel.js'

export const requireSignIn = async (req, res, next) => {
    try {
        const decode = jwt.verify(req.headers.authorization, process.env.JWT_SECRET)
        req.user = await User.findById(decode._id)
        next()
    } catch (error) {
        console.log(error)
    }

}


// admin access
export const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)
        if (user.role !== 1) { return next(new Error("unauthorized access")) }
        else { next() }
    } catch (error) {
        console.log(error)
    }
}