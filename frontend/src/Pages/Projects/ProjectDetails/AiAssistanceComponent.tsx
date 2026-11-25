import { FileMinus, FilePen, FilePlus, FolderPlus, Send, Sparkles } from "lucide-react"
import { useEffect, useRef, useState, type ChangeEvent } from "react"
import TextAreafield from "../../../components/fields/TextAreafield"
import { AnimatePresence, motion } from "motion/react"
import { userAuthProvider } from "../../../utils/ContextApi"
import { Routes } from "../../../types"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"
import Spinner from "../../../components/Loader/Spinner"

interface props {
    projectId?: any
}

interface ChatMessage {
    role: "user" | "assistant" | "tool"
    content?: string
    toolType?: string
    details?: string
}

const TOOL_META: any = {
    folder_created: { icon: FolderPlus, color: "text-sky-400", label: "Created Folder" },
    file_created: { icon: FilePlus, color: "text-emerald-400", label: "Created File" },
    file_updated: { icon: FilePen, color: "text-amber-400", label: "Updated File" },
    file_deleted: { icon: FileMinus, color: "text-red-400", label: "File Deleted" },
}

const ToolBadge = ({ toolType, details }: { toolType?: string; details?: string }) => {
    const meta = toolType ? TOOL_META[toolType] : null
    if (!meta) return null
    const Icon = meta.icon

    return (
        <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center"
        >
            <div className="flex items-center gap-1.5 rounded-full border border-white/8 bg-white/3 px-3 py-1 text-[11.5px] text-zinc-400">
                <Icon size={16} className={meta.color} />
                <span>{meta.label}</span>
                {details && <span className="text-zinc-600">&middot; {details}</span>}
            </div>
        </motion.div>
    )
}

