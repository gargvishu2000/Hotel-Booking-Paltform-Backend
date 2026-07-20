import type { NextFunction, Response } from "express";
import type { AuthenticationRequest } from "../types/authType.js";
import { success } from "zod";


export const authorizeOwner = (req:AuthenticationRequest,res:Response,next:NextFunction)=>{
    if(req.role !=='owner'){
        res.status(403).json({
            success:false,
            data:null,
            error:"FORBIDDEN"
        })
        return ;
    }
    next()

}