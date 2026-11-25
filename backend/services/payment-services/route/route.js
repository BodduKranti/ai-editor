import express from 'express'
import { createorderControler, paymentVeryfyControler } from '../controller/payment.controller.js'
const routes = express.Router()
routes.post('/payment-verify', paymentVeryfyControler)
routes.post('/create-order', createorderControler)
export default routes