import { signInWithPopup } from "firebase/auth";
import Buttons from "../../../components/fields/Buttons"
import { FcGoogle } from "react-icons/fc";
import { auth, googleProvider } from "../../../Firebase/Firebase";
import { useApiPostrequest } from "../../../services/ApiMethods";
import { Routes } from "../../../types";
import { toast } from "react-toastify";
import { useState } from "react";
import { userAuthProvider } from "../../../utils/ContextApi";
import Spinner from "../../../components/Loader/Spinner";

const Login = () => {
    const { setAuthUser, refetchUser } = userAuthProvider();
    const [loading, setLoading] = useState<boolean>(false)

    const GoogleAuthentication = useApiPostrequest()

    const GoogleSign = async () => {
        setLoading(true)
        const data = await signInWithPopup(auth, googleProvider)
        console.log(data)
        const token = await data?.user?.getIdToken()
        console.log('token', token)

        GoogleAuthentication.mutate({
            URL: Routes.LOGIN_URL,
            payload: { token }
        }, {
            onSuccess: (data: any) => {
                // 1. update context immediately with the user from the login response
                if (data?.sessionId) localStorage.setItem('sessionId', data?.sessionId)
                if (data?.user) setAuthUser(data.user);
                // 2. sync with the server in the background (session cookie is now set)
                refetchUser();
                setLoading(false);
            },
            onError: (error: any) => {
                toast.error(error)
                setLoading(false)
            }
        })
    }



    return (
        <>
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-125 w-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-[120px]" />
            <div className="relative w-full max-w-md">
                {/* <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400 opacity-40 blur-2xl animate-pulse" /> */}
                <div className="w-full md:w-105 border border-slate-900 flex flex-col justify-center 
        items-center rounded-3xl p-10 space-y-5 bg-dark">

                    <div className="w-12.5 h-12.5 bg-white rounded-2xl flex justify-center items-center font-bold">
                        AI
                    </div>
                    <div className="w-full flex justify-center items-center flex-col">
                        <h2 className="text-center text-white text-xl  font-bold mb-1">
                            Welcome to Ai Editor
                        </h2>
                        <p className="text-xs text-slate-600">Sign in to access your projects and continue building</p>
                    </div>

                    <Buttons
                        btnText={loading ? <Spinner /> : "Sing in with google"}
                        type="button"
                        btnIcon={loading ? "" : <FcGoogle size={23} />}
                        onClick={GoogleSign}
                        disabled={loading}
                        className={`w-full! flex justify-center`}
                    />

                    <p className="text-[11px] text-slate-50">
                        By continuing you agree to our Temrs & Privacy Policy.
                    </p>
                </div>
            </div>

        </>

    )
}

export default Login