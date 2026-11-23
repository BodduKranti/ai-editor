import { AnimatePresence, motion } from "motion/react"
import { getFileIcon } from "../../../utils/customizeIcon"
import type { fileNode } from "../../../components/Folder/Folder"
import type { Dispatch, SetStateAction } from "react"
import { IoClose } from "react-icons/io5"
interface props {
    openTab: fileNode[],
    activeTab: any,
    setActiveTab: Dispatch<SetStateAction<any>>,
    setOpenTabs: Dispatch<SetStateAction<fileNode[]>>
}


const EditorTabs = ({
    openTab,
    activeTab,
    setActiveTab,
    setOpenTabs
}: props) => {

    const handleDelete = (e: React.MouseEvent, id: any) => {
        e.stopPropagation() // prevent the parent's onClick from re-activating this tab

        const index = openTab.findIndex((t) => t._id === id)
        const results = openTab.filter((t) => t._id !== id)
        setOpenTabs(results)

        // Only change the active tab if the closed tab was the active one
        if (activeTab?._id === id) {
            // pick the neighbor: the tab to the left, or the first one if none
            const next = results[index - 1] ?? results[0] ?? null
            setActiveTab(next)
        }
    }
    return (
        <div className="flex h-10 shrink-0 items-center overflow-x-auto border-b border-white/6 bg-[#111113]/90">
            <AnimatePresence initial={false}>
                {
                    openTab.map((tab) => {
                        const currentTab = tab?._id === activeTab?._id
                        const { color, icon: Icon } = getFileIcon(tab?.name)
                        return (
                            <motion.div
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 'auto' }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.15 }}
                                onClick={() => setActiveTab(tab)}
                                className={`
                                    
                                    ${currentTab ? 'bg-page text-white' : 'text-zinc-500 hover:bg-white/2 hover:text-zinc-300'}
                                    group relative flex h-full cursor-pointer items-center gap-2 whitespace-nowrap border-r border-white/5 px-3.5 transition-colors text-[11px]
                                     
                                    `}>
                                <Icon size={11} className={`${color}`} />
                                <span>{tab?.name}</span>

                                <span

                                    onClick={(e) => handleDelete(e, tab?._id!)}

                                    className="text-[11px]
                                         rounded p-0.5 text-zinc-500 opacity-0 hover:bg-white/10 hover:text-white group-hover:opacity-100"><IoClose /></span>

                                {
                                    currentTab && <motion.div
                                        className="absolute inset-x-0 bottom-0 h-0.5 
                                            bg-linear-to-r from-sky-400 to-violet-400"
                                        transition={{ duration: 0.2, ease: 'easeOut' }}
                                    />
                                }
                            </motion.div>)
                    })
                }
            </AnimatePresence>

        </div>
    )
}

export default EditorTabs