
import { TerminalSquare } from 'lucide-react'
import { motion } from 'motion/react'
import { userAuthProvider } from '../../../utils/ContextApi'
import { IoClose } from 'react-icons/io5'
import TerminalSection from './Terminal'
interface props {
    projectId: any
}
const CodeTerminal = ({ projectId }: props) => {
    const {
        setTerminal
    } = userAuthProvider()
    return (
        <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 256, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className='flex shrink-0 flex-col overflow-hidden border-t border-white/6 bg-[#111113]'
        >
            <div className='flex h-9 shrink-0 items-center justify-between border-b border-white/6 px-3'>
                <div className='flex items-center gap-1'>
                    <h2 className='relative flex items-center gap-1.5 rouded-md px-2.5 py-1.5 text-[11px] font-semibold tracking-wide transition-colors text-white'>
                        <TerminalSquare size={11} /> <span className=' uppercase'>Terminal</span>
                    </h2>
                </div>

                <button
                    onClick={() => setTerminal(false)}
                    className='rounded-md p-1 text-zinc-500 hover:bg-white/10 hover:text-white cursor-pointer'
                >
                    <IoClose size={11} />
                </button>
            </div>


            {/*Terminal */}
            <TerminalSection
                projectId={projectId}
            />
        </motion.div>
    )
}

export default CodeTerminal