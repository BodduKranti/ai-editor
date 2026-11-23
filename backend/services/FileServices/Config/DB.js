
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

export const FileservicesDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL)
        console.log('File service DB connected')
    } catch (error) {
        console.log("File service db connected failed")
    }
}