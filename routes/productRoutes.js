import express from "express"
import formidable from "express-formidable"
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
    createProductController,
    productCountController,
    productFilterController,
    productListController,
    updateProductController,
    deleteProductController,
    productPhotoController,
    productCategoryController,
    searchProductController,
    similarProductController,
    brainTreeTokenController,
    brainTreePaymentController,
    getSingleProductController,
    getProductController
} from "../controllers/productController.js";

const router = express.Router()

// CREATE
router.post('/create-product', requireSignIn, isAdmin, formidable(), createProductController)

// GET ALL PRODUCTS
router.get('/get-product', getProductController)

// GET single PRODUCT
router.get('/get-product/:slug', getSingleProductController)

// GET photo
router.get('/product-photo/:pid', productPhotoController)

// delete product
router.delete('/delete-product/:pid', deleteProductController)

// update product
router.put('/update-product/:pid', requireSignIn, isAdmin, formidable(), updateProductController)

//filter product
router.post('/product-filters', productFilterController)

//product count
router.get('/product-count', productCountController)

//product count
router.get('/product-list/:page', productListController)

// search product
router.get('/search/:keyword', searchProductController)

// similar product
router.get('/related-product/:pid/:cid', similarProductController)

// on the basis category
router.get('/product-category/:slug', productCategoryController)

// payment routes
// token
router.get('/braintree/token', brainTreeTokenController)

// payments
router.post('/braintree/payment',requireSignIn, brainTreePaymentController)


export default router;