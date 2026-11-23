import { app } from "../config/Firebase.js"
import { getAuth } from 'firebase-admin/auth'
import { User } from "../model/user.model.js"
import crypto from "crypto"
import redis from "../../../shared/redis/redis.js"

const isProd = process.env.NODE_ENV === "production"
const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60

// Frontend and gateway are on different onrender.com subdomains (cross-site),
// so production needs sameSite "none" + secure true.
// Note: the option key is `sameSite` (capital S). `samesite` is silently ignored.
const cookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
}

export const loginAuthcontroller = async (req, res) => {
    try {
        const { token } = req.body
        if (!token) {
            return res.status(400).json({ message: "Token is required" })
        }

        // Invalid or expired Firebase tokens are a 401, not a 500
        let decoded
        try {
            decoded = await getAuth(app).verifyIdToken(token)
        } catch (err) {
            return res.status(401).json({ message: "Invalid or expired token" })
        }

        let user = await User.findOne({ firbaseUid: decoded.uid })

        if (!user) {
            user = await User.create({
                firbaseUid: decoded.uid,
                name: decoded.name,
                email: decoded.email,
                avatar: decoded.picture,
            })
        }

        // Create the session in Redis
        const sessionId = crypto.randomUUID()

        await redis.set(
            `session-${sessionId}`,
            JSON.stringify({
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
            }),
            'EX',
            SESSION_TTL_SECONDS
        )

        res.cookie('session', sessionId, {
            ...cookieOptions,
            maxAge: SESSION_TTL_SECONDS * 1000,
        })

        // The frontend already has the Firebase token, so don't send it back
        return res.status(200).json({ user })
    } catch (error) {
        console.error('Login error:', error)
        return res.status(500).json({ message: "Authentication error" })
    }
}

export const authLogoutcontroller = async (req, res) => {
    try {
        // `req.cookies` (plural) needs cookie-parser in THIS service
        const sessionId = req.cookies?.session

        if (sessionId) {
            await redis.del(`session-${sessionId}`)
        }

        // Must use the same options (sameSite, secure, path) or the browser keeps the cookie
        res.clearCookie('session', cookieOptions)

        return res.status(200).json({ message: "Logout successfully" })
    } catch (error) {
        console.error('Logout error:', error)
        return res.status(500).json({ message: "Logout error" })
    }
}