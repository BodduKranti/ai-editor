import mongoose from "mongoose"
import dotenv from 'dotenv'
dotenv.config()

export const projectDBconnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL)
        console.log(`Project services db connected`)
    } catch (error) {
        console.log(`Project service db getting error ${error}`)
    }
}