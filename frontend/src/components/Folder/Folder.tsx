
import { ChevronRight, FilePlus2, FolderClosed, FolderOpen, FolderPlus } from 'lucide-react'
import { motion } from 'motion/react'
import { useState, type Dispatch, type SetStateAction } from 'react'
import { getFileIcon, getFoldercolor } from '../../utils/customizeIcon'
import { useApiDeleteRequest, useApiPostrequest, useApiUpdateRequest } from '../../services/ApiMethods'
import { Routes } from '../../types'
import { toast } from 'react-toastify'
import OnContextMenu from '../OnContextMenu/OnContextMenu'

export interface fileNode {
    owner: string,
    parentId: string | null,
    projectId: string | null,
    name: string,
    type: "file" | "folder",
    extension: string,
    language: string,
    content: string,
    size: number,
    isDeleted: boolean,
    _id: string | null,
    children: any
}


interface Folderprops {
    projectId: string | null,
    getTree: any,
    reloadTree: () => void,
    node: fileNode,
    openFile: (file: any) => void,
    setOpenTabs: Dispatch<SetStateAction<any>>,
    activeTab: any,
    setActiveTab: Dispatch<SetStateAction<any>>
}

const Folder = ({
    projectId,
    getTree,
    reloadTree,
    node,
    openFile,
    setOpenTabs,
    activeTab,
    setActiveTab
}: Folderprops) => {
    const [filename, setFileame] = useState<string>('')
    const [foldername, setFoldername] = useState<string>('')

    const [createingFoldrIn, setCreateingFoldrIn] = useState<any>(null)
    const [createingFileIn, setCreateingFileIn] = useState<any>(null)

    const [rename, setRename] = useState<boolean>(false)
    const [renameval, setRenameval] = useState<any>('')

    //context menu right click on the folder
    const [menu, setMenu] = useState<any>(null)

    const [open, setOpen] = useState<boolean>(false)
    const folderColor = getFoldercolor(node?.name)
    const { icon: Icon, color } = getFileIcon(node?.name)

    const CreateFoler = useApiPostrequest() //Create Folder method
    const CreateFile = useApiPostrequest() //Create File method
    const updateFile = useApiUpdateRequest() //update folder and file name
    const deleteFileandfolder = useApiDeleteRequest() //Delete folder and file

    //Create Folder method
    const createfolderNew = () => {
        const payload = {
            projectId,
            name: foldername,
            parentId: node?._id
        }
        CreateFoler.mutate({
            URL: Routes.CREATE_FOLDER,
            payload
        }, {
            onSuccess: () => {
                console.log('Successfull created folder')
                reloadTree()
            },
            onError: (error: any) => {
                toast.error(error?.response?.data?.message)
            }
        })
    }

    //Create File Method
    const CreateFileFun = () => {

        //get language from extension
        const lang = filename?.split(".").pop()

        const payload = {
            projectId,
            name: filename,
            parentId: node?._id,
            // content,
            language: lang
        }
        CreateFile.mutate({
            URL: Routes.CREATE_FILE,
            payload
        }, {
            onSuccess: () => {
                console.log('Successfull created File')
                reloadTree()
            },
            onError: (error: any) => {
                toast.error(error?.response?.data?.message)
            }
        })
    }

    //update file & folder Method
    const updateFileFun = () => {

        const payload = {
            name: renameval,
            content: node?.content || ''
        }

        updateFile.mutate({
            URL: `${Routes.UPDATE_FILE_BY_ID}/${node?._id}`,
            payload
        }, {
            onSuccess: () => {
                reloadTree()
            },
            onError: (error: any) => {
                toast.error(error?.response?.data?.message)
            }
        })
    }

    //Delete file & Folder Method
    const deleteFileFun = () => {

        deleteFileandfolder.mutate({
            URL: `${Routes.DELETE_FILE_BY_ID}/${node?._id}`,
        }, {
            onSuccess: () => {
                reloadTree()
                // setOpenTabs((prev: any) => prev?.filter((t: any) => t._id !== node?._id))
                // setActiveTab((prev: any) => prev?._id === node?._id ? null : activeTab)
            },
            onError: (error: any) => {
                toast.error(error?.response?.data?.message)
            }
        })
    }

    //Parent In for folder icon click
    const handleNewFolder = (folder: any) => {
        setCreateingFoldrIn(folder._id)
        setCreateingFileIn(null)
    }

    //Parent In for file icon click
    const handleNewFile = (folder: any) => {
        setCreateingFoldrIn(null)
        setCreateingFileIn(folder._id)
    }



    return (
        <div className="relative">
            <motion.div
                whileHover={{ x: 2 }}
                transition={{ duration: 0.15, ease: 'easeInOut' }}
                className='group flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-white/5 transition-colors'
                // onContextMenu={(e) => {
                //     e.preventDefault();
                //     setMenu({ x: e.clientX, y: e.clientY })
                // }}
                onContextMenu={(e) => {
                    e.preventDefault()
                    setMenu({ x: e.clientX, y: e.clientY })
                }}
            >
                <div

                    onClick={() => {
                        setOpen((p) => !p)
                        if (node?.type === 'file') {
                            openFile?.(node)
                        }
                    }}
                    className='flex min-w-0 flex-1 cursor-pointer items-center gap-1.5'>

                    {
                        node?.type === 'folder' ? <>
                            <motion.div
                                animate={{ rotate: open ? 90 : 0 }}
                                transition={{ duration: 0.15, ease: "easeOut" }}
                                className='shrink-0'
                            >
                                <ChevronRight size={14} className='text-zinc-500' />
                            </motion.div>

                            {
                                open ?
                                    <FolderOpen size={13} className={`shrink-0 ${folderColor}`} /> :
                                    <FolderClosed size={13} className={`shrink-0 ${folderColor}`} />
                            }
                        </> :
                            <Icon size={13} className={`shrink-0 ${color}`} />
                    }



                    <span className='truncate text-[11px] text-zinc-300 transition-colors group-hover:text-white'>
                        {node?.name}
                    </span>
                </div>


                {/* Open folder and file input filed when click on the respected icon */}
                {
                    node?.type === 'folder' &&
                    <div className='hidden text-center gap-0.5 group-hover:flex'>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.92 }}
                            className='cursor-pointer rounded-md p-1 text-zinc-500 hover:bg-white/10 hover:text-white'
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpen(true)
                                handleNewFile(node)
                            }}
                        >
                            <FilePlus2 size={14} />
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.92 }}
                            className='cursor-pointer rounded-md p-1 text-zinc-500 hover:bg-white/10 hover:text-white'
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpen(true)
                                handleNewFolder(node)
                            }}
                        >
                            <FolderPlus size={14} />
                        </motion.button>
                    </div>
                }

            </motion.div>

            {/* right click context menu */}
            <OnContextMenu
                onClickfile={() => handleNewFile(node)}
                menu={menu}
                setMenu={setMenu}
                onClickfolder={() => handleNewFolder(node)}
                type={node?.type}
                setRename={setRename}
                parentId={node?.parentId}
                deleteFileFun={deleteFileFun}
            />


            {open &&
                (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.16, ease: 'easeOut' }}
                        className='ml-3.5 overflow-hidden border-l border-white/5 pl-1'
                    >
                        {
                            node?.children?.map((child: any) => (
                                <Folder
                                    projectId={projectId}
                                    getTree={getTree}
                                    reloadTree={reloadTree}
                                    node={child}
                                    openFile={openFile}
                                    setOpenTabs={setOpenTabs}
                                    activeTab={activeTab}
                                    setActiveTab={setActiveTab}
                                />
                            ))
                        }
                    </motion.div>
                )
            }


            {/* Create folder input text */}
            {
                (createingFoldrIn === node?._id) && (
                    <div className='py-1 pl-1'>
                        <motion.input
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            autoFocus
                            value={foldername}
                            placeholder='Folder Name'
                            className='w-full rounded-md border border-white/1 bg-white/4 px-2.5 py-1.5 text-[13px] text-white placeholder-zinc-500 outline-none transition-all focus:border-sy-400/50 focus:ring-2 focus:ring-sky-400/15'
                            onChange={(e) => setFoldername(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    createfolderNew()
                                    setFoldername("")
                                    setCreateingFoldrIn(null)
                                }
                                if (e.key === 'Escape') {
                                    setFoldername("")
                                    setCreateingFoldrIn(null)
                                }

                            }}
                        />
                    </div>
                )
            }

            {/* Create File input text */}
            {
                (createingFileIn === node?._id) && (
                    <div className='py-1 pl-1'>
                        <motion.input
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            autoFocus
                            value={filename}
                            placeholder='File Name'
                            className='w-full rounded-md border border-white/1 bg-white/4 px-2.5 py-1.5 text-[13px] text-white placeholder-zinc-500 outline-none transition-all focus:border-sy-400/50 focus:ring-2 focus:ring-sky-400/15'
                            onChange={(e) => setFileame(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    CreateFileFun()
                                    setFileame("")
                                    setCreateingFileIn(null)
                                }
                                if (e.key === 'Escape') {
                                    setFileame("")
                                    setCreateingFileIn(null)
                                }

                            }}
                        />
                    </div>
                )
            }


            {/* update file name input text */}
            {
                (rename) && (
                    <div className='py-1 pl-1'>
                        <motion.input
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            autoFocus
                            value={renameval}
                            placeholder={node?.name}
                            className='w-full rounded-md border border-white/1 bg-white/4 px-2.5 py-1.5 text-[13px] text-white placeholder-zinc-500 outline-none transition-all focus:border-sy-400/50 focus:ring-2 focus:ring-sky-400/15'
                            onChange={(e) => setRenameval(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    updateFileFun()
                                    setRenameval("")
                                    setRename(false)
                                }
                                if (e.key === 'Escape') {
                                    setRenameval("")
                                    setRename(false)
                                }

                            }}
                        />
                    </div>
                )
            }


        </div>
    )
}

export default Folder