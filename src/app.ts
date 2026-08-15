import express from "express"
import authRoutes from "./routes/auth.routes.js"
import categoryRoutes from "./routes/category.routes.js"
import productRoutes from "./routes/product.routes.js"
import orderRoutes from "./routes/order.routes.js"
import cookieParser from "cookie-parser"
const app = express()
app.use(express.json())
app.use(cookieParser())
app.use("/api/v1/auth",authRoutes)
app.use("/api/v1/category",categoryRoutes)
app.use("/api/v1/product",productRoutes)
app.use("/api/v1/order",orderRoutes)

export default app