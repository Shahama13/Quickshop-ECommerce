import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { createCategoryController, deleteCategoryController, singleCategoryController, getAllCategoryController, updateCategoryController } from "../controllers/categoryController.js";

const router = express.Router()

// routes 
// Create
router.post('/create-category', requireSignIn, isAdmin, createCategoryController)

// update
router.put('/update-category/:id', requireSignIn, isAdmin, updateCategoryController)

// get all category
router.get('/get-category', getAllCategoryController)

// single category
router.get("/single-category/:slug", singleCategoryController)

// delete category
router.delete("/delete-category/:id", requireSignIn, isAdmin, deleteCategoryController)

export default router