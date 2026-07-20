
import type { signupType, siginType } from "../types/authType.js"
import { prisma } from "../lib/prisma.js"
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const secret = process.env.SECRET

export const signinService = async (data: siginType) => {
    const existUser = await prisma.user.findUnique({
        where: {
            email: data.email
        }
    })
    if (!existUser) {
        throw new Error("INVALID_CREDENTIALS")
    }
    const checkPassword = await bcrypt.compare(data.password, existUser.password)
    if (!checkPassword) {
        throw new Error("INVALID_CREDENTIALS")
    }
    if (!secret) {
        throw new Error("SECRET environment variable is not defined!");
    }
    const payload = { userId: existUser.id, userRole: existUser.role }
    const token = jwt.sign(payload, secret, { expiresIn: '1d' })
    return {
        existUser,
        token
    }
}

export const signupService = async (data: signupType) => {
    const existingUser = await prisma.user.findUnique({
        where: {
            email: data.email
        }
    })

    if (existingUser) {
        throw new Error("User already exists")
    }
    const hashedPassword = await bcrypt.hash(data.password, 10)
    const newUser = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
            role: data.role,
            phone: data.phone
        }
    })
    return newUser
}