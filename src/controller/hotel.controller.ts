import {date, string, success, z} from "zod"
import type { AuthenticationRequest } from "../types/authType.js"
import type { Response } from "express"
import { addRoomServices, createHotelService, getAllRooms, getHotelService } from "../services/hotel.services.js"

const hotelObject = z.object({
    name:z.string().min(3),
    description:z.string(),
    city:z.string(),
    country:z.string(),
    amenities:z.array(z.string())
})

const roomObject = z.object({
    roomNumber:z.string(),
    roomType:z.string().min(3),
    pricePerNight:z.number(),
    maxOccupancy:z.number()
})

export const getAllHotelRoms =async(req:AuthenticationRequest,res:Response)=>{
    try {
        const {hotelId} = req.query
    if(!hotelId || typeof hotelId !== 'string'){
       return res.status(404).json({
            success:false,
            data:null,
            error:"HOTEL_NOT_FOUND"
        })
    }
    const hotels = await getAllRooms(hotelId)
    res.status(200).json({
        success:true,
        data: hotels,
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

export const getHotels = async(req:AuthenticationRequest,res:Response)=>{
    try {
        const city = req.query.city as string | undefined
    const country = req.query.country as string | undefined
    const minPrice = req.query.minPrice as string | undefined
    const maxPrice = req.query.maxPrice as string | undefined
    const minRating = req.query.minRating as string | undefined

    const filterHotels  = await getHotelService(
        city,
        country,
        minPrice,
        maxPrice,
        minRating
    )
    const cleanedHotel = filterHotels.map((hotel)=>{
        const roomPrices = hotel.rooms.map((room)=>{
          return Number(room.price_per_night)
        })
        const minHotelRoomPrice = roomPrices.length>0?Math.min(...roomPrices):0

        return {
            id: hotel.id,
            name: hotel.name,
            description:hotel.description,
            city:hotel.city,
            coutry: hotel.country,
            amenities: hotel.amenities,
            rating: hotel.rating,
            totalReviews:hotel.total_reviews,
            minPricePerNight: minHotelRoomPrice
        }
    })
    
    
    res.status(200).json({
        success:true,
        data:cleanedHotel,
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

export const createHotel = async(req:AuthenticationRequest,res:Response)=>{
    try {
        const validateData = hotelObject.parse(req.body)
        const ownerId = req.id;
        if (!ownerId) {
             res.status(401).json({ success: false, data: null, error: "Unauthorized" });
             return;
        }
        
        const hotel_created = await createHotelService({
            ...validateData,
            owner_id:ownerId
    })
        res.status(201).json({
            success:true,
            data:{
                id: hotel_created.id,
                owner_id: hotel_created.owner_id,
                name:hotel_created.name,
                description:hotel_created.description,
                city:hotel_created.city,
                country:hotel_created.country,
                amenities:hotel_created.amenities,
                rating:hotel_created.rating,
                // totalRevies:hotel_created.totalRevies
            },
            error:null
        })
    } catch (error) {
        console.log(error);
        res.status(401).json({
            success:false,
            data:null,
            error:"UNAUTHORIZED"
        })
    }
}

export const addRoomController =async (req:AuthenticationRequest,res:Response)=>{
    try {
        const validateRoom = roomObject.parse(req.body)
        const hotel_Id = req.params.hotelid
        
        if (!hotel_Id || typeof hotel_Id !== 'string') {
            return res.status(400).json({
                error: "INVALID_REQUEST",
                message: "Hotel ID is required in the URL path."
            });
        }
        const roomController = await addRoomServices(validateRoom,hotel_Id)
        console.log("RoomController", roomController);
        
        res.status(201).json({
            success:true,
            data:{
                id: roomController.id,
                hotel_id:roomController.hotel_id,
                room_number:roomController.room_number,
                room_type:roomController.room_type,
                price_per_night:roomController.price_per_night,
                max_occupancy:roomController.max_occupancy
            },
            error:null
        })       
    } catch (error) {
        if(error instanceof Error && error.message==="ROOM_ALREADY_EXIST"){
            res.status(400).json({
                success:false,
                data:null,
                error:"ROOM_ALREADY_EXIST"
            })
        }else if(error instanceof Error && error.message==="HOTEL_NOT_FOUND"){
            res.status(404).json({
                success:false,
                data:null,
                error:"HOTEL_NOT_FOUND"
            })
        }
    }
}