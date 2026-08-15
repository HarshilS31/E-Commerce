import { productModel } from "../models/product.model.js"
import { categoryModel } from "../models/category.model.js"
import {Request,Response} from  "express"
import mongoose from "mongoose"
export const getProducts = async (req: Request, res: Response) => {
    try {
        const {search,category,minPrice,maxPrice,sort,page,limit} = req.query
        const filter: any = {}
        if (search) {
            filter.name = {$regex: search,$options: "i"}
        }
        if (category) {
            if (
                typeof category !== "string" ||
                !mongoose.Types.ObjectId.isValid(category)
            ) {
                return res.status(400).json({message: "Invalid category ID"})  
            }
            filter.category = category
        }
        if (minPrice || maxPrice) {
            filter.price = {}
            if (minPrice) {
                const min = Number(minPrice)
                if (isNaN(min) || min < 0) {
                    return res.status(400).json({message: "Invalid minimum price"})   
                }
                filter.price.$gte = min
            }
            if (maxPrice) {
                const max = Number(maxPrice)
                if (isNaN(max) || max < 0) {
                    return res.status(400).json({message: "Invalid maximum price"})
                }
                filter.price.$lte = max
            }
            if (
                filter.price.$gte !== undefined &&
                filter.price.$lte !== undefined &&
                filter.price.$gte > filter.price.$lte
            ) {
                return res.status(400).json({
                    message: "Minimum price cannot be greater than maximum price"
                })
            }
        }
        const currentPage = page ? Number(page) : 1
        const itemsPerPage = limit ? Number(limit) : 10
        if (isNaN(currentPage) || isNaN(itemsPerPage) || currentPage < 1 || itemsPerPage < 1) {
            return res.status(400).json({message: "Invalid page or limit"})
        }
        let sortOption: 1 | -1 = 1
        if (sort) {
            if (sort === "price_asc") {
                sortOption = 1
            } else if (sort === "price_desc") {
                sortOption = -1
            } else {
                return res.status(400).json({
                    message: "Invalid sorting option"
                })
            }
        }
        const skip = (currentPage - 1) * itemsPerPage
        const products = await productModel
            .find(filter)
            .populate("category", "name description")
            .sort({ price: sortOption })
            .skip(skip)
            .limit(itemsPerPage)
        const totalProducts = await productModel.countDocuments(filter)
        const totalPages = Math.ceil(
            totalProducts / itemsPerPage
        )
        return res.status(200).json({ message: "Products fetched successfully",products,pagination: {
                currentPage,
                itemsPerPage,
                totalProducts,
                totalPages
            }
        })
    } catch (error) {
        console.error(error)

        return res.status(500).json({
            message: "Internal Server Error!"
        })
    }
}