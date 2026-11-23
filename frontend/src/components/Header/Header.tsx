import useTheme from "../../hooks/useTheme";
import { MdOutlineDarkMode } from "react-icons/md";
import { MdDarkMode } from "react-icons/md";
import Userprofile from "./Userprofile";
const Header = () => {
    const { theme, toggleTheme } = useTheme();


    return (
        <div className="
                w-full h-16 bg-white/70 dark:bg-white/3 backdrop-blur-xl
                 border-b border-slate-200 dark:border-white/7 flex 
                 items-center px-6 gap-6 font-sans transition-colors duration-300
            ">
            {/* Right side */}
            <div className="flex items-center gap-2.5 shrink-0">
                <span className="
                     text-slate-900 dark:text-white font-bold text-[17px]
                      tracking-tight
                    ">Ai-Editor</span>
            </div>

            {/* Left Side */}
            <div className="flex-1" />
            <div className="flex items-center gap-2 shrink-0">

                <div className="w-auto flex justify-end items-center gap-3">
                    <button
                        onClick={toggleTheme}
                        className="px-3 py-2 rounded bg-slate-200 text-slate-900
                 dark:bg-slate-700 dark:text-white"
                    >
                        {theme === "dark" ? <MdOutlineDarkMode /> : <MdDarkMode />}
                    </button>
                    <Userprofile />
                </div>
            </div>
        </div>
    )
}

export default Header