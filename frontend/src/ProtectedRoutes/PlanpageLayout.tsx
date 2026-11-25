import { Navigate, Outlet, useLocation, useNavigate } from "react-router"
import PageLoader from "../components/Loader/PageLoader"
import { userAuthProvider } from "../utils/ContextApi"
import { ArrowLeft } from "lucide-react"

const PlanpageLayout = () => {
    const navigate = useNavigate()
    const { authUser, isLoading } = userAuthProvider()
    const location = useLocation()

    if (isLoading) {
        return <PageLoader className="h-10 w-10" />
    }

    if (!authUser?.token) {
        return <Navigate to="/login" replace state={{ from: location }} />
    }

    return (
        <div className="w-full min-h-screen bg-slate-50 px-5 py-8 text-salte-900 dark:bg-dark dark:text-white">
            <div className="pointer-events-none fixed left-1/2 top-0 h-125 w-175 -translate-x-1/2 rounded-full bg-indigo-500/8 blur-[140px]" />
            <div className="relative mx-auto max-w-6xl">
                <div className="mb-12 flex items-center justify-between">
                    <button
                        onClick={() => {
                            navigate('/projects')
                        }}
                        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-white/8 dark:bg-white/3 dark:text-slate-300 dark:hover:bg-white/6"
                    >
                        <ArrowLeft size={16} /> Back
                    </button>

                    <div className="text-sm font-semibold">
                        AI Editor
                    </div>
                </div>

                <Outlet />
            </div>

        </div>
    )
}

export default PlanpageLayout