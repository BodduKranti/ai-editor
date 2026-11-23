import { userAuthProvider } from "../../utils/ContextApi"
import { ActivityIcon } from "../LeftSidebar/ProjectActivityleftsideBar"
import { Bot, Code2, Files, SquareTerminal } from "lucide-react"

const MobileActivity = () => {
    const { showExploere,
        setShowExploere,
        setPreview,
        preview, aichat,
        setAiChat, terminal,
        setTerminal } = userAuthProvider()

    return (
        <>
            <button
                onClick={() => setShowExploere((p) => !p)}
                className={`flex flex-col items-center gap-1 px-4 py-1 text-[11px] cursor-pointer font-medium transition-colors ${showExploere ? 'text-white' : "text-zinc-500"}`}
            >
                <Files size={13} />
                Files
            </button>
            <button
                onClick={() => setPreview((p) => !p)}
                className={`flex flex-col items-center gap-1 px-4 py-1 text-[11px] cursor-pointer font-medium transition-colors ${!preview ? 'text-white' : "text-zinc-500"}`}
            >
                <Code2 size={13} />
                Editor
            </button>
            <button
                onClick={() => setAiChat((p) => !p)}
                className={`flex flex-col items-center gap-1 px-4 py-1 text-[11px] cursor-pointer font-medium transition-colors ${aichat ? 'text-white' : "text-zinc-500"}`}
            >
                <Bot size={13} />
                AI Chat
            </button>
            <button
                onClick={() => setTerminal((p) => !p)}
                className={`flex flex-col items-center gap-1 px-4 py-1 text-[11px] cursor-pointer font-medium transition-colors ${terminal ? 'text-white' : "text-zinc-500"}`}
            >
                <SquareTerminal size={13} />
                Terminal
            </button>
            {/**/}
            {/* <ActivityIcon
                icon={Files}
                active={showExploere}
                label={'Explorer'}
                onClick={() => setShowExploere((p) => !p)}
            /> */}

            {/* AI chat close open */}
            {/* <ActivityIcon
                icon={Bot}
                active={aichat}
                label={'AI Chat'}
                onClick={() => setAiChat((p) => !p)}
            /> */}

            {/* TerminalIcons */}
            {/* <div className="mt-auto flex flex-col items-center gap-2">
                <div className="mb-1 h-px w-6 bg-whtie/6" />
                <ActivityIcon
                    icon={SquareTerminal}
                    active={terminal}
                    label={'Terminal'}
                    onClick={() => setTerminal((p) => !p)}
                />
            </div> */}
        </>
    )
}

export default MobileActivity