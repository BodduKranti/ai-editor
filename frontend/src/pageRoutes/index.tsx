import { createBrowserRouter, Navigate } from "react-router";
import PublicLayout from "../ProtectedRoutes/PublicLayout";
import Login from "../Pages/auth/login/Login";
import PrivateLayout from "../ProtectedRoutes/PrivateLayout";
import Projects from "../Pages/Projects/Projects";
import Starred from "../Pages/Starred/Starred";
import ProjectDetails from "../Pages/Projects/ProjectDetails/ProjectDetails";
import InnerPageLayout from "../ProtectedRoutes/InnerPageLayout";
import PlanpageLayout from "../ProtectedRoutes/PlanpageLayout";
import Plan from "../Pages/Plan/Plan";

export const PageRoutes = createBrowserRouter([
    {
        element: <PublicLayout />,
        children: [
            {
                path: '/login',
                element: <Login />
            }
        ]
    },
    {
        element: <PrivateLayout />,
        children: [
            {
                path: '/projects',
                element: <Projects />
            },

            {
                path: "/starred",
                element: <Starred />
            }
        ]

    },
    {
        element: <InnerPageLayout />,
        children: [
            {
                path: '/projects/:id',
                element: <ProjectDetails />
            },
        ]
    },
    {
        element: <PlanpageLayout />,
        children: [
            {
                path: "/plan",
                element: <Plan />
            }
        ]
    },
    {
        path: '*',
        element: <Navigate to={"/projects"} />
    }
])