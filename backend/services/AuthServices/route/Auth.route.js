import express from "express";
import { authLogoutcontroller, loginAuthcontroller } from "../controller/AuthController.js";
const authrouter = express.Router()

authrouter.post("/login", loginAuthcontroller)
authrouter.post("/logout", authLogoutcontroller)
export default authrouter