const ChatBubble = ({ role, content }: { role: "user" | "assistant"; content?: string }) => {
    if (!content) return null
    const isUser = role === "user"

    return (
        <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${isUser ? "justify-end" : "justify-start"}`}
        >
            <div
                className={`max-w-[90%] whitespace-pre-wrap wrap-break-word rounded-2xl px-3 py-2 text-[13px] leading-relaxed ${isUser
                    ? "rounded-br-sm bg-sky-500/90 text-white"
                    : "rounded-bl-sm border border-white/8 bg-white/4 text-zinc-200"
                    }`}
            >
                {content}
            </div>
        </motion.div>
    )
}

const AiAssistanceComponent = ({ projectId }: props) => {
    const { authUser } = userAuthProvider()
    const queryClient = useQueryClient()
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [message, setMessage] = useState("")
    const [isStreaming, setIsStreaming] = useState(false)
    const bottomRef = useRef<HTMLDivElement>(null)

    // keep the newest message in view
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const refreshTree = () => {
        queryClient.invalidateQueries({
            queryKey: [`${Routes.GET_TREE_BY_ID}/${projectId}`],
        })
    }

    // handles one SSE event
    const onEvent = (eventType: string, data: any) => {
        switch (eventType) {
            case "file_created":
            case "file_updated":
            case "file_deleted":
                setMessages((prev) => [
                    ...prev,
                    { role: "tool", toolType: eventType, details: data?.file?.name },
                ])
                refreshTree()
                break

            case "folder_created":
                setMessages((prev) => [
                    ...prev,
                    { role: "tool", toolType: eventType, details: data?.folder?.name },
                ])
                refreshTree()
                break

            case "message": {
                // assumes each "message" event carries the text of one assistant reply
                const content = typeof data?.content === "string" ? data.content : ""
                if (!content.trim()) break
                setMessages((prev) => [...prev, { role: "assistant", content }])
                break
            }

            case "error":
                throw new Error(data?.message || "Stream error")

            case "done":
                refreshTree()
                break
        }
    }

    const sendMessage = async () => {
        const text = message.trim()
        if (!text || isStreaming) return

        // only user/assistant text goes back to the server as history
        const history = messages
            .filter((m) => m.role !== "tool" && m.content)
            .map((m) => ({ role: m.role, content: m.content }))

        setMessages((prev) => [...prev, { role: "user", content: text }])
        setMessage("")
        setIsStreaming(true)

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}${Routes.AI_SERVICES}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "text/event-stream",
                    "x-user-id": `${authUser?._id}`,
                },
                credentials: "include",
                body: JSON.stringify({ projectId, message: text, history }),
            })

            if (!response.ok) {
                let msg = "AI request failed"
                try {
                    const data = await response.json()
                    msg = data?.message || msg
                } catch {
                    // keep default message
                }
                throw new Error(msg)
            }

            if (!response.body) throw new Error("AI streaming is not supported")

            const reader = response.body.getReader()
            const decoder = new TextDecoder()
            let buffer = ""

            try {
                while (true) {
                    const { value, done } = await reader.read()
                    if (done) break

                    buffer += decoder.decode(value, { stream: true })
                    const events = buffer.split(/\r?\n\r?\n/)
                    buffer = events.pop() || ""

                    for (const eventText of events) {
                        if (!eventText.trim()) continue

                        let eventType = "message"
                        const dataLines: string[] = []

                        for (const line of eventText.split(/\r?\n/)) {
                            if (line.startsWith("event:")) {
                                eventType = line.slice(6).trim()
                            } else if (line.startsWith("data:")) {
                                dataLines.push(line.slice(5).trim())
                            }
                        }

                        const dataText = dataLines.join("\n")
                        if (!dataText) continue

                        let data: any
                        try {
                            data = JSON.parse(dataText)
                        } catch {
                            data = { content: dataText }
                        }

                        onEvent(eventType, data)
                        if (eventType === "done") return
                    }
                }

                queryClient.invalidateQueries({ queryKey: [Routes.CURRENT_USER] })
            } finally {
                reader.releaseLock()
            }
        } catch (err: any) {
            toast.error(err?.message || "AI request failed")
        } finally {
            setIsStreaming(false)
        }
    }

    return (
        <div className="flex w-80 shrink-0 flex-col border-l border-white/6 bg-[#111113]/90 backdrop-blur-xl">
            <div className="flex h-10 shrink-0 items-center gap-2 border-b border-white/6 px-3">
                <span className="text-xs font-semibold tracking-wider text-zinc-300">Ai Editor Chat</span>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-3">
                {messages.length === 0 && (
                    <div className="mt-10 text-center">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/6 bg-white/2">
                            <Sparkles size={22} className="text-zinc-600" />
                        </div>
                        <p className="text-sm font-medium text-zinc-400">What do you want to build?</p>
                        <p className="mt-1.5 text-xs text-zinc-600">Ask me to create or modify files.</p>
                    </div>
                )}

                <AnimatePresence initial={false}>
                    {messages.map((msg, index) => {
                        if (msg.role === "tool") {
                            return <ToolBadge key={index} toolType={msg.toolType} details={msg.details} />
                        }
                        return <ChatBubble key={index} role={msg.role} content={msg.content} />
                    })}
                </AnimatePresence>

                {isStreaming && (
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <Spinner className="w-4! h-4!" />
                        <span>Working...</span>
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            <div className="border-t border-white/6 p-3">
                <div className="flex items-center gap-2 rounded-lg border border-white/8 bg-white/3 p-2 transition-colors focus-within:border-sky-400/40">
                    <TextAreafield
                        value={message}
                        rows={1}
                        cols={4}
                        placeholder="Ask AI to build something..."
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                    />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={isStreaming || !message.trim()}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-linear-to-b from-sky-500 to-sky-500 text-white transition-opacity hover:from-sky-400 hover:to-sky-500 disabled:cursor-not-allowed disabled:opacity-40"
                        onClick={sendMessage}
                    >
                        {isStreaming ? <Spinner className="w-5! h-5!" /> : <Send size={14} />}
                    </motion.button>
                </div>
            </div>
        </div>
    )
}

export default AiAssistanceComponent