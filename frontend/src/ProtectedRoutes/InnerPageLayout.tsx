import { Navigate, Outlet, useLocation } from "react-router";
import { userAuthProvider } from "../utils/ContextApi";
import PageLoader from "../components/Loader/PageLoader";
import ProjectNavbar from "../components/Header/ProjectNavbar";
import ProjectActivityleftsideBar from "../components/LeftSidebar/ProjectActivityleftsideBar";
// import { useState } from "react";
import MobileActivity from "../components/MobileActivity/MobileActivity";

const InnerPageLayout = () => {
    const { authUser, isLoading } = userAuthProvider()
    const location = useLocation();

    // const [mobilePannel, setMobilePannel] = useState<any>('explorer')

    if (isLoading) {
        return <PageLoader className="h-10 w-10" />
    }
    if (!authUser?.name) {
        return <Navigate to="/login" replace state={{ from: location }} />
    }
    return (
        <div className="relative flex h-screen flex-col overflow-hidden bg-page ">
            <div className="pointer-event-none absolute -top-40 left-1/3 h-96 w-96 rounded-full bg-sky-500/10 blur-[140px]" />
            <div className="pointer-events-none absolute -top-20 right-1/4 h-80 w-80 rounded-full bg-violet-500/10 blur-[140px]" />

            <ProjectNavbar />

            {/* Select Project Inside sTructure */}
            <div className="flex flex-1 overflow-hidden">
                {/* Projectleftsidebar */}
                <ProjectActivityleftsideBar />


                {/* <AnimatePresence initial={false}>
                    {showExploere && <ProjectExplorer />}
                </AnimatePresence> */}
                {/* Projectrightidebar */}
                <Outlet />
            </div>

            <div className="flex relative items-center justify-around border-t border-white/6 bg-[#0f0f12] py-2 md:hidden">
                <MobileActivity />
            </div>

        </div>
    )
}

export default InnerPageLayout