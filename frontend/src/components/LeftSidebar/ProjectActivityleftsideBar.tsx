import { Bot, Files, SquareTerminal } from "lucide-react"
import { useState } from "react"
import { AnimatePresence, motion } from 'motion/react'
import { userAuthProvider } from "../../utils/ContextApi"


export function ActivityIcon({ icon: Icon, label, active, onClick }: any) {
    const [hovered, setHovered] = useState<boolean>(false)

    return (<div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`relative`}>
        <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={onClick}
            className={`relative flex h-9 w-9 items-center justify-center rounded-lg`}
        >
            <AnimatePresence>
                {active && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute inset-0 rounded-lg bg-white/7 ring-1 ring-white/10`}
                    />
                )}
            </AnimatePresence>
            <Icon size={19}
                className={`relative z-10 transition-colors ${active ? "text-sky-400" : "text-zinc-500 hover:text-zinc-300"}`}
            />

            <AnimatePresence>
                {active && (
                    <motion.button
                        className={`absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-linear-to-b from-sky-400 to-violet-400`}
                        transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {hovered && (
                    <motion.button
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -4 }}

                        className={`pointer-events-none absolute left-11 top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded-md border border-white/8 bg-[#17171a] px-2 py-1 text-[11px] font-medium text-zinc-300 shadow-lg shadow-black/40`}
                        transition={{ duration: 0.12 }}
                    >
                        {label}
                    </motion.button>
                )}
            </AnimatePresence>
        </motion.button>
    </div>)
}


const ProjectActivityleftsideBar = () => {
    const { showExploere,
        setShowExploere,
        aichat, setAiChat,
        terminal, setTerminal } = userAuthProvider()
    return (
        <div className="hidden md:flex w-14 shrink-0 flex-col items-center gap-2 border-2 border-white/6 bg-[#111113]/90 py-3">
            {/**/}
            <ActivityIcon
                icon={Files}
                active={showExploere}
                label={'Explorer'}
                onClick={() => setShowExploere((p) => !p)}
            />

            {/* AI chat close open */}
            <ActivityIcon
                icon={Bot}
                active={aichat}
                label={'AI Chat'}
                onClick={() => setAiChat((p) => !p)}
            />

            {/* TerminalIcons */}
            <div className="mt-auto flex flex-col items-center gap-2">
                <div className="mb-1 h-px w-6 bg-whtie/6" />
                <ActivityIcon
                    icon={SquareTerminal}
                    active={terminal}
                    label={'Terminal'}
                    onClick={() => setTerminal((p) => !p)}
                />
            </div>
        </div>
    )
}

export default ProjectActivityleftsideBar