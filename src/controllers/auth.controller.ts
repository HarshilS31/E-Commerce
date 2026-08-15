import { Request, Response } from "express"
import bcrypt from "bcryptjs"
import { userModel } from "../models/user.model.js"
import jwt from "jsonwebtoken"
export const registerUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { username, email, password,role } = req.body
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required."
      })
    }
    const existingUser = await userModel.findOne({
      $or: [{ username }, { email }]
    })
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists."
      })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await userModel.create({
      username,
      email,
      password: hashedPassword,
      role
    })
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7d"
      }
    )
    res.cookie("token",token,{
        httpOnly:true,
        secure:false,
        sameSite:"strict",
        maxAge:7*24*60*60*1000 // 7 days
      
    })
    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      user
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    })
  }
}
export const loginUser = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await userModel.findOne({
            $or: [{ username }, { email }]
        });
        if (!existingUser) {
            return res.status(404).json({ message: "User not registered" });
        }
        const validPass = await bcrypt.compare(password, existingUser.password);
        if (!validPass) {
            return res.status(401).json({ message: "Invalid Password" });
        }
        const token = jwt.sign(
            { id: existingUser._id, role: existingUser.role },
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" }
        );
        res.cookie("token",token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 24*60*60*7*1000
        });
        return res.status(200).json({
            message: "Login successful",
            user: {
                id: existingUser._id,
                username: existingUser.username,
                email: existingUser.email
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Error", error });
    }
}
export const logoutUser = (req: Request, res: Response) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "strict"
    });
    return res.status(200).json({ message: "Logout successful" });
}
export const getCurrentUser = async(req:Request,res:Response) => {
  try {
    const {id} = req.user
    const currUser = await userModel.findById(id).select("-password")
    if(!currUser) {
      return res.status(404).json({message:"User not found!"}) 
    }
    return res.status(200).json({message:"User fetched successfully",user:currUser})
  }catch(error) {
    console.error(error)
    return res.status(500).json({message:"Internal Server error"})
  }
}