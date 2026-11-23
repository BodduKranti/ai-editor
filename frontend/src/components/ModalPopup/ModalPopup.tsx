import type { ReactNode } from "react"
import { IoMdClose } from "react-icons/io"
import { motion } from 'motion/react'

interface modalCard {
    open: boolean,
    onClose: () => void,
    children: ReactNode,
    className?: any,
    modalTitle: string,
    modalDesc?: string
}

const ModalPopup = ({
    open,
    onClose,
    children,
    className,
    modalTitle,
    modalDesc
}: modalCard) => {
    return (
        <div className={`
        ${className} 
         fixed inset-0 z-50 items-center justify-center p-4
        ${open ? 'flex' : 'hidden'}
        `}>
            <motion.div
                onClick={onClose}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className=" fixed inset-0 bg-dark/20 backdrop-blur-sm dark:bg-black/60"
            />
            <div className="pointer-events-none absolute -z-10 h-115 w-115 rounded-full bg-sky-300/20 blur-[130px] dark:bg-sky-500/10" />


            {/* Center Cards */}
            <motion.div
                initial={{
                    opacity: 0,
                    y: 10,
                    scale: 0.98
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1
                }}
                exit={{
                    opacity: 0,
                    y: 10,
                    scale: 0.98
                }}
                transition={{
                    duration: 0.28,
                    ease: [0.16, 1, 0.3, 1]
                }}
                className={`
                     relative w-full max-w-md overflow-hidden rounded-[28px] border border-black/8 bg-white/70 shadow-[0_20px_-15px_rgba(0,0,0,0.7)] backdrop-blur-2xl dark:border-white/1 dark:bg-white/5 dark:shadow-[0_20px_70px_-15px_rgba(0,0,0,0.7)]
                    `}
            >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/80 to-transparent dark:via-white/30" />

                <div className="flex flex-col space-y-2 w-full items-center justify-between border-b border-black/6 px-7 py-6 dark:border-white/8">

                    <div className="w-full flex justify-between items-center">
                        <div className="w-auto">
                            {modalTitle &&
                                <h2 className="text-[17px] font-semibold tracking-tight text-zinc-900 dark:text-white">{modalTitle}</h2>}
                            {modalDesc && <p className="text-xs text-zinc-500 dark:text-zinc-400 cursor-pointer">{modalDesc}</p>}
                        </div>
                        <div
                            onClick={onClose}
                            className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-black/5 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/7 dark:hover:text-white cursor-pointer" ><IoMdClose size={18} /></div>

                    </div>

                </div>

                <div className="px-7 py-6">
                    {children}
                </div>

            </motion.div>

        </div>
    )
}

export default ModalPopup