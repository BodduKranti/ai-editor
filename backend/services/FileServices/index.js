import express from 'express'
import dotenv from 'dotenv'
import router from './routes/route.js'
import { FileservicesDB } from './Config/DB.js'
dotenv.config()

const app = express()
app.use(express.json())

const PORT = process.env.PORT || 8003

app.use("/", router)
app.get("/", (_, res) => {
    return res.status(200).json({
        message: `This serive for FILE`
    })
})

app.listen(PORT, () => {
    FileservicesDB()
    console.log(`This File service server is running on ${PORT}`)
})