const express = require('express')
const router = express.Router()
const { createGenericError } = require('../../util/errorMaster')
const auth = require('../middleware/auth')
const {
    createOrder,
    verifyPayment
} = require('../../razorpay/init')
const httpStatus = require('http-status-codes')

router.get(
    '/razorPayKey',
    auth,
    (req, res) => {
        res.send({ key: process.env.RAZOR_PAY_KEY })
    }
)

router.post(
    '/createOrder',
    auth,
    async (req, res) => {
        try {
            if (
                !req.body.amount ||
                !req.body.notes
            )
                return res
                    .status(httpStatus.BAD_REQUEST)
                    .send(createGenericError('Params missing'))
            createOrder(
                req.body.amount,
                req.body.notes,
                req.user._id,
                (err, order) => {
                    if (order) {
                        const orderToReturn = {
                            order_id: order.id,
                            amount: order.amount,
                            currency: order.currency,
                            notes: order.notes
                        }

                        res.send(orderToReturn)
                    } else {
                        console.log(err)
                        res.
                            status(httpStatus.BAD_REQUEST)
                            .send(createGenericError('Payment Error'))
                    }
                }
            )
        } catch (err) {
            console.log(err)
            return res
                .status(httpStatus.BAD_REQUEST)
                .send(createGenericError('Payment Error'))
        }
    }
)

router.post(
    '/verifyPayment',
    auth,
    (req, res) => {
        if (
            !req.body.orderId ||
            !req.body.paymentId ||
            !req.body.signature
        )
            return res
                .status(httpStatus.BAD_REQUEST)
                .send(createGenericError('Payment can not be verified'))
        try {
            verifyPayment(
                req.body.orderId,
                req.body.paymentId,
                req.body.signature,
                (val) => {
                    if (val == 'success') {
                        res.send('veified payment')
                    } else {
                        res
                            .status(httpStatus.BAD_REQUEST)
                            .send(createGenericError('Payment verification failed'))
                    }
                }
            )
        } catch (err) {
            console.log(err)
            res
                .status(httpStatus.BAD_REQUEST)
                .send(createGenericError('Payment verification failed'))
        }
    }
)

module.exports = router