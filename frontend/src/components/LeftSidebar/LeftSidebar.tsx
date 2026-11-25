
import { Folder, Star } from "lucide-react";
import { motion } from "motion/react"
import { NavLink } from "react-router";
import UserDetails from "../UserDetails/UserDetails";
const LeftSidebar = () => {
    const MotionNavLink = motion.create(NavLink); // older versions: motion(NavLink)

    return (
        <div className="flex h-full w-64 shrink-0 flex-col border-r border-slate-200/70 bg-white/60 px-3 py-5 font-sans backdrop-blur-xl transition-colors duration-300 dark:border-white/6 dark:bg-white/2">


            <div className="flex flex-col gap-1">
                <MotionNavLink
                    to={'/projects'}
                    // initial={{}}
                    // animate={{}}
                    // transition={{}}
                    // onClick={() => setActivePage('starred')}
                    whileTap={{ scale: 0.97 }}
                    className={({ isActive }) => `
                     relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-colors duration-150 ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-500 hover:bg-slate-100/80 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-white/4 dark:hover:text-slate-200'}
                    
                    `}
                >



                    {({ isActive }) => (
                        <>
                            {isActive && (
                                <motion.div
                                    layoutId="sidebar-active-pill"
                                    className="absolute inset-0 rounded-lg border border-slate-900/10 bg-slate-900/5 dark:border-white/10 dark:bg-white/10"
                                    transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                                />
                            )}
                            <Folder
                                size={17}
                                strokeWidth={2}
                                className="relative"
                            />
                            <span className="relative z-10">Projects</span>
                        </>
                    )}

                </MotionNavLink>

                <MotionNavLink
                    to={"/starred"}
                    // initial={{}}
                    // animate={{}}
                    // transition={{}}
                    // onClick={() => setActivePage('projects')}
                    whileTap={{ scale: 0.97 }}
                    className={({ isActive }) => `
                     relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-colors duration-150 ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-500 hover:bg-slate-100/80 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-white/4 dark:hover:text-slate-200 cursor-pointer'}
                    
                    `}
                >
                    {({ isActive }) => (
                        <>

                            {isActive && (
                                <motion.div
                                    layoutId="sidebar-active-pill"
                                    className="absolute inset-0 rounded-lg border border-slate-900/10 bg-slate-900/5 dark:border-white/10 dark:bg-white/10"
                                    transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                                />
                            )}
                            <Star
                                size={17}
                                strokeWidth={2}
                                className="relative"
                            />
                            <span className="relative z-10">Starred</span>
                        </>
                    )}
                </MotionNavLink>
            </div>

            <UserDetails />
        </div>
    )
}

export default LeftSidebar