import express from 'express'
import { registerController,updateUserOrderController, getAllUserOrdersController, getOrdersController, updateProfileController, loginController, forgotpasswordController, testing } from '../controllers/authController.js';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';

const router = express.Router()

router.post('/register', registerController)
router.post('/login', loginController)

router.post("/forgot-password", forgotpasswordController)

router.get('/test', requireSignIn, isAdmin, testing)

router.get("/user-auth", requireSignIn, (req, res) => {
    res.status(200).send({ ok: true })
})
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true })
})

// update profile
router.put('/profile', requireSignIn, updateProfileController)

// orders
router.get('/orders', requireSignIn, getOrdersController)

//all user orders
router.get('/all-user-orders', requireSignIn,isAdmin, getAllUserOrdersController)

//update user status
router.put('/update-user-order/:orderId', requireSignIn,isAdmin, updateUserOrderController)

export default router;