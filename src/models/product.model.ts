import mongoose from "mongoose"
const productSchema = new mongoose.Schema( {
    name:{type:String,required:true,trim:true},
    description:{type:String,required:true,trim:true},
    price:{type:Number,required:true,min:0},
    stock:{type:Number,required:true},
    category:{type:mongoose.Schema.Types.ObjectId,ref:"category",required:true},
    images:{type:[String],default:[],required:true},
},{timestamps:true})
export const productModel = mongoose.model("product",productSchema)