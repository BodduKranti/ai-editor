import dotenv from 'dotenv'
import axios from 'axios'
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE || 'http://localhost:8001'
dotenv.config()

export const addCredits = async ({ userId, credits }) => {
    try {
        const res = await axios.post(`${AUTH_SERVICE_URL}/user/add-credits`, { userId, credits }, {
            withCredentials: true
        })

        return res
    } catch (error) {
        return res.status(500).json({ message: 'Credits deduct error', error })
    }
}