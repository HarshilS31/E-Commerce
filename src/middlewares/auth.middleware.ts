import {Request, Response, NextFunction} from "express"
import jwt,{JwtPayload} from "jsonwebtoken"
export const authMiddleware = async(req:Request,res:Response,next:NextFunction) => {
    const token = req.cookies.token;
    if(!token) {
        return res.status(401).json({message:"Unauthorised,Please log in"})
    }
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET as string) as JwtPayload
        req.user = {
            id:decoded.id,
            role:decoded.role,
        }
        next()
    }catch(error) {
        return res.status(401).json({message:`Invalid or expired token`})
    }
   

}