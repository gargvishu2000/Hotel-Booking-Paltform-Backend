import { Router } from "express";
import { reviewController } from "../controller/review.controller.js";

const reviewRouter = Router()

reviewRouter.post("", reviewController)

export default reviewRouter