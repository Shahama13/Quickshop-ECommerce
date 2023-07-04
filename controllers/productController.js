import { Product } from "../models/productModel.js"
import { Category } from "../models/categoryModel.js"
import { Order } from "../models/orderModel.js"
import fs from "fs"
import slugify from "slugify"
import braintree from "braintree"
import dotenv from "dotenv"

dotenv.config();

// payment gateway
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export const createProductController = async (req, res, next) => {

    try {
        const { name, slug, description, price, category, quantity, shipping, imgLink } = req.fields
        const { photo } = req.files
        if (photo && photo.size > 1000000) {
            return res.status(500).send({
                message: "photo is required and should be less than 1mb"
            })
        }
        if (!name || !description || !price || !category || !quantity || !imgLink) {
            next(new Error("Cannot create product due to incomplete information !"))
        }
        const products = await new Product({ ...req.fields, slug: slugify(name) })
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }
        await products.save()
        res.status(201).send({
            success: true,
            message: "Product created successfully",
            products
        })
    } catch (error) {
        // next(new Error(error.message))
    }
}

// Get all products
export const getProductController = async (req, res, next) => {
    try {
        const products = await Product
            .find({})
            .populate('category')
            .select("-photo")
            .limit(12)
            .sort({ createdAt: -1 })
        res.status(200).send({
            success: true,
            totalcount: products.length,
            message: "All Products",
            products,
        })
    } catch (error) {
        next(new Error(error.message))
    }
}

// GET SINGLE PRODUCT
export const getSingleProductController = async (req, res, next) => {

    try {
        const product = await Product.findOne({ slug: req.params.slug }).select("-photo").populate("category")
        res.status(200).send({
            success: "true",
            message: "product fetched",
            product
        })

    } catch (error) {
        next(new Error(error.message))
    }
}

// get product photo
export const productPhotoController = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.pid).select("photo")
        if (product.photo.data) {
            res.set("Content-type", product.photo.contentType)
            return res.status(200).send(product.photo.data)
        }
    } catch (error) {
        next(new Error(error.message))
    }
}


// delete product
export const deleteProductController = async (req, res, next) => {
    try {
        await Product.findByIdAndDelete(req.params.pid).select("-photo")
        res.status(200).send({
            success: true,
            message: "Product deleted successfully"
        })

    } catch (error) {
        next(new Error(error.message))
    }
}

// Update product
export const updateProductController = async (req, res, next) => {
    try {
        const { name, slug, description, price, category, quantity, shipping } = req.fields
        const { photo } = req.files
        if (photo && photo.size > 1000000) {
            return res.status(500).send({
                message: "photo is required and should be less than 1mb"
            })
        }
        const products = await Product.findByIdAndUpdate(req.params.pid, { ...req.fields, slug: slugify(name) }, { new: true })
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }
        await products.save()
        res.status(201).send({
            success: true,
            message: "Product updated successfully",
            products
        })
    } catch (error) {
        next(new Error(error.message))
    }
}

// filters
export const productFilterController = async (req, res, next) => {
    try {
        const { checked, radio } = req.body
        let args = {}
        if (checked.length > 0) args.category = checked
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] }
        const products = await Product.find(args)
        res.status(200).send({
            success: true,
            products,
        })

    } catch (error) {
        next(new Error(error.message))
    }
}

// product count
export const productCountController = async (req, res, next) => {
    try {
        const total = await Product.find({}).estimatedDocumentCount()
        res.status(200).send({
            success: true,
            total
        })
    } catch (error) {
        next(new Error(error.message))
    }
}

// // product list based on page
// export const productListController = async (req, res, next) => {
//     try {
//         const perPage = 6
//         const page = req.params.page ? req.params.page : 1
//         const products = await Product
//             .find({})
//             .select("-photo")
//             .skip((page - 1) * perPage)
//             .limit(perPage)
//             .sort({ createdAt: -1 });

//         res.status(200).send({
//             success:true,
//             products,
//         })
//     } catch (error) {
//         next(new Error(error.message))
//     }
// }

export const productListController = async (req, res, next) => {
    try {
        const perPage = 6;
        let page = req.params.page ? parseInt(req.params.page) : 1;

        if (page < 1) {
            page = 1;
        }

        const skip = (page - 1) * perPage;

        const products = await Product
            .find({})
            .select("-photo")
            .skip(skip)
            .limit(perPage)
            .sort({ createdAt: -1 });

        res.status(200).send({
            success: true,
            products,
        });
    } catch (error) {
        next(new Error(error.message));
    }
};


export const searchProductController = async (req, res, next) => {
    try {
        const { keyword } = req.params
        const results = await Product
            .find({
                $or: [
                    { name: { $regex: keyword, $options: "i" } },
                    { description: { $regex: keyword, $options: "i" } }
                ]
            }).select("-photo")
        res.json(results)
    } catch (error) {
        next(new Error(error.message));
    }
}

// similar product
export const similarProductController = async (req, res, next) => {
    try {
        const { pid, cid } = req.params
        const products = await Product.find({
            category: cid,
            _id: { $ne: pid }
        }).select("-photo").limit(3).populate("category")
        res.status(200).send({
            success: true,
            products
        })
    } catch (error) {
        next(new Error(error.message));
    }
}

// get product by category
export const productCategoryController = async (req, res, next) => {
    try {
        const category = await Category.findOne({ slug: req.params.slug })
        const products = await Product.find({ category }).populate('category')
        res.status(200).send({
            success: true,
            category,
            products,
        })
    } catch (error) {
        next(new Error(error.message));
    }
}

// payment gateway api
// token
export const brainTreeTokenController = async (req, res) => {
    try {
        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
                res.status(500).send(err)
            }
            else {
                res.send(response)
            }
        })
    } catch (error) {
        console.log(error)
    }
}

// payment 
export const brainTreePaymentController = async (req, res) => {
    try {
        const { cart, nonce } = req.body
        let total = 0
        cart.map((i) => { total += i.price })
        let newTransaction = gateway.transaction.sale({
            amount: total,
            paymentMethodNonce: nonce,
            options: {
                submitForSettlement: true
            }
        },
            function (error, result) {
                if (result) {
                    const order = new Order({
                        products: cart,
                        payment: result,
                        buyer: req.user._id
                    }).save()
                    res.json({ok:true})
                }
                else{
                    res.status(500).send(error)
                }
            }
        )
    } catch (error) {
        console.log(error)
    }
}