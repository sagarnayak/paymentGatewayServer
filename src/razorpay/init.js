const razorPay = require('razorpay')
const crypto = require('crypto')

const pay = new razorPay(
    {
        key_id: process.env.RAZOR_PAY_KEY,
        key_secret: process.env.RAZOR_PAY_SECRET
    }
)

const getReceipt = (user) => {
    return user + new Date().getTime()
}

const createOrder = (
    amount,
    notes,
    userId,
    callBack
) => {
    const options = {
        amount,
        currency: "INR",
        receipt: getReceipt(userId),
        payment_capture: 1,
        notes
    }

    pay.orders.create(
        options,
        function (err, order) {
            if (err) {
                callBack(err, null)
            } else {
                callBack(null, order)
            }
        }
    )
}

const verifyPayment = (
    orderId,
    paymentId,
    signature,
    callBack
) => {
    const hmac = crypto.createHmac('sha256', process.env.RAZOR_PAY_SECRET)
    hmac.on('readable', () => {
        const data = hmac.read()
        if (data) {
            if (data.toString('hex') == signature) {
                callBack("success")
            } else {
                callBack("fail")
            }
        }
    });

    hmac.write(orderId + "|" + paymentId)
    hmac.end()
}


module.exports = {
    createOrder,
    verifyPayment
}