
import { useQueryClient } from '@tanstack/react-query'
import { motion } from 'motion/react'
import { Routes } from '../../../types'
import { FolderTree, RefreshCcw } from 'lucide-react'
import Folder from '../../../components/Folder/Folder'
// import type { Dispatch } from '@reduxjs/toolkit'
import type { Dispatch, SetStateAction } from 'react'

interface explorerProps {
    getTree: any,
    projectId: string | undefined,
    openFile: (file: any) => void,
    setOpenTabs: Dispatch<SetStateAction<any>>,
    activeTab: any,
    setActiveTab: Dispatch<SetStateAction<any>>
}

const ProjectExplorer = ({
    getTree,
    projectId,
    openFile,
    setOpenTabs,
    activeTab,
    setActiveTab
}: explorerProps) => {
    const queryClient = useQueryClient()

    const reloadGetTreefun = () => {
        queryClient.invalidateQueries({ queryKey: [`${Routes.GET_TREE_BY_ID}/${projectId}`] })
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: -16, width: 0 }}
            animate={{ opacity: 1, x: 0, width: 350 }}
            exit={{ opacity: 0, x: -16, width: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`flex flex-col overflow-hidden border-r border-white/6 bg-[#111113]/90 backdrop-blur-xl`}
        >
            <div className='flex h-10 w-full shrink-0 items-center justify-between border-b border-white/6 px-3'>
                <span className='text-[11px] font-semibold tracking-wider text-zinc-500'>EXPLORER1</span>

                <motion.div
                    whileHover={{ rotate: 60 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    onClick={reloadGetTreefun}
                    className={`rounded-md p-1 text-zinc-400 transition-colors hover:bg-white/7 hover:text-white`}
                    title='Refresh'
                >
                    <RefreshCcw size={14} />
                </motion.div>
            </div>

            <div className='
             w-full flex-1 overflow-y-auto px-1 py-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/15 [&::-webkit-scrollbar-thumb]:transition-colors
            '
                style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent " }}
            >
                {Array.isArray(getTree) && getTree?.length === 0 ? (
                    <div className='flex flex-col items-center gap-2 px-3 py-10 text-center'>
                        <FolderTree size={22} className='text-zinc-700' />
                        <span className='text-[12px] text-zinc-600'>Empty Workspace</span>
                    </div>
                ) : (<>
                    {
                        Array.isArray(getTree) && getTree?.map((p) => (
                            <Folder
                                projectId={projectId!}
                                getTree={getTree}
                                reloadTree={reloadGetTreefun}
                                node={p}
                                openFile={openFile}
                                setOpenTabs={setOpenTabs}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                            />))
                    }
                </>)}
            </div>
        </motion.div>
    )
}

export default ProjectExplorer