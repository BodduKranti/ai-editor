import proxy from "express-http-proxy"

export const proxywithHEader = (serviceURL) => {
    return proxy(serviceURL, {
        // Free-tier services can take up to ~60s to wake up
        timeout: 60000,

        // Don't buffer request bodies, so file uploads (multipart) pass through
        parseReqBody: false,

        // Pass the user id to the downstream service
        proxyReqOptDecorator: (proxyReqOpts, req) => {
            // Never trust a client-supplied x-user-id
            delete proxyReqOpts.headers["x-user-id"]

            if (req.user?._id) {
                proxyReqOpts.headers["x-user-id"] = String(req.user._id)
            }
            return proxyReqOpts
        },

        // Return a clear JSON error instead of crashing or hanging
        proxyErrorHandler: (err, res, next) => {
            console.error(`Proxy error (${serviceURL}):`, err.code || err.message)

            if (err.code === "ECONNRESET" || err.code === "ETIMEDOUT" || err.code === "ESOCKETTIMEDOUT") {
                return res.status(504).json({ message: "Service timed out, try again" })
            }
            if (err.code === "ECONNREFUSED" || err.code === "ENOTFOUND") {
                return res.status(502).json({ message: "Service unavailable" })
            }
            return next(err)
        },
    })
}