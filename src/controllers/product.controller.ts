import { productModel } from "../models/product.model.js"
import { categoryModel } from "../models/category.model.js"
import {Request,Response} from  "express"
import mongoose from "mongoose"
export const createProduct = async (req:Request,res:Response)=>{
    try {
        const {name,description,price,stock,category,images} = req.body
        if(!name || !description || !price || !images) {
            return res.status(400).json({message:"Incomplete product details"})
        }
        if( price<=0) {
            return res.status(400).json({message:"Price can not be negative or 0"})
        }
        if(images.length===0) {
            return res.status(400).json({message:"No product images recieved"})
        }
        if(stock < 0) {
            return res.status(400).json({message:"Stock can not be negative "})
        }
        if (!mongoose.Types.ObjectId.isValid(category)) {
            return res.status(400).json({
                message: "Invalid category ID"
            });
        }
        const existingCategory = await categoryModel.findById(category);
        if (!existingCategory) {
            return res.status(404).json({
                message: "Category not found"
            });
        }
        const existingProduct = await productModel.findOne({ name });
        if (existingProduct) {
            return res.status(409).json({
                message: "Product already exists"
            });
        }
        const product =await productModel.create({
            name,description,price,stock,category,images
        })
        return res.status(201).json({message:"Product created successfully",product})
    }catch(error){
        console.error(error)
        return res.status(500).json({message:"Internal Server error"})
    }
}
export const getAllProducts = async(req:Request,res:Response) => {
    try {
        const products = await  productModel.find().populate("category","name desccription")
        return res.status(200).json({message:"All products fetched successfully",products})
    }catch(error) {
        console.error(error)
        res.status(500).json({message:"Internal Server Error"})
    }
}
export const getProuctbyId = async  (req:Request,res:Response) => {
    try {
        const rawId = req.params.id
        const id = Array.isArray(rawId) ? rawId[0] : rawId
        if(!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({message:"Invalid Product id"})
        }
        const products = await productModel.findById({ _id: id }).populate('category')
        if(!products) {
            return res.status(404).json({message:"Product not found"})
        }
        return res.status(200).json({message:"Product fetched successfully",products})
    }catch(error) {
        console.error(error)
        return res.status(500).json({message:"Internal Server Error"})
    }
}
export const updateProduct = async (req:Request,res:Response) => {
    try {
        const rawId = req.params.id
        const id = Array.isArray(rawId) ? rawId[0] : rawId
        if(!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({message:"Invalid Product id"})
        }
        const products = await productModel.findById({_id:id})
        if (!products) {
            return res.status(404).json({
                message: "Product not found"
            })
        }
        await products.populate("category")
        const { name, description, price, stock, category, images } = req.body
        if(!name || !description || !price || !images) {
            return res.status(400).json({message:"Incomplete product details"})
        }
        if( price<=0) {
            return res.status(400).json({message:"Price can not be negative or 0"})
        }
        if(images.length===0) {
            return res.status(400).json({message:"No product images recieved"})
        }
        if(stock < 0) {
            return res.status(400).json({message:"Stock can not be negative "})
        }
        if (!mongoose.Types.ObjectId.isValid(category)) {
            return res.status(400).json({
                message: "Invalid category ID"
            })
        }
        const existingCategory = await categoryModel.findById(category)
        if (!existingCategory) {
            return res.status(404).json({
                message: "Category not found"
            })
        }
        products.name = name
        products.description = description
        products.price = price
        products.stock = stock
        products.category = category
        products.images = images
        await products.save()
        res.status(200).json({message:"Product details updated successfully",product:products})
    }catch(error) {
        console.error(error)
        return res.status(500).json({message:"Internal Server Error!"})
    }
}
export const deleteProduct = async(req:Request,res:Response) => {
    try {
        const rawId = req.params.id
        const id = Array.isArray(rawId) ? rawId[0] :rawId
        if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({message:"Invalid Product id"})
        }
        const deletedProduct =await productModel.findOneAndDelete({_id:id})
        if(!deletedProduct)  {
            return res.status(404).json({message:"Product not found"})
        }
        return res.status(200).json({message:"Product deleted successfully"})
    }catch(error) {
        console.error(error)
        return res.status(500).json({message:"Internal Server Error!"})
    }
}
export const getProductsByCategory =  async(req:Request,res:Response) => {
    try {
        const rawCategoryId = req.query.category
        const categoryId = Array.isArray(rawCategoryId)
            ? typeof rawCategoryId[0] === "string"
                ? rawCategoryId[0]
                : undefined
            : typeof rawCategoryId === "string"
                ? rawCategoryId
                : undefined

        if (!categoryId || !mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({ message: "Invalid category ID" })
        }
        const existingCategory = await categoryModel.findById(categoryId)
        if (!existingCategory) {
            return res.status(404).json({ message: "Category not found" })
        }
        const products = await productModel.find({ category: categoryId }).populate("category", "name description")
        if(!products) {
            return res.status(404).json({message:"Products not found"})
        }
        return res.status(200).json({
            message: "Products fetched successfully",
            products,
        })
    }catch (error) {   
        console.error(error)
        return res.status(500).json({message:"Internal Server Error!"})
    }
}
export const searchProducts = async (req: Request, res: Response) => {
    try {
        const rawName = req.query.search
        const search = Array.isArray(rawName)
            ? typeof rawName[0] === "string"
                ? rawName[0]
                : undefined
            : typeof rawName === "string"
                ? rawName
                : undefined

        if (!search || !search.trim()) {
            return res.status(400).json({ message: "Invalid/Incomplete product name" })
        }
        const products = await productModel.find({ name:{ $regex:search, $options: "i" }})
        if(!products) {
            return res.status(404).json({message:"Product not found"})
        }
        return res.status(200).json({message:"Products fetched successfully",products})

    }catch (error) {   
        console.error(error)
        return res.status(500).json({message:"Internal Server Error!"})
    }

}
export const searchbyPrice = async (req: Request, res: Response) => {
    try {
        const minPrice = Number(req.query.minPrice)
        const maxPrice = Number(req.query.maxPrice)
        if(isNaN(minPrice) || isNaN(maxPrice)) {
            return res.status(400).json({message:"Invalid price details"})
        } 
        if(minPrice > maxPrice) {
            return res.status(400).json({message:"Min price can not be greater than max Price"})
        }
        const products = await  productModel.find({
            price: {
            $gte: minPrice,
            $lte: maxPrice
          }
    })
        if(products.length===0) {
            return res.status(404).json({message:"Products not found"})
        }
        return res.status(200).json({message:"Products fetched successfully",products})
    }catch(error) {
        console.error(error)
        return res.status(500).json({message:"Internal server error"})
    }
}
export const sortByPrice = async (req: Request, res: Response) => {
    try {
        const sortOrder = req.query.sort as string
        if(!sortOrder || (sortOrder!=="price_asc" && sortOrder!=="price_desc")) {
            return res.status(400).json({message:"Invalid input for sorting"})
        }
        const order = sortOrder==="price_asc" ? 1:-1
        const products = await productModel.find().sort({price:order})
        return res.status(200).json({message:"Products fetched successfully",products})
    }catch (error) {   
        console.error(error)
        return res.status(500).json({message:"Internal Server Error!"})
    }
}
export const pagination = async(req:Request,res:Response) => {
    try {
        const page =  Number(req.query.page)
        const limit =  Number(req.query.limit)
        console.log("page:", req.query.page, "limit:", req.query.limit)
        if(isNaN(page) || isNaN(limit)  || page<1 || limit<1) {
            return res.status(400).json({message:"Invalid page or limit"})
        }
        const productsPerPage = await productModel.find().skip((page-1)*limit).limit(limit)
        return res.status(200).json({message:"Products fetched successfully",productsPerPage})
    }catch (error) {   
        console.error(error)
        return res.status(500).json({message:"Internal Server Error!"})
    }
}