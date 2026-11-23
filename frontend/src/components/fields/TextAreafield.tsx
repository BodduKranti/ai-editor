import { inputBase } from "./InputField"

interface TextAreafieldprops {
    value?: any,
    label?: string,
    placeholder?: string,
    rows: number,
    cols: number,
    className?: any,
    error?: any,
    message?: string,
    onChange?: (value?: any) => void
}


const TextAreafield = ({
    label,
    rows = 5,
    cols = 5,
    placeholder,
    className,
    error,
    message,
    ...register
}: TextAreafieldprops) => {
    return (
        <div className="w-full flex flex-col gap-1">
            {label && <label htmlFor={label}>label</label>}
            <textarea
                rows={rows}
                cols={cols}
                placeholder={placeholder}
                className={`${inputBase} ${className}`}
                id={label}
                aria-invalid={error ? "true" : "false"}
                {...register}
            />
            {error && <p className="text-xs text-red-600 dark:text-red-400">{message}</p>}
        </div>

    )
}

export default TextAreafield