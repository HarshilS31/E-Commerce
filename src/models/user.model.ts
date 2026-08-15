import mongoose from "mongoose"
const userSchema = new mongoose.Schema({
    username:{type:String,required:true,unique:true},
    email:{type:String,requires:true,unique:true},
    password:{type:String,requires:true,unique:true},
    role:{type:String,required:true,enum:["user","admin"]}
})
export const userModel = mongoose.model("user",userSchema)