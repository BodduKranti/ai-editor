import { useAppSelector } from "../../Redux/hook"
import type { projectProps } from "../../Redux/slice/Project.Slice"
import { motion } from 'motion/react'
import { Code2, Eye } from "lucide-react"
import { userAuthProvider } from "../../utils/ContextApi"
import { Link } from "react-router"
const ProjectNavbar = () => {
    const { data } = useAppSelector((state) => state.project)
    const projectDetails: projectProps | null = data && data

    const { preview, setPreview } = userAuthProvider()

    return (
        <div className="relative flex h-12 items-center justify-between border-b border-white/6 bg-[#111113] px-4 backdrop-blur-xl">
            <div className="flex items-center gap-3">
                <Link to={"/projects"} className="text-white text-lg font-bold  ">Ai Editor</Link>

                <div className="w-px h-4 bg-white/10" />
                {/* */}
                <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[13px]">
                        📁
                    </div>
                    <div className="max-w-55 truncate text-sm font-medium text-zinc-300">
                        {projectDetails?.name || 'Project'}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-1.5">
                <motion.button
                    whileHover={{
                        scale: 1.05
                    }}
                    whileTap={{
                        scale: 0.95
                    }}
                    onClick={() => setPreview((p) => !p)}
                    title={preview ? "Show Editor" : 'Show Preview'}
                    className={`relative flex items-center justify-center rounded-lg p-2 transition-colors ${preview ? 'text-sky-400' : 'text-zinc-400 hover:text-zinc-200'}`}
                >
                    <motion.div
                        className=" absolute inset-0 bg-white/6"
                        transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
                    />

                    {preview ? <Eye size={16} className="relative" /> : <Code2 className="relative" size={16} />}
                </motion.button>


            </div>

        </div>
    )
}

export default ProjectNavbar