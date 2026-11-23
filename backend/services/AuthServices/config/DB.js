import dotenv from 'dotenv'
import mongoose from 'mongoose'
dotenv.config()

const connectionAuthDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL)
        console.log(`Auth db Connected`)
    } catch (error) {
        console.log(`Auth db Connection error ${error}`)
    }
}
export default connectionAuthDB