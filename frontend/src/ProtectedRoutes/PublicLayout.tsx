import { Navigate, Outlet } from "react-router"
import { userAuthProvider } from "../utils/ContextApi"
// import PageLoader from "../components/Loader/PageLoader"
// import useTheme from "../hooks/useTheme";

const PublicLayout = () => {

    const { authUser } = userAuthProvider()
    // const { theme, toggleTheme } = useTheme();
    console.log('authUser', authUser)
    // if (isLoading) return <PageLoader className="h-10 w-10" />;

    if (authUser?.token) {
        return <Navigate to={'/projects'} replace />
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-dark overflow-hidden">

            {/* <button
                onClick={toggleTheme}
                className="px-3 py-2 rounded bg-slate-200 text-slate-900
                 dark:bg-slate-700 dark:text-white"
            >
                {theme === "dark" ? "Light mode" : "Dark mode"}
            </button> */}
            <Outlet />
        </div>
    )
}

export default PublicLayout