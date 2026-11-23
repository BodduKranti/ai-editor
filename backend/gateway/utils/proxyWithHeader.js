import proxy from "express-http-proxy"

export const proxywithHEader = (serviceURL) => {
    return proxy(serviceURL, {

        // passthe req userid
        proxyReqOptDecorator: (proxyReqOtps, req) => {
            if (req.user) {
                proxyReqOtps.headers["x-user-id"] = req?.user?._id
            }
            return proxyReqOtps
        }
    })
}