

import { LogOut } from 'lucide-react'
import { useAppDispatch } from '../../Redux/hook'
import { clearUserdata } from '../../Redux/slice/UserAuth.slice'
import { userAuthProvider } from '../../utils/ContextApi'

interface Logoutprops {
    text: string,
}

const Logout = ({ text }: Logoutprops) => {
    const dispatch = useAppDispatch()
    const { logoutFun } = userAuthProvider()


    return (

        <div
            onClick={() => {
                logoutFun()
                dispatch(clearUserdata())
            }}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors duration-150 cursor-pointer`}
        >
            <LogOut size={13} />
            {text}
        </div>
    )
}

export default Logout