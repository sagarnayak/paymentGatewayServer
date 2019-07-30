const razorPay = require('razorpay')

const pay = razorPay(
    {
        key_id: process.env.RAZOR_PAY_KEY,
        key_secret: process.env.RAZOR_PAY_SECRET
    }
)