import mongoose from "mongoose"
import dotenv from 'dotenv'
dotenv.config()

export const TerminalDBconnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL)
        console.log(`Terminal DB connected`)
    } catch (error) {
        console.log(`Terminal db connection getting error ${error}`)
    }
}