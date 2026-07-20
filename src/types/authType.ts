
import { Role } from "../generated/prisma/index.js";
import type { Request } from "express";

export interface signupType{
    name: string,
    email:string,
    password:string,
    role:Role,
    phone:string
}

export interface siginType{
    email:string,
    password:string,
}

export interface  AuthenticationRequest extends Request{
    id?:string,
    role?:String
}