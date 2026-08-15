import { Router } from "express"
import { createProduct,getAllProducts,getProuctbyId,updateProduct,deleteProduct,getProductsByCategory,searchProducts,searchbyPrice,sortByPrice,pagination } from "../controllers/product.controller.js"
import { getProducts } from "../controllers/productQuery.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"
import { isAdmin } from "../middlewares/admin.middleware.js"
const router = Router()
router.post("/create", authMiddleware, isAdmin, createProduct)
router.get("/getAll", getAllProducts)
router.get("/category", getProductsByCategory)  
router.get("/search", searchProducts) 
router.get("/price",searchbyPrice)
router.get("/sort",sortByPrice)
router.delete("/:id", authMiddleware, isAdmin, deleteProduct)
router.get("/pagination",pagination)
router.get("/products",getProducts)
router.get("/:id", getProuctbyId)           
router.put("/:id", authMiddleware, isAdmin, updateProduct)
export default router   