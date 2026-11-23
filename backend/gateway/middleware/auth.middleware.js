//We have check the user autherise or not
// here is the protect middleware

import redis from "../../shared/redis/redis.js"

export const protectMiddleware = async (req, res, next) => {
    try {

        const header = req?.headers?.authorization

        console.log('header', header)

        //get the session ID from cookie use with req.cookies.session
        const sessionId =
            req.cookies?.session ||
            (header?.startsWith("Bearer ") ? header.slice(7) : undefined)
        console.log('me sessionId', sessionId)
        if (!sessionId) {
            return res.status(400).json({
                message: `Unautherise`
            })
        }

        //get the session use with redis storage
        const result = await redis.get(`session-${sessionId}`)
        console.log('me result', result)

        if (!result) {
            return res.status(401).json({
                message: `Session not found`
            })
        }
        const data = JSON.parse(result)
        console.log('me data', data)
        req.user = data
        next()
    }
    catch (error) {
        return res.status(500).json({ message: `Protect middleware Error ${error}` })
    }
}