import { Zap } from "lucide-react"
import { motion } from 'motion/react'
const UserDetails = () => {
    return (
        <div className="rounded-xl border border-slate-200/70 bg-white/70 p-3.5 shadow-sm backdrop-blur-xl dark:border-white/7 dark:bg-white/3 dark:shadow-none">
            <p className="mb-1 text-[12.5px] font-medium text-slate-700 dark:text-slate-300">Updagrade Plan</p>
            <p className="mb-3 text-[11.5px] leading-snug text-slate-400 dark:text-slate-500">
                Upgrade to Pro for more credits
            </p>


            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`flex w-full items-center justify-center gap-1.5 rounded-lg bg-slate-900 py-2 text-[12.5px] font-semibold text-white shadow-sm transition-opacity duration-150 hover:opacity-90 dark:bg-white dark:text-slate-900`}
            >
                <Zap size={14} />   Upgrade Now
            </motion.button>
        </div>
    )
}

export default UserDetails