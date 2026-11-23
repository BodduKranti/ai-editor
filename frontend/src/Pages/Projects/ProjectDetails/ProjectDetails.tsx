import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getProjectByid } from "../../../Redux/asyncThunk/Project.thunk";
import { useAppDispatch, useAppSelector } from "../../../Redux/hook";
import { AnimatePresence } from "motion/react";
import { userAuthProvider } from "../../../utils/ContextApi";
import ProjectExplorer from "./ProjectExplorer";
import { useApiGetRequest } from "../../../services/ApiMethods";
import { Routes } from "../../../types";
import { motion } from 'motion/react'
import { Circle, Code2, Eye, Maximize, Minimize } from "lucide-react";
import EditorScreen from "./EditorScreen";
import PreviewScreen from "./PreviewScreen";
import CodeTerminal from "./CodeTerminal";
import AiAssistanceComponent from "./AiAssistanceComponent";
import { useQueryClient } from "@tanstack/react-query";

const ProjectDetails = () => {
    const queryClient = useQueryClient()
    const dispatch = useAppDispatch()

    const [openTabs, setOpenTabs] = useState<any>([])
    const [activeTab, setActiveTab] = useState<any>(null)

    const {
        showExploere,
        preview, setPreview,
        isPreviewFullscreen, setIsPreviewFullscreen,
        terminal, aichat
    } = userAuthProvider()

    const { id } = useParams();
    const { data } = useAppSelector((state) => state.project)

    //Get AllTree
    const { data: getTree } = useApiGetRequest(`${Routes.GET_TREE_BY_ID}/${id}`, undefined, !!id)

    useEffect(() => {
        dispatch(getProjectByid(id))
    }, [id])

    const openFile = (file: any) => {
        const exist = openTabs.find((tab: any) => tab._id === file?._id)
        if (!exist) {
            setOpenTabs((prev: any) => [...prev, file])
        }
        setActiveTab(file)
        setPreview(false)
    }

    return (<>
        {/*leftside bar open close for explorer */}
        <AnimatePresence initial={false}>
            {
                showExploere &&
                <ProjectExplorer
                    getTree={Array.isArray(getTree) && getTree || []}
                    projectId={data?._id}
                    openFile={openFile}
                    setOpenTabs={setOpenTabs}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
            }
        </AnimatePresence>

        <div className="w-full flex flex-col justify-between h-full">
            <div className={`w-full relative min-w-0 flex-1 flex-col overflow-hidden border-x border-white/5 md:flex`}>

                <div className="pointer-events-none absolute right-2 top-2 z-40 flex items-center gap-1.5 sm:right-4 sm:top-3 sm:gap-2">
                    {/* minimise and maximise */}

                    {preview && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            onClick={() => setIsPreviewFullscreen((p) => !p)}
                            title={`${isPreviewFullscreen ? 'Exit Fullscreen' : 'Fullscreen preview'}`}
                            className="pointer-events-auto flex items-center justify-center rounded-lg border border-white/10 bg-[!111113]/95 p-1.5 text-zinc-400 shadow-lg shadow-black/40 backdrop-blur-xl hover:text-white sm:p-2"
                        >
                            {
                                isPreviewFullscreen ? <Minimize size={13} /> : <Maximize size={13} />
                            }
                        </motion.div>
                    )}

                    <div className={`pointer-events-auto flex items-center gap-0.5 rounded-lg broder-white/10 bg-[#111113]/95 p-1 shadow-lg shadow-black/40 backdrop-blur`}>
                        {/*Editor*/}

                        <div
                            onClick={(e) => {
                                e.stopPropagation()
                                setPreview(false)
                                setIsPreviewFullscreen(false)
                                setActiveTab((prev: any) => ({ ...prev }))
                            }}
                            className={`relative cursor-pointer flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-semibold transition-colors sm:px-3 sm:py-1.5 sm:text-xs ${!preview ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>
                            {
                                !preview && (
                                    <motion.div
                                        className="absolute inset-0 rounded-md bg-linear-to-b from-zinc-700 to-zinc-800"
                                        transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                                    />
                                )
                            }

                            <Code2 size={13} className="relative" />
                            <span className="relative hidden sm:inline">Editor</span>
                        </div>

                        {/*Preview*/}
                        <div
                            onClick={(e) => {
                                e.stopPropagation()
                                setPreview(true)
                                setActiveTab((prev: any) => ({ ...prev }))
                                queryClient.invalidateQueries({ queryKey: [`${Routes.GET_TREE_BY_ID}/${id}`] })
                            }}
                            className={`relative cursor-pointer flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-semibold transition-colors sm:px-3 sm:py-1.5 sm:text-xs ${preview ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>

                            {
                                preview && (
                                    <motion.div
                                        className="absolute inset-0 rounded-md bg-linear-to-b from-zinc-700 to-zinc-800"
                                        transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                                    />
                                )
                            }

                            <Eye size={13} className="relative" />
                            <span className="relative hidden sm:inline">Preview</span>

                        </div>
                    </div>
                </div>

                {!activeTab &&
                    <div className="flex flex-1 h-full flex-col items-center justify-center gap-3 bg-dark text-zinc-600">
                        <div className='flex h-14 w-14 text-center justify-center items-center rounded-2xl border border-white/6 bg-white/2'>
                            <Circle size={22} className="text-zinc-700" />
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-sm font-medium text-zinc-400">No File open</span>
                            <span className="text-xs text-zinc-600">Select a file from Explorer to start editing</span>
                        </div>
                    </div>}

                {/* Editor & Preview */}
                {
                    openTabs?.length > 0 &&
                    <div className="flex min-h-0 flex-1 h-full overflow-hidden">
                        {preview ?
                            <PreviewScreen
                                getTree={getTree}

                            /> : <EditorScreen
                                openTab={openTabs}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                                setOpenTabs={setOpenTabs}
                            />}
                    </div>
                }


                <AnimatePresence initial={false}>
                    {preview && isPreviewFullscreen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.18, ease: 'easeInOut' }}
                            className="fixed  inset-0 z-100 bg-white"
                        >
                            <PreviewScreen
                                getTree={getTree} />

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                onClick={() => setIsPreviewFullscreen(false)}
                                title={`${isPreviewFullscreen ? 'Exit Fullscreen' : 'Fullscreen preview'}`}
                                className="absolute right-2 top-2 z-110 flex items-center gap-1.5 rounded-lg border border-whtie/10 bg-[#111113]/95 px-2.5 py-1.5 text-[11px] font-medium text-zinc-300 shadow-lg shadow-black/40 backdrop-blur hover:text-white sm:right-4 sm:top-3 sm:px-3 sm:text-xs"
                            >
                                <Minimize size={13} />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>


            </div>

            {

                terminal &&
                <AnimatePresence>
                    <div className="max-h-[45vh] md:max-h-none ">
                        <CodeTerminal
                            projectId={id}
                        />
                    </div>

                </AnimatePresence>

            }
        </div>


        {aichat && <AiAssistanceComponent projectId={id} />}

    </>

    )
}

export default ProjectDetails