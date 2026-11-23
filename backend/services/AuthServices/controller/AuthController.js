import { app } from "../config/Firebase.js"
import { getAuth } from 'firebase-admin/auth'
import { User } from "../model/user.model.js"
import crypto from "crypto"
import redis from "../../../shared/redis/redis.js"



export const loginAuthcontroller = async (req, res) => {
    try {
        const { token } = req.body
        console.log('token', token)
        if (!token) {
            return res.status(400).json({ message: "Token is required" });
        }

        const decoded = await getAuth(app).verifyIdToken(token);
        console.log('decoded', decoded)


        let user = await User.findOne({
            firbaseUid: decoded?.uid
        })

        if (!user) {
            user = await User.create({
                firbaseUid: decoded?.uid,
                name: decoded?.name,
                email: decoded?.email,
                avatar: decoded?.picture
            })
        }

        //session create
        // Reddis configure

        const sessionId = crypto.randomUUID()

        //  when use redis then [key,data]
        //  data should be in json stringyfy
        //  When get the data from the redis then use parser

        await redis.set(`session-${sessionId}`, JSON.stringify({
            _id: user?._id,
            name: user?.name,
            email: user?.email,
            avatar: user?.avatar
        }), 'EX', 7 * 24 * 60 * 60)


        //set the data inside the cookie use with res.cookie
        res.cookie('session', sessionId, {
            httpOnly: true,
            secure: true,
            samesite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })



        return res.status(200).json({ token, user })
    } catch (error) {
        return res.status(500).json({
            message: `Google Authentication error ${error}`
        })
    }
}

export const authLogoutcontroller = async (req, res) => {
    try {
        // how the get the data from the cookie use with req
        const sessionId = req?.cookie?.session

        //delete the redis
        await redis.del(`session-${sessionId}`)

        res.clearCookie('session')

        return res.status(200).json({ message: "Logout successfully" })

    } catch (error) {
        return res.status(500).json({ message: `Logout Error ${error}` })
    }
}