import { success } from "zod"
import { putReviewService } from "../services/review.service.js"
import type { AuthenticationRequest } from "../types/authType.js"
import type { Response } from "express"
import { error } from "node:console"


export const reviewController = async (req:AuthenticationRequest,res:Response) => {
   try {
    const {booking_id,rating,comment} = req.body
    const userId = req.id
    if(!userId){
        return res.status(401).json({
            "success": false,
            "data": null,
            "error": "UNAUTHORIZED"
        })
    }
    const createReview = await putReviewService(
        booking_id,
        rating,
        comment,
        userId
    )
    res.status(201).json({
        success:true,
        data:{
            userId: userId,
            hotelId: createReview.hotel_id,
            bookingId:booking_id,
            rating:createReview.rating,
            comment:createReview.comment,
            createdAt: Date.now()
        },
        error:null
    })
   } catch (error) {
    if(error instanceof Error && error.message==="ALREADY_REVIEWED"){
        res.status(400).json({
            success:false,
            data:null,
            error:"ALREADY_REVIEWED"
        })
    }else if(error instanceof Error && error.message==="BOOKING_NOT_FOUND"){
        res.status(401).json({
            success:false,
            data:null,
            error:"BOOKING_NOT_FOUND"
        })
    }else {
        res.status(400).json({
            success:false,
            data:null,
            error:"INVALID_SCHEMA"
        })
    }
   }
}