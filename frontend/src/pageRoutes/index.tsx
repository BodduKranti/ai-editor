import { createBrowserRouter, Navigate } from "react-router";
import PublicLayout from "../ProtectedRoutes/PublicLayout";
import Login from "../Pages/auth/login/Login";
import PrivateLayout from "../ProtectedRoutes/PrivateLayout";
import Projects from "../Pages/Projects/Projects";
import Starred from "../Pages/Starred/Starred";
import ProjectDetails from "../Pages/Projects/ProjectDetails/ProjectDetails";
import InnerPageLayout from "../ProtectedRoutes/InnerPageLayout";

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
        path: '*',
        element: <Navigate to={"/projects"} />
    }
])