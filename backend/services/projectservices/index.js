import express from 'express'
import dotenv from 'dotenv'
import { projectDBconnect } from './config/DB.js'
import projectroutes from './route/route.js'
dotenv.config()

const app = express()
app.use(express.json())


const PORT = process.env.PORT || 8002

//Dummy get api
app.get("/dummy", (_, res) => {
    return res.json({ message: "This server is for Project Services" })
})

app.use("/", projectroutes)

app.listen(PORT, () => {
    projectDBconnect()
    console.log(`This Project service running on ${PORT}`)
})
