import express from 'express'
import dotenv from 'dotenv'
import { paymentDBConnect } from './config/DB.js'
import routes from './route/route.js'
dotenv.config()

const PORT = process.env.PORT || 8006

const app = express()
app.use(express.json())

app.get("/", (_, res) => {
    return res.status(200).json({ message: `This is Payment Services` })
})

app.use("/", routes)

app.listen(PORT, () => {
    paymentDBConnect()
    console.log(`The Payment services is running on ${PORT}`)
})