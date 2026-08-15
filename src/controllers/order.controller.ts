import { productModel } from "../models/product.model.js"
import { categoryModel } from "../models/category.model.js"
import { orderModel } from "../models/order.model.js"
import {Request,Response} from  "express"
import mongoose from "mongoose"
export const createOrder = async (req:Request,res:Response) => {
    try {
        const {items} = req.body
        const userId = req.user?.id
        if(!userId) {
            return res.status(401).json({message:"Unauthorized"})
        }
        if(!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({message:"Order must contain atleast 1 item"})
        }
        let totalAmount=0
        const orderItems = [] 
        for(const item of items ){
            const product = await productModel.findById(item.product)
            if(!product) {
                return res.status(404).json({message:`Product with id : ${item.product} not found`})

            }
            if(product.stock<item.quantity) {
                return res.status(400).json({message: `Insufficient stock for ${product.name}`})
            }
            totalAmount += product.price * item.quantity
            product.stock -= item.quantity
            await product.save()
            orderItems.push({product: product._id,quantity: item.quantity,price: product.price}) 
        }
        const newOrder = await orderModel.create({
            user: userId,
            items: orderItems,
            totalAmount
        })
        return res.status(201).json({
            message: "Order created successfully",
            order: newOrder
        })
    }catch(error) {
        console.error(error)
        return res.status(500).json({message:"Internal Server Error"})
    }

}
export const getMyOrders = async (req:Request,res:Response) => {
    try {
        const userId = req.user.id
        if(!userId) {
            return res.status(401).json({message:"Unauthorized"})
        }
        const orders = await orderModel.find({user:userId}).populate("user","-password")
        if(!orders || orders.length===0) {
            return res.status(404).json({message:"Orders not found"})
        }
        return res.status(200).json({message:"Orders fetched successfully",orders}) 
    }catch(error) {
        console.error(error)
        return res.status(500).json({message:"Internal Server Error"})
    }
}
export const getOrderbyId = async (req:Request,res:Response) => {
    try {
        const userId = req.user?.id
        const orderId = req.params.id as string
        if(!userId) {
            return res.status(401).json({message:"Unauthorized"})
        }
        if(!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({message:"Invalid Order Id"})
        }
        const order = await orderModel.findById(orderId).populate("items.product")
        if(!order) {
            return res.status(404).json({message:"Order not found"})
        }
        if(order.user.toString()!==userId) {
            return res.status(403).json({message:"You are not authorized to access/viiew this order"})
        }
        return res.status(200).json({message:"Your Order fetched successfully",order})
    }catch(error) {
        console.error(error)
        return res.status(500).json({message:"Internal Server Error"})
    }
}
export const getAllOrders = async (req:Request,res:Response) => {
    try{
        const orders = await orderModel.find().populate("items.product")
        if(orders.length===0) {
            return res.status(404).json({message:"Orders not found"})
        }
        return res.status(200).json({message:"Orders fetched successfully",orders})
    }catch(error) {
        console.error(error)
        return res.status(500).json({message:"Internal Server Error"})
    }
}
export const updateOrderStatus = async (req:Request,res:Response) => {
    try {
        const orderId = req.params.id as string
        const {status} = req.body
        if(!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({message:"Invalid Order Id"})
        }
        const validStatuses = ["pending","confirmed","shipped","delivered","cancelled"]
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid order status"
            })
        }
        const order = await orderModel.findById(orderId)
        if(!order) {
            return res.status(404).json({message:"Order not found"})
        }
        if (order.status === "cancelled") {
            return res.status(400).json({message: "Cancelled order cannot be updated"})
        }
        if(status==="cancelled") {
            if (order.status === "shipped" || order.status === "delivered"){
                return res.status(400).json({message: "Order can not be cancelled if already shipped/delivered"})
            }
            for(const item of order.items) {
                const product = await productModel.findById(item.product)
                if(!product) {
                    return res.status(404).json({message:`Product with id : ${item.product} not found`})
                }
                product.stock+=item.quantity
                await product.save()
            }
        }
        order.status=status
        await order.save()
        return res.status(200).json({message:"Order status updated successfully",order})
    }catch(error) {
        console.error(error)
        return res.status(500).json({message:"Internal Server Error"})
    }
}
export const updatePaymentStatus = async (req:Request,res:Response) => {
    try {
        const orderId = req.params.id as string
        const {paymentStatus} = req.body
        if(!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({message:"Invalid Order Id"})
        }
        const validStatuses = ["simulated", "pending"]
        if (!validStatuses.includes(paymentStatus)) {
            return res.status(400).json({
                message: "Invalid order status"
            })
        }
        const order = await orderModel.findById(orderId)
        if(!order) {
            return res.status(404).json({message:"Order not found"})
        }
        order.paymentStatus=paymentStatus
        await order.save()
        return res.status(200).json({message:"Order status updated successfully",order})
    }catch(error) {
        console.error(error)
        return res.status(500).json({message:"Internal Server Error"})
    }
}
const updateCancelledOrders =  async (req:Request,res:Response) => {
    try {

    }catch(error) {
        console.error(error)
        return res.status(500).json({message:"Internal Server Error"})
    }
}