import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { Terminal as XTerm } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import '@xterm/xterm/css/xterm.css'
import { useAppSelector } from '../../../Redux/hook'
import { Eraser } from 'lucide-react'

// Vite: put VITE_TERMINAL_URL=http://localhost:8005 in your .env and restart the dev server
const Terminal_URL = import.meta.env.VITE_TERMINAL_URL || 'http://localhost:8005'

type Props = {
    projectId?: string
    height?: number | string
}

export default function Terminal({ projectId, height = '100%' }: Props) {
    const containerRef = useRef<HTMLDivElement>(null)
    const data = useAppSelector((state) => state.project?.data)
    const userId = data && data?.owner
    const [connected, setConnected] = useState<boolean>(false)
    const terminalRef = useRef<any>(null)
    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        if (!projectId || !userId) {
            console.warn('Terminal: projectId or userId missing', { projectId, userId })
            return
        }

        const term = new XTerm({
            cursorBlink: true,
            fontSize: 14,
            fontFamily: 'Menlo, Consolas, monospace',
            theme: { background: '#1e1e1e' },
        })
        const fit = new FitAddon()
        term.loadAddon(fit)
        term.open(container)
        terminalRef.current = term

        const safeFit = () => {
            try {
                fit.fit()
            } catch (e) {
                // container may be hidden or have zero size
            }
        }
        safeFit()

        const focusTerminal = () => term.focus()
        container.addEventListener('click', focusTerminal)
        term.focus()

        const socket: Socket = io(Terminal_URL, {
            transports: ['websocket'],
            withCredentials: true,
        })

        socket.on('connect', () => {
            console.log('Socket connected', socket.id)
            setConnected(true)
            safeFit()
            socket.emit('terminal:init', {
                projectId,
                userId,
                cols: term.cols,
                rows: term.rows,
            })
        })

        socket.on('terminal:ready', (d) => console.log('terminal ready', d))

        socket.on('connect_error', (err) => {
            setConnected(false)
            console.log('connect_error:', err.message)
            term.writeln(`\r\n\x1b[31mConnection error: ${err.message}\x1b[0m`)
        })

        socket.on('disconnect', (reason) => {
            console.log('disconnected:', reason)
        })

        // server output -> terminal
        socket.on('terminal:data', (data: string) => term.write(data))

        // keystrokes -> server
        const dataDisposable = term.onData((data) => {
            socket.emit('terminal:write', data)
        })

        // resize -> server
        const observer = new ResizeObserver(() => {
            safeFit()
            if (socket.connected) {
                socket.emit('terminal:resize', { cols: term.cols, rows: term.rows })
            }
        })
        observer.observe(container)

        return () => {
            container.removeEventListener('click', focusTerminal)
            observer.disconnect()
            dataDisposable.dispose()
            socket.disconnect()
            term.dispose()
        }
    }, [projectId, userId])

    const clearTerminal = () => {
        const terminal = terminalRef.current
        if (!terminal) return
        terminal.clear()
        terminal.write('\x1b[2J\x1b[H')
        terminal.focus()
    }

    // Always render the div so the ref is attached before the effect runs.
    return <div className={`flex h-full flex-col bg-[#0d0d0f]`}>
        <div className='flex h-7 shrink-0 items-center justify-between border-b border-white/5 px-3'>
            <div className='flex items-center gap-2'>
                <span className={`h-1.5 w-1.5 rounded-full ${connected ? "bg-emerald-400" : 'bg-zinc-600'}`} />
                <span className={`text-[11px] text-zinc-500`}>
                    {
                        connected ? 'terminal - connected' :
                            "terminal - disconnected"
                    }
                </span>
            </div>

            <button
                onClick={clearTerminal}
                className={`rounded p-1 text-zinc-500 transition-colors hover:bg-white/10 hover:text-white`}>
                <Eraser size={11} />
            </button>
        </div>
        <div ref={containerRef}
            style={{ width: '100%', height, minHeight: 200 }} />
    </div>

}