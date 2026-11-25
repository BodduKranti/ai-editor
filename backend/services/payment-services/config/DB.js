import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

export const paymentDBConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL)
        console.log(`Payment DB connected`)
    } catch (error) {
        console.log(`Payment method connected Failed`)
    }
}