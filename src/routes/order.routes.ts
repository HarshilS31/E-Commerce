import {Router} from 'express'
import { createOrder,getMyOrders,getOrderbyId,getAllOrders,updateOrderStatus,updatePaymentStatus } from '../controllers/order.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { isAdmin } from "../middlewares/admin.middleware.js"
const router = Router()
router.post("/create",authMiddleware,createOrder)
router.get("/get",authMiddleware,getMyOrders)
router.get("/getAll",authMiddleware,isAdmin,getAllOrders)
router.get("/:id",authMiddleware,getOrderbyId)
router.put("/payment/:id",authMiddleware,isAdmin,updatePaymentStatus)
router.put("/:id",authMiddleware,isAdmin,updateOrderStatus)
export default router