import express from "express";
import { addCredits, authLogoutcontroller, deductCredits, loginAuthcontroller } from "../controller/AuthController.js";
const authrouter = express.Router()

authrouter.post("/login", loginAuthcontroller)
authrouter.post("/logout", authLogoutcontroller)
authrouter.post('/user/deduct-credits', deductCredits)
authrouter.post('/user/add-credits', addCredits)
export default authrouter