import { createContext, useCallback, useContext, useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { useApiGetRequest, useApiPostrequest } from "../services/ApiMethods";
import { Routes } from "../types";
import { useQueryClient } from "@tanstack/react-query";

interface AuthUser {
    _id: string,
    name: string,
    email: string,
    avatar: string,
    token: string | null
}

interface ContextProps {
    authUser: AuthUser | null;
    logoutFun: () => void,
    isLoading?: boolean,
    setAuthUser: (user: AuthUser | null) => void;
    refetchUser: () => void;
    showExploere: boolean,
    setShowExploere: Dispatch<SetStateAction<boolean>>,
    aichat: boolean,
    setAiChat: Dispatch<SetStateAction<boolean>>,
    terminal: boolean,
    setTerminal: Dispatch<SetStateAction<boolean>>,
    preview: boolean,
    setPreview: Dispatch<SetStateAction<boolean>>,
    showEditor: boolean,
    setShowEditor: Dispatch<SetStateAction<boolean>>,
    isPreviewFullscreen: boolean,
    setIsPreviewFullscreen: Dispatch<SetStateAction<boolean>>
}

export const AuthContext = createContext<ContextProps | null>(null)

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const queryClient = useQueryClient();
    const { data: userData, isLoading, refetch } = useApiGetRequest(Routes.CURRENT_USER)

    //porject top bar
    const [preview, setPreview] = useState<boolean>(false)
    const [isPreviewFullscreen, setIsPreviewFullscreen] = useState<boolean>(false)

    //LeftSideBarprojecticons
    const [showExploere, setShowExploere] = useState<boolean>(false)
    const [showEditor, setShowEditor] = useState<boolean>(false)
    const [aichat, setAiChat] = useState<boolean>(false)
    const [terminal, setTerminal] = useState<boolean>(false)

    //logout section
    const logOut = useApiPostrequest()

    // Writes a user (or null) into the cached CURRENT_USER query, so authUser updates instantly
    const setAuthUser = useCallback(
        (user: AuthUser | null) => {
            queryClient.setQueriesData(
                {
                    predicate: (query) => query.queryKey.includes(Routes.CURRENT_USER),
                },
                user
            );
        },
        [queryClient]
    );

    const logoutFun = useCallback(() => {
        logOut.mutate(
            { URL: Routes.LOGOUT_URL, payload: {} },
            {
                onSuccess: () => {
                    setAuthUser(null)
                    localStorage.removeItem("sessionId")
                    queryClient.invalidateQueries({ queryKey: [Routes.CURRENT_USER] })
                },
                onError: (error: any) => console.log(error),
            }
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setAuthUser]);

    const authUser = useMemo<AuthUser | null>(() => {
        if (!userData) return null;
        return {
            _id: userData._id,
            name: userData.name,
            email: userData.email,
            avatar: userData.avatar,
            token: localStorage.getItem('sessionId') || null
        };
    }, [userData]);

    // Memoized so consumers don't re-render on every provider render
    const value = useMemo(
        () => ({
            authUser,
            logoutFun,
            isLoading,
            setAuthUser,
            refetchUser: () => { refetch(); },
        }),
        [authUser,
            setAuthUser,
            logoutFun,
            refetch,
            isLoading,
        ]
    );


    return (
        <AuthContext.Provider value={{
            ...value, showExploere,
            setShowExploere,
            aichat, setAiChat,
            terminal, setTerminal,
            preview, setPreview,
            showEditor, setShowEditor,
            isPreviewFullscreen, setIsPreviewFullscreen
        }}>
            {children}
        </AuthContext.Provider>
    )
}



const userAuthProvider = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuthContext must be used within AuthContextprovider");
    }
    return context;
};

export { AuthProvider, userAuthProvider }