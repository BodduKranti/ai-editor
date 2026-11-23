
import { Star, Trash2Icon } from 'lucide-react'
import { motion } from 'motion/react'
import { useApiDeleteRequest, useApiUpdateRequest } from '../../services/ApiMethods'
import { Routes } from '../../types'
import { toast } from 'react-toastify'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAppDispatch } from '../../Redux/hook'
import { getProjectByid } from '../../Redux/asyncThunk/Project.thunk'

interface ProjectListItemprops {
    _id: string,
    name: string,
    description: string,
    starred: boolean,
    owner: string
}

interface projectcard {
    list: ProjectListItemprops
}

const ProjectListItem = ({ list }: projectcard) => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [loading, setLoading] = useState<boolean>(false)
    const [confirmDelete, setConfirmDelete] = useState<boolean>(false)

    const queryClient = useQueryClient()
    const starProjectToggle = useApiUpdateRequest()
    const deleteProjectFun = useApiDeleteRequest()

    const toggelStarProject = () => {
        setLoading(true)
        starProjectToggle.mutate({
            URL: `${Routes.PROJECT_STAR_BY_PROJECTID}${list?._id}`,
            payload: {}
        }, {
            onSuccess: () => {
                setLoading(false)
                toast.success(`Successfull Project stared`)
                queryClient.invalidateQueries({ queryKey: [Routes.GET_ALL_PROJECTS] })
                queryClient.invalidateQueries({ queryKey: [Routes.GET_ALL_STARRED_PORJECTS] })
            },
            onError: (error: any) => {
                setLoading(false)
                toast.error(error?.response?.data?.message)
            }
        })
    }

    const deleteProject = () => {
        deleteProjectFun.mutate({
            URL: `${Routes.DELETE_PROJECT_BY_PROJECTID}/${list?._id}`,
            payload: {}
        }, {
            onSuccess: () => {
                toast.success("Project deleted successfully")
                queryClient.invalidateQueries({ queryKey: [Routes.GET_ALL_PROJECTS] })
                queryClient.invalidateQueries({ queryKey: [Routes.GET_ALL_STARRED_PORJECTS] })
            },
            onError: (error: any) => {
                toast.error(error?.response?.data?.message)
            }
        })
    }

    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 8
            }}
            animate={{
                opacity: 1,
                y: 0
            }}
            whileHover={{
                y: -3
            }}
            transition={{
                duration: 0.18,
                ease: 'easeOut'
            }}

            className='group relative cursor-pointer rounded-2xl border border-black/60 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] dark:border-white/7 dark:bg-white/3 dark:shadow-none dark:hover:border-white/14 dark:hover:bg-white/5
            '
        >
            <motion.div
                onClick={toggelStarProject}
                whileTap={{
                    scale: 0.9
                }}
                className={` absolute right-4 rounded-md p-1 transition-opacity hover:text-amber-400 ${list?.starred ? 'opacity-100 text-amber-400' : 'opacity-0 text-zinc-300 group-hover:opacity-100  dark:text-zinc-600'} ${loading ? 'cursor-wait opacity-60' : ''} `}
            >
                <Star className={`${list?.starred ? 'fill-amber-400 text-amber-400' : ''}`} size={14} />
            </motion.div>



            <h3
                onClick={() => {
                    navigate(`/projects/${list._id}`)
                    dispatch(getProjectByid(list._id))
                }}
                className='mb-1.5 truncate pr-6 text-[14px] font-semibold tracking-tight text-zinc-900 dark:text-white'>{list?.name}</h3>
            <p className='line-clamp-2 min-h-[2.5em] text-[12.5px] leading-snug text-zinc-500'>{list?.description || 'No Description'}</p>

            <div className='mt-4 flex items-center justify-end border-t border-black/5 pt-3 dark:border-white/6'>
                {
                    confirmDelete ?
                        <motion.div
                            // onClick={deleteProject}

                            initial={{
                                opacity: 0
                            }}

                            animate={{
                                opacity: 1
                            }}

                            exit={{
                                opacity: 0
                            }}

                            className='flex items-center gap-2'
                        >
                            <div
                                onClick={() => setConfirmDelete(false)}
                                className='rounded-md px-2 py-2 text-[11px] text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300'>Cancel</div>
                            <div className='rounded-md bg-red-500/10 px-2 py-1 text-[11px] font-medium text-red-500 hover:bg-red-500/20 disabled:cursor-wait disabled:opacity-50'
                                onClick={deleteProject}
                            >Yes</div>


                        </motion.div> :
                        <motion.div
                            initial={{
                                opacity: 0
                            }}
                            animate={{
                                opacity: 1
                            }}
                            exit={{
                                opacity: 0
                            }}

                            whileTap={{
                                scale: 0.92
                            }}

                            onClick={() => setConfirmDelete(true)}


                            className='flex items-center gap-1 rounded-md px-1.5 py-1 text-[11px] text-zinc-300 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100 dark:text-zinc-600 dark:hover:text-red-400'> <Trash2Icon size={14} />
                        </motion.div>
                }


            </div>
        </motion.div>
    )
}

export default ProjectListItem