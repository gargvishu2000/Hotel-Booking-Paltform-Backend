import type { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import 'dotenv/config';
import type { AuthenticationRequest } from "../types/authType.js";

const secret = process.env.SECRET;
export const authMiddleware = async (req: AuthenticationRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization
        
        if (!authHeader) {
            res.status(401).json({
                message: "INVALID_TOKEN"
            })
            return
        }
        const token = authHeader
        if (!secret) {
            throw new Error("SECRET environment variable is not defined!");
        }
        if (!token) {
            throw new Error("SECRET environment variable is not defined!");
        }
        const checkToken = jwt.verify(token, secret) as any
        req.id = checkToken.userId
        req.role = checkToken.userRole
        next()

    } catch (error) {
        res.status(401).json({
            success: false,
            data: null,
            error: "UNAUTHORIZED"
        });
    }
}