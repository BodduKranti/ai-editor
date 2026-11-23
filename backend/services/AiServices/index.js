import express from 'express'
import dotenv from 'dotenv'
import { AiDbConnect } from './config/DB.js'
import router from './routes/Ai.routes.js'
dotenv.config()
const app = express()

app.use(express.json())

const PORT = process.env.PORT || 8004

app.get("/", (_, res) => {
    return res.status(200).json({ message: "This server is running on AI SERVICES nice" })
})

app.use("/", router)

app.listen(PORT, () => {
    AiDbConnect()
    console.log(`This AI services running on ${PORT}`)
})
