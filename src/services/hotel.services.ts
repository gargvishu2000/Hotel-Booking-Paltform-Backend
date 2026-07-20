
import type { hotelCreation } from "../types/hotelType.js"
import { prisma } from "../lib/prisma.js"
import type { AddRoom } from "../types/hotelType.js"
import type { bookingType } from "../types/hotelType.js"


export const getAllRooms = async(hotelId:string)=>{
    const hotelRoom = await prisma.room.findMany({
        where:{
            hotel_id: hotelId
        }
    })
    return hotelRoom
}

export const getHotelService = async (
    city?: string,
    country?: string,
    minPrice?: string,
    maxPrice?: string,
    minRating?: string
) => {
    const whereClause: any = {};

    if (city) whereClause.city = city;
    if (country) whereClause.country = country;
    if (minRating) whereClause.rating = { gte: Number(minRating) };

    let priceFilter: any = undefined;

    if (minPrice || maxPrice) {
        priceFilter = {}; 
        if (minPrice) priceFilter.gte = Number(minPrice); 
        if (maxPrice) priceFilter.lte = Number(maxPrice); 
    }

    if (priceFilter) {
        whereClause.rooms = {
            some: {
                price_per_night: priceFilter
            }
        };
    }

    // 👇 Branch the actual query execution so TypeScript never encounters an "undefined" property value
    if (priceFilter) {
        return await prisma.hotel.findMany({
            where: whereClause,
            include: {
                rooms: {
                    where: {
                        price_per_night: priceFilter
                    }
                }
            }
        });
    }

    // Fallback block when no price limits are passed (includes all rooms naturally)
    return await prisma.hotel.findMany({
        where: whereClause,
        include: {
            rooms: true
        }
    });
};  

export const createHotelService = async (userData: hotelCreation) => {
    const createHotel = await prisma.hotel.create({
        data: {...userData}
    })
    
    return createHotel
}

export const addRoomServices = async (data: AddRoom, hotel_Id: string) => {
    const checkHotel = await prisma.hotel.findUnique({
        where:{
            id:hotel_Id
        }
    })
    if(!checkHotel){
        throw new Error("HOTEL_NOT_FOUND")
    }
    const room = await prisma.room.findUnique({
        where:{
            hotel_id_room_number:{
                hotel_id: hotel_Id,
                room_number: data.roomNumber
            }
        }
    })
    if (room) {
        throw new Error("ROOM_ALREADY_EXIST")
    }

    const addRoomServices = await prisma.room.create({
        data: {
            room_number: data.roomNumber,
            hotel_id: hotel_Id,
            room_type: data.roomType,
            price_per_night: data.pricePerNight,
            max_occupancy: data.maxOccupancy
        }
    })
    return addRoomServices;
}