
import { cancelBookingService, getAllUserBookingService, getBookingService } from "../services/booking.service.js"
import type { AuthenticationRequest } from "../types/authType.js"
import type { Response } from "express"
import type { bookingType } from "../types/hotelType.js"
import { success } from "zod"

export const cancelBookingController = async(req:AuthenticationRequest,res:Response)=>{
    try {
        const {booking_id} = req.params
    if(!booking_id || typeof booking_id!=='string'){
        return res.status(401).json({
            success:false,
            data:null,
            error:"UNAUTHORIZED"
        })
    }
    const bookingStatus = await cancelBookingService(booking_id)
    res.status(200).json({
        success:true,
        data:{
            id:bookingStatus.id,
            status: bookingStatus.status,
            cancelledAt: Date.now()
        }
    })
    } catch (error) {
        if(error instanceof Error && error.message==="CANCELLATION_DEADLINE_PASSED"){
            res.status(400).json({
                success:false,
                data:null,
                error: "CANCELLATION_DEADLINE_PASSED"
            })
        }else if(error instanceof Error && error.message==="ALREADY_CANCELLED"){
            res.status(400).json({
                success:false,
                data:null,
                error: "ALREADY_CANCELLED"
            })
        }
    }
}

export const getAllBookings = async(req:AuthenticationRequest,res:Response)=>{
    try {
        const userId = req.id
        if(!userId){
            return res.status(401).json({
                success:false,
                data:null,
                error:"UNAUTHORIZED"
            })
        }
        const getAllUserbooking = await getAllUserBookingService(userId)
        res.status(200).json({
            success:true,
            data: getAllUserbooking,
            error:null
        })
    } catch (error) {
        res.status(401).json({
            success:false,
            data:null,
            error:"UNAUTHORIZED"
        })
    }
}


export const bookingController = async (req: AuthenticationRequest, res: Response) => {
    try {
        const { roomId, checkInDate, checkOutDate, guests } = req.body
        const userId = req.id
        if (!userId) {
            return res.status(400).json({
                success: true,
                data: null,
                error: "INVALID_REQUEST"
            })
        }
        const createBooking = await getBookingService({
            roomId,
            checkInDate,
            checkOutDate,
            guests
        },
            userId
        )
        res.status(200).json({
            success: true,
            data: {
                id: createBooking.id,
                user_id: userId,
                room_id: roomId,
                hotel_id: createBooking.hotel_id,
                check_in_date: createBooking.check_in_date,
                check_out_date: createBooking.check_out_date,
                guests: createBooking.guests,
                total_price: createBooking.total_price,
                status: createBooking.status,
                booking_date: createBooking.booking_date
            }
        })
    } catch (error) {
        if (error instanceof Error && error.message === "ROOM_NOT_AVAILABLE") {
            res.status(400).json({
                success: false,
                data: null,
                error: "ROOM_NOT_AVAILABLE"
            })
        } else if (error instanceof Error && error.message === "INVALID_CAPACITY") {
            res.status(400).json({
                success: false,
                data: null,
                error: "INVALID_CAPACITY"
            })
        }
            else if (error instanceof Error && error.message === "INVALID_DATES") {
            res.status(400).json({
                success: false,
                data: null,
                error: "INVALID_DATES"
            })
        }else{
            res.json({
                success:false,
                data:null,
                error:"UNAUTHORIZED"
            })
        }
    }
}