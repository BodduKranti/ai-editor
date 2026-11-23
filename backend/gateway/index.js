import express from 'express'
import cors from 'cors'
import cookieparser from 'cookie-parser'
import dotenv from 'dotenv'
import morgan from 'morgan'
import proxy from 'express-http-proxy'
import { protectMiddleware } from './middleware/auth.middleware.js'
import { userController } from './controller/usercontroller.js'
import { proxywithHEader } from './utils/proxyWithHeader.js'

dotenv.config()

const PORT = process.env.PORT || 8000

const app = express()
app.use(express.json())

//cors
app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Accept", "x-user-id", "Authorization"],
    credentials: true
}))

app.use(cookieparser())
app.use(morgan("dev"))

app.get("/", (_, res) => {
    return res.status(200).json({ message: "This the gateway section" })
})

//AUTH USER SERVICES
app.use("/api/auth", proxy(process.env.AUTH_SERVICE));
app.get("/api/me", protectMiddleware, userController)

//PROJECT SERVICES
app.use("/api/project", protectMiddleware, proxywithHEader(process.env.PROJECT_SERVICE))
//FILE SERVICES
app.use("/api/file", protectMiddleware, proxywithHEader(process.env.FILE_SERVICE))

//AI FILE SERVICES
app.use("/api/ai", protectMiddleware, proxywithHEader(process.env.AI_FILE_SERVICE))



app.listen(PORT, () => {
    console.log(`This server is running on ${PORT}`)
})