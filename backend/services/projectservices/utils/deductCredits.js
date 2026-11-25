import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

export const deductCredtisProject = async ({ userId, amount }) => {
    try {
        const res = await axios.post(`${process.env.AUTH_SERVICE}/user/deduct-credits`, { userId, amount })
        return res
    }
    catch (error) {
        return error
    }
}