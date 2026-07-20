import { Router } from "express"
import { addRoomController, createHotel, getHotels } from "../controller/hotel.controller.js"
import { authorizeOwner } from "../middleware/hotel.middleware.js"
import { authMiddleware } from "../middleware/auth.middleware.js"

const hotelrouter = Router()

hotelrouter.post("",authMiddleware ,authorizeOwner, createHotel)
hotelrouter.post('/:hotelid/rooms',authMiddleware,authorizeOwner, addRoomController)
hotelrouter.get("", getHotels)

export default hotelrouter