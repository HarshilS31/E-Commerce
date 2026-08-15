import {Router} from "express"
import {registerUser,loginUser,logoutUser,getCurrentUser} from "../controllers/auth.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"
const router = Router()

router.post("/register",registerUser)
router.post("/login",loginUser)
router.post("/logout",authMiddleware,logoutUser)
router.get("/me",authMiddleware,getCurrentUser)
export default router

