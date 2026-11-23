import { Check, Loader2, Save } from 'lucide-react'
import { getFileIcon } from '../../../utils/customizeIcon'
import { AnimatePresence, motion } from 'motion/react'
interface props {
    activeTab: any,
    onClick: () => void,
    saving: boolean,
    justSaved: boolean
}
const SelectedFileEditor = ({
    activeTab,
    onClick,
    saving,
    justSaved
}: props) => {

    const ActiveIcon = getFileIcon(activeTab?.name)?.icon
    const activeColor = getFileIcon(activeTab?.name)?.color

    return (
        <div className="flex h-10 shrink-0 items-center gap-3 border-b border-white/6 px-4">
            <div className="flex items-center gap-2 text-zinc-400">
                <ActiveIcon size={11} className={`${activeColor}`} />
                <span className="text-[11px]">
                    {activeTab?.name}
                </span>
            </div>
            <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onClick}
                className="flex items-center gap-2 rounded-lg bg-linear-to-b from-sky-500 to-sky-600 px-3 py-1.5 text-xs font-medium text-white shadow-[0_1px_0_rgba(255={}255,255,255,0.2)_inset] transition-colors hover:from-sky-400 hover:to-sky-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
                <AnimatePresence initial={false} mode="wait">
                    {
                        saving ? (<motion.span
                            key={'saving'}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2"
                        >
                            <Loader2 size={11} className=" animate-spin" /> Saving
                        </motion.span>)
                            :
                            justSaved ?
                                (<motion.span
                                    key={'saved'}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center gap-2"
                                >
                                    <Check size={11} /> Saved
                                </motion.span>)
                                :
                                (<motion.span
                                    key={'saved'}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center gap-2"
                                >
                                    <Save size={11} /> Save
                                </motion.span>)
                    }
                </AnimatePresence>
            </motion.div>
        </div>
    )
}

export default SelectedFileEditor