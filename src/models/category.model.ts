import mongoose from "mongoose"
import { timeStamp } from "node:console"
const categorySchema = new mongoose.Schema({
    name:{type:String,required:true,unique:true,trim:true},
    description:{type:String,required:true,trim:true},

}, {timestamps:true})
export const categoryModel = mongoose.model("category",categorySchema)