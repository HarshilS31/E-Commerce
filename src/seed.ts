import  dotenv from "dotenv"
import mongoose from "mongoose"
import connectDB from "./db/db.js"
import dns from "dns"
import { categoryModel } from "./models/category.model.js"
import { productModel } from "./models/product.model.js"
dotenv.config()
dns.setServers(['8.8.8.8','8.8.4.4'])
const seedDatabase = async () => {
    try {
        await connectDB()
        await productModel.deleteMany({})
        await categoryModel.deleteMany({})
        console.log("Old products and categories cleared")
        const categories = await categoryModel.insertMany([
            {
                name: "Electronics",
                description: "Electronic gadgets and devices"
            },
            {
                name: "Fashion",
                description: "Clothing and fashion products"
            },
            {
                name: "Stationary",
                description: "Books, notebooks and office supplies"
            },
            {
                name: "Groceries",
                description: "Daily household and grocery products"
            }
        ])

        console.log(`${categories.length} categories created`)
        const electronics = categories.find(
            category => category.name === "Electronics"
        )!._id

        const fashion = categories.find(
            category => category.name === "Fashion"
        )!._id
        const stationary = categories.find(
            category => category.name === "Stationary"
        )!._id
        const groceries = categories.find(
            category => category.name === "Groceries"
        )!._id
        const products = await productModel.insertMany([
            {
                name: "iPhone 16 Pro",
                description: "Apple flagship smartphone",
                price: 129999,
                stock: 15,
                category: electronics,
                images: "iphone16.jpg",
                inStock: true
            },
            {
                name: "Samsung Galaxy S25",
                description: "Samsung flagship smartphone",
                price: 89999,
                stock: 20,
                category: electronics,
                images: "galaxy-s25.jpg",
                inStock: true
            },
            {
                name: "Sony WH-1000XM5",
                description: "Premium wireless noise cancelling headphones",
                price: 29999,
                stock: 12,
                category: electronics,
                images: "sony-headphones.jpg",
                inStock: true
            },
            {
                name: "Mechanical Keyboard",
                description: "RGB mechanical keyboard",
                price: 5999,
                stock: 30,
                category: electronics,
                images: "keyboard.jpg",
                inStock: true
            },

            {
                name: "Oversized Cotton Hoodie",
                description: "Premium cotton oversized hoodie",
                price: 1999,
                stock: 40,
                category: fashion,
                images: "hoodie.jpg",
                inStock: true
            },
            {
                name: "Classic Denim Jacket",
                description: "Classic blue denim jacket",
                price: 2999,
                stock: 25,
                category: fashion,
                images: "denim-jacket.jpg",
                inStock: true
            },
            {
                name: "Running Shoes",
                description: "Lightweight running shoes",
                price: 3499,
                stock: 18,
                category: fashion,
                images: "running-shoes.jpg",
                inStock: true
            },

            {
                name: "Premium A5 Notebook",
                description: "Hardcover notebook with 200 pages",
                price: 399,
                stock: 100,
                category: stationary,
                images: "notebook.jpg",
                inStock: true
            },
            {
                name: "Blue Ball Pen Pack",
                description: "Pack of 10 smooth writing pens",
                price: 149,
                stock: 150,
                category: stationary,
                images: "pens.jpg",
                inStock: true
            },
            {
                name: "Desk Organizer",
                description: "Multi-compartment desk organizer",
                price: 599,
                stock: 50,
                category: stationary,
                images: "desk-organizer.jpg",
                inStock: true
            },

            {
                name: "Organic Rice 5kg",
                description: "Premium organic rice",
                price: 699,
                stock: 60,
                category: groceries,
                images: "rice.jpg",
                inStock: true
            },
            {
                name: "Almonds 500g",
                description: "Premium California almonds",
                price: 499,
                stock: 45,
                category: groceries,
                images: "almonds.jpg",
                inStock: true
            }
        ])

        console.log(`${products.length} products created`)
        console.log("✅ Database seeded successfully")

    } catch (error) {
        console.error("❌ Seeding failed:", error)
    } finally {
        await mongoose.connection.close()
        console.log("MongoDB connection closed")
    }
}
seedDatabase()