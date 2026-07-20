import { Router } from "express"
import { bookingController, cancelBookingController, getAllBookings } from "../controller/booking.controller.js"
import authorizeOwner from "../middleware/booking.middleware.js"

const bookingRoute = Router()

bookingRoute.post("",authorizeOwner, bookingController)
bookingRoute.get("",authorizeOwner, getAllBookings)
bookingRoute.put("/:booking_id/cancel",  cancelBookingController)


export default bookingRoute