import { Sparkle } from "lucide-react"
import PlanItems from "./PlanItems"
import { plans, type planProps } from "./PlanOrder"
import { motion } from 'motion/react'
import { useApiAIPostrequest } from "../../services/ApiMethods"
import { Routes } from "../../types"
import { toast } from "react-toastify"
import { useQueryClient } from "@tanstack/react-query"

const Plan = () => {
    const data: planProps[] = plans
    const queryClient = useQueryClient()
    const { mutate } = useApiAIPostrequest()

    const paymentOrder = (plan: string) => {
        console.log('plan', plan)
        mutate({
            URL: Routes.CREATE_PAYMENT,
            payload: { plan }
        },
            {
                onSuccess: (data: any) => {
                    console.log(`payment details`, data)
                    const options = {
                        key: data?.key_id,
                        amount: data?.order?.amount,
                        currency: data?.order?.currency || 'INR',
                        name: "AI-Editor",
                        description: `Plan - ${plan.toUpperCase()}`,
                        order_id: data?.order?.id,
                        handler: async (res: any) => {
                            console.log('plan res', res)
                            const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = res
                            //                             {
                            //     "razorpay_payment_id": "pay_U4Kh4Oid115AZ3",
                            //     "razorpay_order_id": "order_U4JztjsHey4OdQ",
                            //     "razorpay_signature": "d28b6abc9c38dc7e0842bef1be4a16a39ab1b32c78443b434f81bef47150a9bf"
                            // }

                            mutate({
                                URL: Routes.VERIFY_PAYMENT,
                                payload: {
                                    razorpayOrderId: razorpay_order_id,
                                    razorpay_payment_id,
                                    razorpay_signature
                                }
                            }, {
                                onSuccess: () => {
                                    toast.success(`Payment verify successfully`)
                                    queryClient.invalidateQueries({ queryKey: [Routes.CURRENT_USER] })
                                },
                                onError: (error: any) => {
                                    toast.error(`${error?.response?.data?.message}`)
                                }
                            })
                        },
                        theme: {
                            color: '#4f46e5'
                        }
                    }
                    const rzp = new (window as any).Razorpay(options)
                    rzp.open()
                    toast.success(`Successfully credits`)
                },
                onError: (error: any) => {
                    toast.error(`${error?.response.data?.message}`)
                }
            })
    }

    // razorpayOrderId,
    //         razorpay_payment_id,
    //         razorpay_signature

    return (
        <>

            <div className="mx-auto mb-12 max-w-2xl text-center">
                <div className="mx-auto mb-4 flex w-fit items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-300">
                    <Sparkle size={13} />
                    Simple pricing for developer
                </div>

                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                    Build more.
                    <span className="text-indigo-500">{""} Ship faster</span>
                </h1>
                <p className="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Choose a plan that gives you the AI credits you need to build and iterate faster.
                </p>
            </div>


            <div className="w-full grid grid-cols-1 gap-3 md:grid-cols-3">
                {data?.map((p, index) => (
                    <motion.div
                        key={p.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.98 }}
                        whileHover={{
                            y: -4
                        }}
                        className={`relative flex flex-col rounded-2xl border p-6 transition ${p.popular ? `border-indigo-500/40 bg-white shadow-xl shadow-indigo-500/10 dark:bg-white/5` : `border-slate-200 bg-white/70 dark:border-white/8 dark:bg-white/0.25`}`}
                    >
                        {
                            p?.popular &&
                            <div className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white`}>
                                Most Popular
                            </div>
                        }
                        <PlanItems plan={p} key={p?.key} onClick={() => paymentOrder(p.key)} />
                    </motion.div>
                ))}

            </div>

            <div className="mt-10 text-center text-[11px] text-slate-400 dark:text-slate-600">
                Credit reset every month, Unused credits do not roll over.
            </div>
        </>

    )
}

export default Plan