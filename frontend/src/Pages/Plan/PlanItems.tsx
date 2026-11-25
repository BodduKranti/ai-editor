import { Check, Zap } from "lucide-react"
import Buttons from "../../components/fields/Buttons"
import type { planProps } from "./PlanOrder"

interface planItemsProps {
    plan: planProps,
    onClick: () => void
}

const PlanItems = ({ plan, onClick }: planItemsProps) => {
    const Icon = plan.icon

    return (
        <div className="w-full">
            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900/5 text-slate-700 dark:bg-white/10 dark:text-white">
                <Icon size={23} />
            </div>
            <h1 className="text-lg font-bold">{plan?.name}</h1>
            <p className="mt-1 min-h-10 text-xs leading-5 text-slate-500 dark:text-slate-400">{plan?.description}</p>

            <div className="mt-5 flex items-end gap-1">
                <span className="text-3xl font-bold tracking-tight"> {plan?.price}</span>
                <span className="mb-1 text-sx text-slate-400">{plan?.period}</span>
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-700 dark:border-white/7 dark:bg-white/4 dark:text-slate-200"><Zap size={14} className="text-indigo-500" />{plan?.credits}</div>

            <Buttons
                disabled={plan?.current}
                onClick={onClick}
                btnText={plan?.button}
                type="button"
                className={`${plan?.popular ? 'bg-indigo-600! text-white! shadow-lg! shadow-indigo-500/20! hover:bg-indigo-500! w-full!' :
                    plan?.current ?
                        'cursor-default! bg-slate-100! text-slate-400! dark:bg-white/6! dark:text-slate-500! w-full!'
                        :
                        'w-full! bg-slate-900! text-white!  hover:opacity-90 dark:bg-white! dark:text-slate-900!'} mt-5 rounded-lg! py-2.5 text-xs font-semibold transition`

                }
            />

            <div className="mt-6 border-t border-slate-200 pt-5 dark:border-white/7">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Includes</p>
                <ul className="space-y-3">
                    {plan?.features?.map((l) => (
                        <li key={l} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                            <Check size={14} className="mt-0.5 shrink-0 text-emerald-500" />
                            <span>{l}</span>
                        </li>
                    ))}
                </ul>

            </div>
        </div>
    )
}

export default PlanItems