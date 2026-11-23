import { useState } from "react"
import { userAuthProvider } from "../../utils/ContextApi"
import { ChevronUp } from 'lucide-react'
import Logout from "../Logout/Logout"
const Userprofile = () => {
    const { authUser } = userAuthProvider()
    const [menuOpen, setMenuOpen] = useState<boolean>(false)
    const initials = authUser?.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || 'Guest'

    return (
        <div className="relative">
            <button
                onClick={() => setMenuOpen((p) => !p)}
                className="
             flex items-center gap-2 pl-1.5 pr-2
              h-10 rounded-lg hover:bg-slate-100 dark:hover:bg-white/6 transition-colors duration-150
            ">
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-slate-600 to-slate-700 dark:from-slate-200 dark:to-white flex items-center justify-center overflow-hidden ring-1 ring-black/5 dark:ring-white/20">
                    <span className="text-[12px] font-semibold text-white dark:text-slate-900">{initials}</span>

                </div>
                <span className="text-[13.5px] font-medium text-slate-700 dark:text-slate-200 hidden sm:inline">{authUser?.name}</span>
                <ChevronUp size={14}
                    className={`text-shadow-slate-400 dark:text-slate-500  duration-150 ${menuOpen ? "rotate-180" : ''}`}
                />


            </button>

            {
                menuOpen &&
                <div className="absolute right-0 mt-2 w-52 bg-white/95 dark:bg-[#12121c]/95 backdrop-blur-xl border border-slate-200 dark:border-white/8 rounded-xl shadow-xl py-1.5 z-50 animate-[fadeIn_0.15c_ease-out]">
                    <div className=" px-3 py-2.5 border-b border-slate-100 dark:border-white/6 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-slate-600 to-slate-700 dark:from-slate-200 dark:to-white flex items-center justify-center overflow-hidden ring-1 ring-black/5 dark:ring-white/20 shrink-0">
                            <span className="text-[12px] font-semibold text-white dark:text-slate-900">{initials}</span>
                        </div>

                        <div className="min-w-0">
                            <p className="text-[13px] font-medium text-slate-800 dark:text-slate-200 truncate">{authUser?.name}</p>
                            <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">{authUser?.email}</p>
                        </div>
                    </div>

                    <Logout text="Logout" />
                </div>
            }
        </div>
    )
}

export default Userprofile