
export interface bookingType{
    roomId: string,
    checkInDate: number,
    checkOutDate:number,
    guests: number
}

export interface hotelCreation {
    owner_id: string;
    name: string,
    description:string,
    city:string,
    country:string,
    amenities: string[]
}

export interface AddRoom{
    roomNumber:string,
    roomType:string,
    pricePerNight:number,
    maxOccupancy:number
}