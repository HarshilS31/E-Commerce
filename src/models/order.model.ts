import mongoose from "mongoose"
const orderItemsSchema = new mongoose.Schema({
    product: {type: mongoose.Schema.Types.ObjectId,ref: "product",required: true},
    quantity: {type: Number,min:1,required: true},
    price: {type: Number,required: true}
})
const orderSchema = new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:"user",required:true},
    items : {type:[orderItemsSchema],required:true},
    totalAmount:{type:Number,min:0,required:true},
    status:{type:String,enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],required:true,default:"pending"},
    paymentStatus:{type:String,enum: ["simulated", "pending"],required:true,default:"pending"},
})
export const orderModel= mongoose.model("order",orderSchema)