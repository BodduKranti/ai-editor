
interface btnProps {
    btnIcon?: any,
    btnText: any,
    onClick?: (values?: any) => void,
    btnColor?: "danger" | "warning" | "success" | "info" | "regular",
    type: "button" | "submit",
    className?: any,
    disabled?: boolean
}

const Buttons = ({
    btnIcon,
    btnText,
    btnColor = 'regular',
    type,
    onClick,
    className,
    disabled
}: btnProps) => {
    return (
        <button
            disabled={disabled}
            type={type}
            onClick={onClick}
            className={`${className} 
            ${btnColor === 'danger' && 'text-white bg-red-600 hover:bg-red-800'}
            ${btnColor === 'warning' && 'text-white bg-orange-600 hover:bg-orange-800'}
            ${btnColor === 'info' && 'text-white bg-blue-600 hover:bg-blue-800'}
            ${btnColor === 'success' && 'text-white bg-green-600 hover:bg-green-800'}
            flex items-center cursor-pointer shring-0 justify-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2.5 text-[13.5px] font-semibold text-white shadow-sm transition-opacity duration-150 hover:opacity-90 dark:bg-white dark:text-slate-900
        `}
        >
            {btnIcon && btnIcon}
            {btnText}</button>
    )
}

export default Buttons