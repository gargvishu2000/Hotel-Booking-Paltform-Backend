
// entry point of the Application:
import express from "express"
import route from "./routes/auth.routes.js"
import hotelrouter from "./routes/hotel.routes.js";
import bookingRoute from "./routes/booking.routes.js";
import reviewRouter from "./routes/review.route.js";

const app=express();
const PORT = 3000
app.use(express.json())

app.use("/api/auth", route)
app.use("/api/hotels", hotelrouter)
app.use("/api/bookings", bookingRoute)
app.use("/api/review", reviewRouter)


app.listen(PORT, ()=>{
    console.log(`server is serving on ${PORT}`);
})
