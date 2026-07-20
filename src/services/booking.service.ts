import { error } from "node:console"
import { prisma } from "../lib/prisma.js"
import type { bookingType } from "../types/hotelType.js"

export const cancelBookingService = async (booking_id: string) => {

    const getCurrentBooking = await prisma.booking.findUnique({
        where: {
            id: booking_id
        }
    })
    if (!getCurrentBooking) {
        throw new Error("BOOKING_NOT_FOUND")
    }
    if(getCurrentBooking.status==='cancelled'){
        throw new Error("ALREADY_CANCELLED")
    }
    const now = new Date();
    const checkIn = new Date(getCurrentBooking.check_in_date);

    const hoursUntilCheckIn = (checkIn.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilCheckIn < 24) {
        throw new Error("CANCELLATION_DEADLINE_PASSED")
    }
    getCurrentBooking.status = "cancelled"
    return getCurrentBooking
}

export const getAllUserBookingService = async (userId: string) => {

    const getBooking = await prisma.booking.findMany({
        where: {
            user_id: userId
        }
    })
    return getBooking
}

export const getBookingService = async (data: bookingType, userId: string) => {
    const checkRoom = await prisma.room.findUnique({
        where: {
            id: data.roomId
        }
    })
    if (!checkRoom) {
        throw new Error("ROOM_NOT_FOUND")
    }
    
    if (data.guests > checkRoom.max_occupancy) {
        throw new Error("INVALID_CAPACITY")
    }
    const currentDate = Date.now()
    const date = data.checkOutDate
    const inDate = data.checkInDate
    if (date < currentDate) {
        throw new Error("INVALID_DATES")
    }
    if (inDate > date) {
        throw new Error("INVALID_DATES")
    }
    // now we have hotel_id also
    const hotel_Id = checkRoom.hotel_id
    const checkInDateObj = new Date(data.checkInDate)
    const checkOutDateObj = new Date(data.checkOutDate)

    const msPerDay = 1000 * 60 * 60 * 2
    const totalNights = Math.ceil((checkOutDateObj.getTime() - checkInDateObj.getTime()) / msPerDay)
    const totalPrice = totalNights * Number(checkRoom.price_per_night)

    const booking = await prisma.booking.create({
        data: {
            user_id: userId,
            room_id: data.roomId,
            hotel_id: hotel_Id,
            check_in_date: checkInDateObj,
            check_out_date: checkOutDateObj,
            guests: data.guests,
            total_price: totalPrice,
            status: "confirmed",
        }
    })
    return booking
}