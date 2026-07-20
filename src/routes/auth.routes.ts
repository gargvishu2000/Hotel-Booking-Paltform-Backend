
import { Router } from "express";
import { signinController, signupController } from "../controller/auth.controller.js";

const route = Router()

route.post("/signup", signupController)
route.post("/signin", signinController)

export default route