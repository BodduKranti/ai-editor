import { AIMessage, HumanMessage } from "@langchain/core/messages"
import { graph } from "../graph/graph.js"

const buildHistory = (history) => {
    if (!Array.isArray(history)) {
        return []
    }
    const recents = history.slice(-6)

    return recents
        .filter(
            (recent) =>
                typeof recent?.content === "string" &&
                recent.content.trim() &&
                (recent.role === "user" || recent.role === "assistant")
        )
        .map((msg) => {
            if (msg.role === "user") {
                return new HumanMessage(msg.content)
            }
            return new AIMessage(msg.content)
        })
}

const sendEvent = (res, type, data) => {
    if (res.writableEnded || res.destroyed) {
        return false
    }

    try {
        res.write(`event: ${type}\n`)
        res.write(`data: ${JSON.stringify(data ?? {})}\n\n`)
        return true
    } catch (error) {
        console.log(`SSE error ${error}`)
        return false
    }
}

// message content can be a string or an array of blocks
const textOf = (content) => {
    if (typeof content === "string") return content
    if (Array.isArray(content)) {
        return content
            .map((item) => {
                if (typeof item === "string") return item
                if (item?.type === "text") return item.text || ""
                return ""
            })
            .join("")
    }
    return ""
}

export const chat = async (req, res) => {
    let disconnected = false
    try {
        const { projectId, message, history = [] } = req.body || {}
        const userId = req.headers["x-user-id"]

        if (!projectId) {
            return res.status(400).json({ message: "Project id is not found" })
        }

        if (!message || !String(message).trim()) {
            return res.status(400).json({ message: "message not found" })
        }

        if (!userId) {
            return res.status(400).json({ message: "User id is not found" })
        }

        res.setHeader("Content-Type", "text/event-stream; charset=utf-8")
        res.setHeader("Cache-Control", "no-cache, no-transform")
        res.setHeader("Connection", "keep-alive")
        res.setHeader("X-Accel-Buffering", "no")

        res.flushHeaders?.()

        res.once("close", () => {
            disconnected = true
            console.log("Ai client disconnect")
        })

        sendEvent(res, "start", { success: true, message: "AI Started" })

        const graphData = graph({ projectId: String(projectId), userId: String(userId) })
        const messages = buildHistory(history)
        messages.push(new HumanMessage(String(message).trim()))

        const stream = await graphData.stream(
            { messages },
            {
                streamMode: "updates",
                recursionLimit: 40,
            }
        )

        let finalMessage = ""

        for await (const chunk of stream) {
            if (disconnected || res.writableEnded) break

            if (chunk?.agent) {
                const agentMessages = chunk.agent.messages || []
                const last = agentMessages[agentMessages.length - 1]
                if (!last) {
                    continue
                }

                // the model may write text even when it also calls tools
                const content = textOf(last.content)
                if (content.trim()) {
                    finalMessage = content
                    sendEvent(res, "message", { content })
                }

                if (Array.isArray(last.tool_calls) && last.tool_calls.length) {
                    for (const call of last.tool_calls) {
                        sendEvent(res, "tool_start", {
                            tool: call?.name,
                            arguments: call?.args || {},
                        })
                    }
                }
            }

            if (chunk?.tools) {
                const toolMessages = chunk.tools.messages || []

                for (const toolMessage of toolMessages) {
                    const raw = toolMessage?.content

                    // tool output is usually a JSON string, so parse it
                    let result = null
                    if (typeof raw === "string") {
                        try {
                            result = JSON.parse(raw)
                        } catch (error) {
                            result = null
                        }
                    } else if (raw && typeof raw === "object" && !Array.isArray(raw)) {
                        result = raw
                    }

                    // operation must match the frontend events:
                    // file_created, file_updated, file_deleted, folder_created
                    if (result?.operation) {
                        sendEvent(res, result.operation, result)
                        continue
                    }

                    sendEvent(res, "tool_result", {
                        content: typeof raw === "string" ? raw : JSON.stringify(raw ?? ""),
                    })
                }
            }
        }

        if (!disconnected && !res.writableEnded) {
            sendEvent(res, "done", {
                success: true,
                message: finalMessage || "done",
            })
            res.end()
        }
    } catch (error) {
        console.log(`AI Stream Error ${error}`)
        if (disconnected) {
            return
        }

        if (res.headersSent) {
            sendEvent(res, "error", {
                success: false,
                message: error?.message || "AI request failed",
            })

            if (!res.writableEnded) {
                res.end()
            }
            return
        }

        return res.status(500).json({
            success: false,
            message: error?.message || "AI request failed.",
        })
    }
}