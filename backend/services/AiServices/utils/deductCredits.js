import dotenv from 'dotenv'
import axios from 'axios'
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE || 'http://localhost:8001'
dotenv.config()

export const deductCredits = async ({ userId, amount }) => {
    try {
        const res = await axios.post(`${AUTH_SERVICE_URL}/user/deduct-credits`, { userId, amount }, {
            withCredentials: true
        })

        return res
    } catch (error) {
        return res.status(500).json({ message: 'Credits deduct error', error })
    }
}