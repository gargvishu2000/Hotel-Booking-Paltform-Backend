import { success } from "zod";
import type { AuthenticationRequest } from "../types/authType.js";
import type { NextFunction, Response } from "express";

export const authorizeOwner = (req:AuthenticationRequest,res:Response,next:NextFunction)=>{
    if(req.role!=='customer'){
        res.status(403).json({
            success:false,
                data:null,
                error:"FORBIDDEN"
        })
    }
    next()
}

export default authorizeOwner