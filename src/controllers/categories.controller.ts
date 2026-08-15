import { categoryModel } from "../models/category.model.js"
import {Request,Response} from "express"
import mongoose from "mongoose"
export const createCategory = async (req:Request,res:Response) => {
    try {
        const {name,description} = req.body
        const categoryExists = await categoryModel.findOne({name})
        if(!name || !description) {
            return res.status(400).json({message:"Incomplete category details"})
        }
        if(categoryExists) {
            return res.status(409).json({message:"Category already exists"})
        }
        const category = await categoryModel.create({
            name,
            description
        })
        return res.status(201).json({message:"Category created successfully",category})
    }catch(error) {
        console.error(error)
        return res.status(500).json({message:"Internal Server error"})
    }

}
export const getAllCategories = async(req:Request,res:Response) => {
    try{
        const categories = await categoryModel.find()
        return res.status(200).json({message:`All categories fetched successfully`,categories})
    }catch(error) {
        return res.status(500).json({message:"Internal server error"})
    }
}
export const getCategoryByID = async (req:Request,res:Response) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({
            message: "Invalid category ID",
          })
       }
        const category = await categoryModel.findById(id)
        return  res.status(200).json({message:"Category fetched successfully",category})
        
    }catch(error) {
        console.error(error)
        return res.status(500).json({message:`Internal server error:${error}`})
    }
}
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid category ID",
      })
    }
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        message: "Please provide all fields",
      })
    }
    const category = await categoryModel.findById(id);
    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      })
    }
    const existingCategory = await categoryModel.findOne({ name });
    if (
      existingCategory &&
      existingCategory._id.toString() !== id
    ) {
      return res.status(409).json({
        message: "Category already exists",
      })
    }
    category.name = name;
    category.description = description;
    await category.save();
    return res.status(200).json({
      message: "Category updated successfully",
      category,
    })
  } catch (error) {
    console.error("Error(updateCategory):", error);

    return res.status(500).json({
      message: "Internal Server Error",
    })
  }
}
export const deleteCategory = async (req:Request,res:Response) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0]: req.params.id
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({
            message: "Invalid category ID",
          })
        }
        const deletedCategory =await categoryModel.findOneAndDelete({_id:id})
        if(!deletedCategory) {
            return res.status(404).json({message:"Category not found!"})
        }
        return res.status(200).json({message:"Category deleted successfully"})
    }catch(error) {
        console.error(error)
        return res.status(500).json({message:"Internal Server error",error})
    }
  
}