import {Request, Response, NextFunction} from "express"
export const isAdmin =(req:Request,res:Response,next:NextFunction) => {
    try {
      const {role} = req.user
        if(role!=="admin") {
            return res.status(403).json({message:"Admin access denied!"})
        }
        next()
    }catch(error) {
        console.error(error)
        res.status(500).json({message:"Internal server error"})
    }
}