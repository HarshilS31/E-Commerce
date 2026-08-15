import { Router } from "express"
import { createCategory,getAllCategories,getCategoryByID,updateCategory,deleteCategory } from "../controllers/categories.controller.js"
import {authMiddleware} from "../middlewares/auth.middleware.js"
import { isAdmin } from "../middlewares/admin.middleware.js"
const router = Router()
router.post("/create",authMiddleware,isAdmin,createCategory)
router.get("/getAll",getAllCategories)
router.get("/:id",getCategoryByID)
router.put("/:id",authMiddleware,isAdmin,updateCategory)
router.delete("/:id",authMiddleware,isAdmin,deleteCategory)
export default router