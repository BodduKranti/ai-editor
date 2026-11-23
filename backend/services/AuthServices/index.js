import express from 'express'
import dotenv from 'dotenv'
import connectionAuthDB from './config/DB.js';
import authrouter from './route/Auth.route.js';
dotenv.config();


const app = express()
app.use(express.json())

const PORT = process.env.PORT || 8001


app.get("/msg", (_, res) => {
    return res.status(200).json({ message: `This is Auth serverices` })
})

//Routes
app.use("/", authrouter)


app.listen(PORT, () => {
    connectionAuthDB()
    console.log(`Auth server is running on ${PORT}`)
})