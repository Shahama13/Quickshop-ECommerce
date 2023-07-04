import slugify from "slugify"
import { Category } from "../models/categoryModel.js"

export const createCategoryController = async (req, res, next) => {
    try {
        const { name } = req.body

        const existingcategory = await Category.findOne({ name })
        if (existingcategory) {
            return res.status(200).send({
                success: true,
                message: "Category already exists"
            })
        }
        const category = await new Category({ name, slug: slugify(name) }).save()
        res.status(201).send({
            success: true,
            message: "new category created",
            category
        })

    } catch (error) {
        next(new Error(error.message))
    }
}

export const updateCategoryController = async (req, res, next) => {
    try {
        const { name } = req.body
        const { id } = req.params
        const category = await Category.findByIdAndUpdate(id, { name, slug: slugify(name) }, { new: true })
        res.status(200).send({
            success: true,
            message: "Category updated successfully",
            category
        })
    } catch (error) {
        next(new Error(error.message))
    }
}

export const getAllCategoryController = async (req, res, next) => {
    try {
        const category = await Category.find({})
        res.status(200).json({
            success: true,
            message: "All categories list",
            category
        })
    } catch (error) {
        next(new Error(error.message))
    }
}

// single category 
export const singleCategoryController = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const category = await Category.findOne({ slug })
        res.status(200).send({
            success: "true",
            message: "got single category successfully",
            category
        })
    } catch (error) {
        next(new Error(error.message))
    }
}

export const deleteCategoryController = async (req, res, next) => {
    try {
        const { id } = req.params
        await Category.findByIdAndDelete(id)
        res.status(200).send({
            success: "true",
            message: "Category Deleted successfully"
        })
    } catch (error) {
        next(new Error(error.message))
    }
}