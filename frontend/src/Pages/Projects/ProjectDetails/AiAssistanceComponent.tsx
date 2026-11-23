import { FileMinus, FilePen, FilePlus, FolderPlus, Send, Sparkles } from "lucide-react"
import { useState, type ChangeEvent } from "react"
import TextAreafield from "../../../components/fields/TextAreafield"
import { AnimatePresence, motion } from 'motion/react'
import { userAuthProvider } from "../../../utils/ContextApi"
import { Routes } from "../../../types"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"
import Spinner from "../../../components/Loader/Spinner"

interface props {
    projectId?: any,
    toolType: any,
    details: any
}

const AiAssistanceComponent = ({ projectId }: props) => {
    const { authUser } = userAuthProvider()
    const queryClient = useQueryClient()
    const [messages, setMessages] = useState<any[]>([]);
    const [message, setMessage] = useState('')

    const TOOL_META: any = {
        folder_created: { icon: FolderPlus, color: "text-sky-400", label: "Created Folder" },
        file_created: { icon: FilePlus, color: "text-emerald-400", label: "Created File" },
        file_updated: { icon: FilePen, color: "text-amber-400", label: "Updated File" },
        file_deleted: { icon: FileMinus, color: "text-red-400", label: "File Deleted" },
    }

    const ToolBedge = ({ toolType, details }: props) => {

        const meta = TOOL_META[toolType]
        if (!meta) return null
        const Icon = meta.icon

        return (
            <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center"
            >
                <div className="flex items-center gap-1.5 rounded-full border border-white/8 bg-white/3 px-3 py-1 text-[11.5px] text-zinc-400">
                    <Icon size={11} className={`${meta?.color}`} />
                    <span>{meta?.label}</span>
                    {details && <span className="text-zinc-600">&middot; {details}</span>}
                </div>
            </motion.div>
        )
    }

    const onEvent = async (toolType: string, data: any) => {
        if (toolType === 'file_created') {
            setMessages((prev: any) => [
                ...prev,
                { role: "tool", toolType: "file_created", detail: data?.file?.name },
            ]);
        }

        if (toolType === 'file_updated') {
            setMessages((prev: any) => [
                ...prev,
                { role: "tool", toolType: "file_updated", detail: data?.file?.name },
            ]);
        }


        if (toolType === 'file_deleted') {
            setMessages((prev: any) => [
                ...prev,
                { role: "tool", toolType: "file_deleted", detail: data?.file?.name },
            ]);
        }


        if (toolType === 'folder_created') {
            setMessages((prev: any) => [
                ...prev,
                { role: "tool", toolType: "folder_created", detail: data?.folder?.name },
            ]);
        }

        if (toolType === 'message') {
            const content = data?.content
            if (!content) return;

            setMessages((prev: any) => {
                let copy = [...prev]
                let last = copy[copy.length - 1]
                if (last.role == "assistant") {
                    copy[copy.length - 1] = { ...last, content }
                } else {
                    copy.push({ role: 'assistant', content })
                }
                return copy
            });

            return
        }

        if (toolType == 'error') {
            throw new Error(data.message || 'Ai failed')
        }
    }

    // const aiChat = useApiAIPostrequest()

    // const aiChatFun = (e: any) => {
    //     e.stopPropagation()
    //     aiChat.mutate({
    //         URL: Routes.AI_SERVICES,
    //         payload: {
    //             projectId,
    //             message: message,
    //         }
    //     }, {
    //         onSuccess: (data) => {
    //             console.log('Ai Data', data)
    //             queryClient.invalidateQueries({ queryKey: [`${Routes.GET_TREE_BY_ID}/${projectId}`] })
    //         },
    //         onError: (err: any) => {
    //             toast.error(err?.response.data?.message)
    //         }
    //     })
    // }

    // const aiChatFun = async (e: React.SyntheticEvent) => {
    //     e.stopPropagation();

    //     try {
    //         const response = await fetch(`${import.meta.env.VITE_API_URL}${Routes.AI_SERVICES}`, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 "Accept": "text/event-stream",
    //                 "x-user-id": `${authUser?._id}`,
    //             },
    //             body: JSON.stringify({ projectId, message, history }),
    //         });

    //         if (!response.ok) {
    //             let msg = "AI Request Failed";
    //             try {
    //                 const data = await response.json();
    //                 msg = data?.message || msg;
    //             } catch {
    //                 // keep default message
    //             }
    //             throw new Error(msg);
    //         }

    //         if (!response.body) {
    //             throw new Error("AI streaming is not supported");
    //         }

    //         const reader = response.body.getReader();
    //         const decoder = new TextDecoder();
    //         let buffer = "";

    //         try {
    //             while (true) {
    //                 const { value, done } = await reader.read();
    //                 if (done) break;

    //                 buffer += decoder.decode(value, { stream: true });
    //                 const events = buffer.split(/\r?\n\r?\n/);
    //                 buffer = events.pop() || "";

    //                 for (const eventText of events) {
    //                     if (!eventText.trim()) continue;

    //                     let eventType = "message";
    //                     const dataLines: string[] = [];

    //                     for (const line of eventText.split(/\r?\n/)) {
    //                         if (line.startsWith("event:")) {
    //                             eventType = line.slice(6).trim();
    //                         } else if (line.startsWith("data:")) {
    //                             dataLines.push(line.slice(5).trim());
    //                         }
    //                     }

    //                     const dataText = dataLines.join("\n");
    //                     if (!dataText) continue;

    //                     let data;
    //                     try {
    //                         data = JSON.parse(dataText);
    //                     } catch {
    //                         data = { content: dataText };
    //                     }

    //                     // Handle the event here
    //                     switch (eventType) {
    //                         case "message":
    //                             // e.g. setAnswer(prev => prev + (data.content ?? ""));
    //                             break;
    //                         case "error":
    //                             throw new Error(data?.message || "Stream error");
    //                         case "done":
    //                             return data;
    //                     }
    //                 }
    //             }
    //         } finally {
    //             reader.releaseLock();
    //         }
    //     } catch (error) {
    //         console.error(error);
    //         return null;
    //     }
    // };


    const [answer, setAnswer] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);

    const aiChatFun = async (e: React.SyntheticEvent) => {
        e.stopPropagation();
        setAnswer("");
        setIsStreaming(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}${Routes.AI_SERVICES}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "text/event-stream",
                    "x-user-id": `${authUser?._id}`,
                },
                credentials: "include",
                body: JSON.stringify({ projectId, message, history }),
            });

            if (!response.ok) {
                let msg = "AI request failed";
                try {
                    const data = await response.json();
                    msg = data?.message || msg;
                } catch {
                    // keep default message
                }
                throw new Error(msg);
            }

            if (!response.body) throw new Error("AI streaming is not supported");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";

            try {
                while (true) {
                    // replaces onSuccess (runs only if no error was thrown)
                    queryClient.invalidateQueries({
                        queryKey: [`${Routes.GET_TREE_BY_ID}/${projectId}`],
                    });
                    const { value, done } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const events = buffer.split(/\r?\n\r?\n/);
                    buffer = events.pop() || "";

                    for (const eventText of events) {
                        if (!eventText.trim()) continue;

                        let eventType = "message";
                        const dataLines: string[] = [];

                        for (const line of eventText.split(/\r?\n/)) {
                            if (line.startsWith("event:")) {
                                eventType = line.slice(6).trim();
                            } else if (line.startsWith("data:")) {
                                dataLines.push(line.slice(5).trim());
                            }
                        }

                        const dataText = dataLines.join("\n");
                        if (!dataText) continue;

                        let data;
                        try {
                            data = JSON.parse(dataText);
                        } catch {
                            data = { content: dataText };
                        }
                        onEvent(eventType, data)
                        console.log('eventType', eventType)

                        switch (eventType) {
                            case "message":
                                setAnswer((prev) => prev + (data?.content ?? ""));
                                break;
                            case "error":
                                throw new Error(data?.message || "Stream error");
                            case "done":
                                console.log("Ai Data", data);
                                return; // finally blocks below still run
                        }
                    }
                }
            } finally {
                reader.releaseLock();
                setMessage('')
            }
        } catch (err: any) {
            // replaces onError
            toast.error(err?.message || "AI request failed");
            return;
        } finally {
            setIsStreaming(false);
        }


    };

    console.log('answer0', answer)
    console.log('isStreaming', isStreaming)

    return (
        <div className="flex w-80 shrink-0 flex-col border-l border-white/6 bg-[#111113]/90 backdrop-blur-xl ">
            <div className="flex h-10 shrink-0 items-center gap-2 border-b border-white/6 px-3">
                <span className="text-xs font-semibold tracking-wider text-zinc-300">Ai Editor Chat</span>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-3">
                {messages.length == 0 && (
                    <div className="mt-10 text-center">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/6 bg-white/2">
                            <Sparkles size={22} className="text-zinc-600" />
                        </div>
                        <p className="text-sm font-medium text-zinc-400">What do you want to build?</p>
                        <p className="mt-1.5 text-xs text-zinc-600">Ask me to create or modify files.</p>
                    </div>
                )}

                <AnimatePresence initial={false}>
                    {messages?.map((msg: any, index: number) => {
                        if (msg.role === "tool") {
                            return <ToolBedge toolType={msg?.toolType} details={msg?.details} key={index} />;
                        }
                        return <></>
                            ;
                    })}

                </AnimatePresence>
            </div>


            <div className="border-t border-white/6 p-3">
                <div className="flex items-center gap-2 rounded-lg border border-white/8 bg-white/3 p-2 transition-colors focus-within:border-sky-400/40">
                    <TextAreafield
                        value={message}
                        rows={1}
                        cols={4}
                        placeholder="Ask AI to build something..."
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                            setMessage(e.target.value)
                        }}
                    />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-linear-to-b from-sky-500 to-sky-500 text-white shadow-[0_1px_0_rgba(255,255,255,.0.2)] transition-opacity hover:from-sky-400 hover:to-sky-500 disabled:cursor-not-allowed disabled:opacity-40"
                        onClick={(e) => aiChatFun(e)}
                    >
                        {isStreaming ? <Spinner className={`w-5! h-5!`}
                        /> : <Send size={11} />}

                    </motion.button>
                </div>
            </div>
        </div>
    )
}

export default AiAssistanceComponent