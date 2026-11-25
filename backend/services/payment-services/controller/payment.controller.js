import Payment from "../model/payment.model.js"
import razorpay from "../config/razorpay.js"
import crypto from 'crypto'
import { addCredits } from "../utlis/updateCredits.js"

const plans = {
    pro: {
        name: 'Pro',
        amount: 29900,//razorpay show the paise so we habe multiply with 100
        credits: 500,
    },
    team: {
        name: 'Team',
        amount: 79900,//razorpay show the paise so we habe multiply with 100
        credits: 2000,
    },
}



console.log(plans.pro.price)     // 10
console.log(plans['pro'].name)   // "Pro"

export const createorderControler = async (req, res) => {
    try {
        const userId = req.headers[`x-user-id`]
        if (!userId) {
            return res.status(400).json({ message: `User ID not found` })
        }

        const { plan } = req.body
        const selectedPlan = plans[plan]
        if (!selectedPlan) {
            return res.status(400).json({ message: 'Plan not found' })
        }

        const order = await razorpay.orders.create({
            amount: selectedPlan?.amount,
            currency: "INR",
            receipt: `receipt-${Date.now()}`,
            notes: { userId, plan }
        })

        console.log('order', order)


        const payment = await Payment.create({
            userId,
            plan,
            credits: selectedPlan?.credits,
            amount: selectedPlan.amount,
            razorpayOrderId: order?.id,
            currency: "INR",
            status: 'created'
        })


        return res.status(200).json({
            order: {
                id: order?.id,
                amount: order?.amount,
                currency: 'INR'
            },
            plan: {
                name: selectedPlan?.name,
                credits: selectedPlan?.credits
            },
            key_id: process.env.RAZORPAY_API_KEY
        })


        // await Payment
    } catch (error) {
        return res.status(500).json({ message: `Create Order getting error ${error}` })
    }
}

export const paymentVeryfyControler = async (req, res) => {
    try {

        const userId = req.headers[`x-user-id`]
        if (!userId) {
            return res.status(400).json({ message: `User ID not found` })
        }

        const {
            razorpayOrderId,
            razorpay_payment_id,
            razorpay_signature } = req.body

        if (!razorpayOrderId ||
            !razorpay_payment_id ||
            !razorpay_signature) {
            return res.status(400).json({
                message: `razorpayOrderId, 
            razorpay_payment_id, 
            razorpay_signature not found`})
        }

        const payment = await Payment.findOne({
            razorpayOrderId
        })

        if (!payment) {
            return res.status(400).json("Payment not found")
        }

        if (payment.status === 'paid') {
            return res.status(400).json({
                message: 'Payment is already verified'
            })
        }

        const generatedSignature = crypto.createHmac("sha256",
            process.env.RAZORPAY_SECRET_KEY).
            update(`${razorpayOrderId}|${razorpay_payment_id}`)
            .digest('hex')

        if (generatedSignature !== razorpay_signature) {
            payment.status = 'failed'
            await payment.save()
            return res.status(400).json({ message: 'Invalid payment singature' })
        }

        payment.status = 'paid'
        payment.razorpayPaymentId = razorpay_payment_id
        await payment.save()

        const data = await addCredits({
            userId,
            credits: payment.credits
        })
        return res.status(200).json({ message: `Payment Verified`, data })
        // await Payment
    } catch (error) {
        return res.status(500).json({ message: `Payment Verify error ${error}` })
    }
}