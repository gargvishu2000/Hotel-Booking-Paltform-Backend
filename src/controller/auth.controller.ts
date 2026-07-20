import { success, z } from 'zod'
import type { Request, Response } from 'express';
import { signinService, signupService } from '../services/auth.services.js';
import { Role } from "../generated/prisma/index.js";

const signupObject = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be atleast 6 characters"),
    role: z.nativeEnum(Role),
    phone: z.string()
})

const signinObject = z.object({
    email:z.string().email("Invalid email format"),
    password:z.string().min(6,"Password must be atleast 6 characters")
})
export const signinController = async(req:Request,res:Response)=>{
    try {
        const validateData = signinObject.parse(req.body)
        const {existUser,token} = await signinService(validateData)
        res.status(201).json({
            success:true,
            data:{
                token: token,
                user:{
                    id: existUser.id,
                    name:existUser.name,
                    email:existUser.email,
                    role:existUser.role
                }
            },
            error:null
        })
    } catch (error) {
        if(error instanceof Error && error.message==="INVALID_CREDENTIALS"){
            res.status(401).json({
                success:false,
                data:null,
                error:"INVALID_CREDENTIALS"
            })
        }else{
            res.status(401).json({
                success:false,
                data:null,
                error:"INVALID_REQUEST"
            })
        }
    }
}

export const signupController = async (req: Request, res: Response) => {
    try {
        const validatedData = signupObject.parse(req.body)
        const newUser = await signupService(validatedData)
        res.status(201).json({
            success: true,
            data: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                password: newUser.password,
                role: newUser.role,
                phone: newUser.phone
            },
            error: null
        })
    } catch (error: any) {
        if (error instanceof Error && error.message === "User already exists") {
            res.status(409).json({
                success: false,
                data: null,
                message: "INVALID_REQUEST"
            })
            return
        }
        if (error instanceof z.ZodError) {
            res.status(401).json({
                "success": false,
                "data": null,
                "error": "EMAIL_ALREADY_EXISTS"
            })
            return
        }
    }
}

