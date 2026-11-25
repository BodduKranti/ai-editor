import express from 'express'
import cors from 'cors'
import cookieparser from 'cookie-parser'
import dotenv from 'dotenv'
import morgan from 'morgan'
import proxy from 'express-http-proxy'
import { protectMiddleware } from './middleware/auth.middleware.js'
import { userController } from './controller/usercontroller.js'
import { proxywithHEader } from './utils/proxyWithHeader.js'

dotenv.config()

// ---- Fail fast with a clear log line if an env var is missing ----
const required = [
    'CLIENT_URL',
    'AUTH_SERVICE',
    'PROJECT_SERVICE',
    'FILE_SERVICE',
    'AI_FILE_SERVICE',
    'PAYMENT_SERVICE',
    'TERMINAL_SERVICE'
]
const missing = required.filter((key) => !process.env[key])
if (missing.length) {
    console.error(`Missing env vars: ${missing.join(', ')}`)
    process.exit(1)
}

// Remove trailing slashes so CORS origin and proxy targets match exactly
const clean = (url) => {
    if (!url) {
        throw new Error(`Missing environment variable: ${url}`)
    }
    return url.replace(/\/+$/, '')
}

const CLIENT_URL = clean(process.env.CLIENT_URL)
const AUTH_SERVICE = clean(process.env.AUTH_SERVICE)
const PROJECT_SERVICE = clean(process.env.PROJECT_SERVICE)
const FILE_SERVICE = clean(process.env.FILE_SERVICE)
const AI_FILE_SERVICE = clean(process.env.AI_FILE_SERVICE)
const TERMINAL_SERVICE = clean(process.env.TERMINAL_SERVICE)
const PAYMENT_SERVICE = clean(process.env.PAYMENT_SERVICE)

const PORT = process.env.PORT || 8000

const app = express()

// Needed on Render (behind a proxy) so secure cookies work
app.set('trust proxy', 1)

// ---- CORS ----
app.use(
    cors({
        origin: CLIENT_URL,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Accept', 'x-user-id', 'Authorization'],
        credentials: true,
    })
)

app.use(express.json())
app.use(cookieparser())
app.use(morgan('dev'))

// ---- Health checks ----
app.get('/', (_, res) => {
    return res.status(200).json({ message: 'This the gateway section' })
})

app.get('/health', (_, res) => {
    return res.status(200).json({ status: 'ok' })
})

app.use('/api/auth', proxy(AUTH_SERVICE, {        // proxyReqPathResolver: (req) => `/api/auth${req.url}`,
})
)
app.get('/api/me', protectMiddleware, userController)

// ---- PROJECT SERVICES ----
app.use('/api/project', protectMiddleware, proxywithHEader(PROJECT_SERVICE))

// ---- FILE SERVICES ----
app.use('/api/file', protectMiddleware, proxywithHEader(FILE_SERVICE))

// ---- AI FILE SERVICES ----
app.use('/api/ai', proxywithHEader(AI_FILE_SERVICE))

// ---- Terminal SERVICES ----
app.use('/api/terminal', protectMiddleware, proxywithHEader(TERMINAL_SERVICE))

//----------- PAYEMT SERVICES ----------- 
app.use("/api/payment", protectMiddleware, proxywithHEader(PAYMENT_SERVICE))


// ---- Fallback error handler (so errors show in logs, not just 502) ----
app.use((err, req, res, next) => {
    console.error('Gateway error:', err.message)
    res.status(500).json({ message: 'Gateway error' })
})

// Bind to 0.0.0.0 so Render can detect the open port
app.listen(PORT, '0.0.0.0', () => {
    console.log(`This server is running on ${PORT}`)
})