import { Coins, Zap } from "lucide-react"
import { motion } from 'motion/react'
import { useNavigate } from "react-router"
import { userAuthProvider } from "../../utils/ContextApi"
const UserDetails = () => {
    const navivate = useNavigate()
    const { authUser } = userAuthProvider()
    return (
        <div className="w-full">
            <div className="my-4 h-px bg-slate-200/70 dark:bg-white/6" />


            <div className="mb-3 rounded-xl border border-slate-200/70 bg-white/70 p-3.5 shadow-sm backdrop-blur-xl dark:border-white/7 dark:bg-white/3 dark:shadow-none">
                <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900/5 text-slate-700 dark:bg-white/10 dark:text-white">
                        <Coins size={12} />
                    </div>
                    <span className="text-[12px] font-medium text-slate-600 dark:text-slate-400">AI Credits</span>
                    <span className="text-[15px] font-bold text-slate-900 dark:text-white">{authUser?.credits || 0}</span>
                </div>
            </div>

            <div className="my-4 h-px bg-slate-200/70 dark:bg-white/6" />

            <div className="rounded-xl border border-slate-200/70 bg-white/70 p-3.5 shadow-sm backdrop-blur-xl dark:border-white/7 dark:bg-white/3 dark:shadow-none">
                <p className="mb-1 text-[12.5px] font-medium text-slate-700 dark:text-slate-300">Updagrade Plan</p>
                <p className="mb-3 text-[11.5px] leading-snug text-slate-400 dark:text-slate-500">
                    Upgrade to Pro for more credits
                </p>


                <motion.button
                    onClick={() => {
                        navivate('/plan')
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className={`flex w-full items-center justify-center gap-1.5 rounded-lg bg-slate-900 py-2 text-[12.5px] font-semibold text-white shadow-sm transition-opacity duration-150 hover:opacity-90 dark:bg-white dark:text-slate-900`}
                >
                    <Zap size={14} />   Upgrade Now
                </motion.button>
            </div>
        </div>

    )
}

export default UserDetails