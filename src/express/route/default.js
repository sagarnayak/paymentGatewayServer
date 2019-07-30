const express = require('express')
const router = express.Router()

router.get(
    '/',
    (req, res) => {
        res.send('welcome to payment gateway application.')
    }
)

router.get(
    '/*',
    (req, res) => {
        res.send('looks like you are lost, please visit home page')
    }
)

module.exports = router