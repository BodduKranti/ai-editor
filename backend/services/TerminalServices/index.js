import express from 'express'
import dotenv from 'dotenv'
import { TerminalDBconnect } from './config/DB.js'
import http from 'http'
import { Server } from 'socket.io'
import os from 'os'
import path from 'path'
import fs from 'fs/promises'
import pty from 'node-pty'

dotenv.config()

const app = express()
app.use(express.json())

const fileServicesURL = process.env.FILE_SERVICE_URL || `http://localhost:8003`

const WORKSPACE_ROOT = path.join(os.tmpdir(), 'ai_editor') // e.g. /tmp/ai_editor/<projectId>
const SHELL = process.platform === 'win32' ? 'powershell.exe' : 'bash'
const PORT = process.env.PORT || 8005

// server
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: true,
        credentials: true
    }
})

const sessions = new Map()

const send = (socket, data) => {
    if (!socket.connected) return
    socket.emit('terminal:data', String(data || ''))
}

const nameSafe = (name) => {
    if (!name || name === '.' || name === '..' || name.includes('/') || name.includes('\\')) {
        throw new Error(`Invalid file/folder name: ${name}`)
    }
    return name
}

const workspace = (projectId) => path.join(WORKSPACE_ROOT, String(projectId))

const normaliseCols = (cols) => {
    const value = Number(cols)
    if (!Number.isFinite(value)) return 80
    return Math.max(20, Math.min(Math.floor(value), 500))
}

const normaliseRows = (rows) => {
    const value = Number(rows)
    if (!Number.isFinite(value)) return 30
    return Math.max(5, Math.min(Math.floor(value), 200))
}

const getTree = async (projectId, userId) => {
    const url = `${fileServicesURL}/get-tree-byid/${projectId}`

    const response = await fetch(url, {
        method: 'GET',
        headers: { 'x-user-id': String(userId) }
    })

    const text = await response.text()
    let data = {}
    try {
        data = text ? JSON.parse(text) : {}
    } catch (error) {
        data = { message: text }
    }

    if (!response.ok) {
        throw new Error(data?.message || `File server returned ${response.status}`)
    }

    return Array.isArray(data.tree) ? data.tree : []
}

const writeNodes = async (nodes, directory) => {
    if (!Array.isArray(nodes)) return

    for (const node of nodes) {
        const name = nameSafe(node?.name)
        const target = path.join(directory, name)

        if (node.type === 'folder') {
            await fs.mkdir(target, { recursive: true })
            await writeNodes(node.children || [], target)
            continue
        }

        if (node.type === 'file') {
            await fs.mkdir(path.dirname(target), { recursive: true })
            await fs.writeFile(target, node.content || '', 'utf-8')
        }
    }
}

const syncProject = async (projectId, userId) => {
    const tree = await getTree(projectId, userId)

    const root = workspace(projectId)
    await fs.mkdir(root, { recursive: true })

    if (tree.length === 1 && tree[0]?.type === 'folder') {
        await writeNodes(tree[0].children || [], root)
    } else {
        await writeNodes(tree, root)
    }

    return { tree, root }
}

const killSession = (socketId) => {
    const session = sessions.get(socketId)
    if (!session) return
    try {
        session.ptyProcess.kill()
    } catch (error) {
        // already dead
    }
    sessions.delete(socketId)
}

io.on('connection', (socket) => {
    console.log('Terminal connected', socket.id)

    socket.on('terminal:init', async (payload) => {
        try {
            const { projectId, userId, cols = 80, rows = 30 } = payload || {}
            console.log('projectId0', projectId)
            console.log('userId0', userId)
            console.log('cols', cols)
            console.log('rows', rows)
            if (!projectId || !userId) {
                throw new Error('Project ID and User ID are required')
            }

            killSession(socket.id)

            const safeCols = normaliseCols(cols)
            const safeRows = normaliseRows(rows)

            const { root } = await syncProject(String(projectId), String(userId))

            const ptyProcess = pty.spawn(SHELL, [], {
                name: 'xterm-256color',
                cols: safeCols,
                rows: safeRows,
                cwd: root,
                env: { ...process.env, FORCE_COLOR: '1' }
            })

            ptyProcess.onData((data) => send(socket, data))

            ptyProcess.onExit(({ exitCode }) => {
                send(socket, `\r\n\x1b[90m[shell exited: ${exitCode}]\x1b[0m\r\n`)
                const current = sessions.get(socket.id)
                if (current?.ptyProcess === ptyProcess) {
                    sessions.delete(socket.id)
                }
            })

            sessions.set(socket.id, {
                projectId: String(projectId),
                userId: String(userId),
                cwd: root,
                ptyProcess
            })

            socket.emit('terminal:ready', { cols: safeCols, rows: safeRows })
        } catch (error) {
            console.log(`Terminal init error: ${error}`)
            send(socket, `\r\n\x1b[31m${error.message}\x1b[0m\r\n`)
        }
    })

    socket.on('terminal:write', (data) => {
        const session = sessions.get(socket.id)
        if (!session) return
        session.ptyProcess.write(String(data))
    })

    socket.on('terminal:resize', ({ cols, rows } = {}) => {
        const session = sessions.get(socket.id)
        if (!session) return

        if (!Number.isFinite(Number(cols)) || !Number.isFinite(Number(rows))) return

        try {
            session.ptyProcess.resize(normaliseCols(cols), normaliseRows(rows))
        } catch (error) {
            // pty may have exited
        }
    })

    socket.on('disconnect', () => {
        console.log('Terminal disconnected', socket.id)
        killSession(socket.id)
    })
})

app.get('/health', (_, res) => {
    return res.json({ message: 'success true', success: true, service: 'Terminal' })
})

server.listen(PORT, () => {
    TerminalDBconnect()
    console.log(`This Terminal server is running on ${PORT}`)
})