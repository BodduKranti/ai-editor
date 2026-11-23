
const Spinner = ({ className = "h-5 w-5" }: { className?: string }) => {
    return (
        <span
            role="status"
            aria-label="Loading"
            className={`
        inline-block animate-spin rounded-full border-2 motion-reduce:animate-none
        border-slate-300 border-t-slate-900
        dark:border-slate-700 dark:border-t-white
        ${className}
      `}
        />
    )
}

export default Spinner