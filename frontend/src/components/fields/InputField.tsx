
interface InputFieldprops {
    className?: any,
    label?: string,
    errors: any;
    message?: string,
    placeholder?: string,
    type: "email" | "password" | "text"
}

// export const inputBase = `
//   w-full rounded-xl border border-black/8  px-3 py-2.5 text-sm outline-none transition-colors
//   border-slate-300 bg-white text-slate-900 placeholder:text-slate-400
//   focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10
//   dark:border-slate-700/70 dark:bg-white/2 dark:text-white dark:placeholder:text-slate-500
//   dark:focus:border-slate-400 dark:focus:ring-white/10
// `;

export const inputBase = `
  w-full rounded-xl border border-black/8 bg-black/2 px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus-border-sky-400/60 focus:bg-white focus:ring-4 focus:ring-sky-400/15 dark:border-white/9 dark:bg-white/4 dark:text-white dark:placeholder-zinc-500 dark:focus:bg-white/6 dark:focus:ring-sky-400/6
`;
const InputField = ({
    className,
    label,
    errors,
    message,
    placeholder,
    type,
    ...register
}: InputFieldprops) => {
    return (
        <div className="w-full flex flex-col gap-1">
            {label && <label htmlFor={label}>label</label>}
            <input
                placeholder={placeholder}
                className={`${inputBase} ${className}`}
                id="email"
                type={type}
                aria-invalid={errors ? "true" : "false"}
                {...register}
            />
            {errors && <p className="text-xs text-red-600 dark:text-red-400">{message}</p>}
        </div>
    )
}

export default InputField