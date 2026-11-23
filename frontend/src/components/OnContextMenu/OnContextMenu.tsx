
import { FilePlus2, FolderPlus, Pencil, Trash } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import type { Dispatch, SetStateAction } from 'react'
import { createPortal } from 'react-dom'

interface onContextMenuprops {
    menu: any,
    setMenu: Dispatch<SetStateAction<any>>
    onClickfile: () => void,
    onClickfolder: () => void,
    type: 'file' | 'folder',
    setRename: Dispatch<SetStateAction<boolean>>,
    parentId: any,
    deleteFileFun: () => void
}

const OnContextMenu = ({
    menu,
    setMenu,
    onClickfile,
    onClickfolder,
    type,
    setRename,
    parentId,
    deleteFileFun
}: onContextMenuprops) => {
    return (
        <>
            {typeof document !== "undefined" &&
                createPortal(
                    <AnimatePresence>
                        {menu && (
                            <>
                                <motion.div
                                    key="backdrop"
                                    className="fixed inset-0 z-40"
                                    onClick={() => setMenu(null)}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                />

                                <motion.div
                                    key="menu"
                                    initial={{ opacity: 0, scale: 0.96, y: -6 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.96, y: -6 }}
                                    transition={{ duration: 0.14, ease: "easeOut" }}
                                    className="fixed z-50 w-52 rounded-xl border border-white/10 bg-[#17171a]/95 py-1.5 shadow-2xl shadow-black/50 backdrop-blur-xl"
                                    style={{ top: menu.y, left: menu.x }}
                                >

                                    {type === 'folder' && <>

                                        {/* menu items */}
                                        <button
                                            className='mx-1 flex w-[calc(100%-8px)] items-center gap-2 rounded-md px-3 py-2 text-left text-[11px] text-zinc-300 transition-colors hover:bg-white/6 hover:text-white'
                                            onClick={() => {
                                                setMenu(null)
                                                onClickfile?.()
                                            }}

                                        >
                                            <FilePlus2 size={11} />
                                            New File
                                        </button>

                                        <button
                                            className='mx-1 flex w-[calc(100%-8px)] items-center gap-2 rounded-md px-3 py-2 text-left text-[11px] text-zinc-300 transition-colors hover:bg-white/6 hover:text-white'
                                            onClick={() => {
                                                setMenu(null)
                                                onClickfolder?.()
                                            }}

                                        >
                                            <FolderPlus size={11} />
                                            New Folder
                                        </button>

                                        <div className='my-1 h-px bg-white/8' />
                                    </>}

                                    <button
                                        className='mx-1 flex w-[calc(100%-8px)] items-center gap-2 rounded-md px-3 py-2 text-[11px] text-zinc-300 transition-colors hover:bg-white/6 hover:text-white'
                                        onClick={() => {
                                            setMenu(null)
                                            setRename(true)
                                        }}
                                    >
                                        <Pencil size={11} />
                                        Rename
                                    </button>

                                    {/* Not showing the root folder */}
                                    {
                                        parentId !== null &&
                                        <button
                                            onClick={() => {
                                                setMenu(null)
                                                deleteFileFun()
                                            }}
                                            className='mx-1 flex w-[calc(100%-8px)] items-center gap-2 rounded-md px-3 py-2 text-[11px] text-zinc-300 transition-colors hover:bg-white/6 hover:text-white'
                                        >
                                            <Trash size={11} />
                                            Delete
                                        </button>
                                    }
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>,
                    document.body
                )}
        </>
    )
}

export default OnContextMenu