import { Navigate, Outlet, useLocation } from "react-router"
import { userAuthProvider } from "../utils/ContextApi"
import Header from "../components/Header/Header"
import PageLoader from "../components/Loader/PageLoader"
import LeftSidebar from "../components/LeftSidebar/LeftSidebar"


const PrivateLayout = () => {
    const { authUser, isLoading } = userAuthProvider()
    const location = useLocation();

    if (isLoading) {
        return <PageLoader className="h-10 w-10" />
    }
    if (!authUser?.token) {
        return <Navigate to="/login" replace state={{ from: location }} />
    }

    return (
        <div className="
         relative flex
        w-full h-screen flex-col
         overflow-hidden bg-slate-50 transition-colors duration-300
          dark:bg-dark
        ">

            <div className="
             pointer-events-none absolute -top-40 left-1/3  hidden
             h-175 w-175 rounded-full bg-white/4 blur-[140px] dark::block
            " />

            <div className="
             pointer-events-none absolute top-1/3 right-0  
             h-125 w-125 rounded-full bg-white/3 blur-[130px] dark::block
            " />


            <div className="relative flex min-h-0 flex-1 flex-col">
                <Header />

                {/*Below Header Section*/}
                <div className="flex -min-h-0 flex-1">

                    {/* Leftsidebar */}
                    <LeftSidebar />

                    {/* Rightsidebar */}
                    <div className="
                     min-h-0 flex-1 overflow-y-auto px-8 py-8 scrollbar-thin 
                     [scrollbar-color:rgba(100,116,139,0.35)_transparent] [&::-webkit-scrollbar]:w-2 
                     [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full 
                     [&::webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:border-2 
                     [&::-webkit-scrollbar-thumb]:border-solid [&::-webkit-scrollbar-thumb]:border-transparent
                     [&::-webkit-scrollbar-thumb]:bg-clip-padding hover:[&::-webkit-scrollbar-thumb]:bg-slate-400 
                     dark:[&::-webkit-scrollbar-thumb]:bg-white/10 dark:hover:[&::-webkit-scrollbar-thumb]:bg-white/20
                    ">
                        <Outlet />
                    </div>
                </div>
                {/*End Below Header Section*/}
            </div>
        </div>
    )
}

export default PrivateLayout