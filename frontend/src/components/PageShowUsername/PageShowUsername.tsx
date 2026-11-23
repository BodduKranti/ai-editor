import { userAuthProvider } from "../../utils/ContextApi"

const PageShowUsername = () => {
    const { authUser } = userAuthProvider()
    return (
        <div>
            <h1 className="flex items-center gap-2 text-[26px] font-bold text-slate-900 dark:text-white">Welcome Back, {""} {authUser?.name || 'User'} <span>👋</span></h1>
            <p className="mt-1 text-[13.5px] text-slate-500 dark:text-slate-400">Ready to build something amazing today?</p>
        </div>
    )
}

export default PageShowUsername