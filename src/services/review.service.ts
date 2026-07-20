import { prisma } from "../lib/prisma.js"

export const putReviewService = async(booking_id:string,rating:string,comment:string,userId:string)=>{
    const existingReview = await prisma.reviews.findUnique({
        where:{
            user_id_booking_id:{
                user_id:userId,
                booking_id: booking_id
            }
        }
    })
    if (existingReview) {
        throw new Error("ALREADY_REVIEWED");
    }
    const getBooking = await prisma.booking.findUnique({
        where:{
            id:booking_id
        }
    })
    if(!getBooking){
        throw new Error("BOOKING_NOT_FOUND")
    }

    if(getBooking.check_out_date.getTime() < Date.now() || getBooking.status==='cencelled'){
        throw new Error("BOOKING_NOT_ELIGIBLE")
    }
    const hotelId = getBooking?.hotel_id
    const createReview = await prisma.reviews.create({
        data:{
            user_id:userId,
            hotel_id: hotelId,
            booking_id: booking_id,
            rating:rating,
            comment:comment,
            create_at: Date.now()
        }
    })
    return createReview
}