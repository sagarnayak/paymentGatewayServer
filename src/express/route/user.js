const express = require('express')
const router = express.Router()
const { createGenericError } = require('../../util/errorMaster')
const User = require('../../mongoose/model/user')
const validator = require('validator')
const auth = require('../middleware/auth')
const httpStatus = require('http-status-codes')

router.post(
    '/signUp',
    async (req, res) => {
        try {
            if (!req.body.name)
                return res
                    .status(httpStatus.BAD_REQUEST)
                    .send(createGenericError('Provide user name'))
            if (!req.body.email)
                return res
                    .status(httpStatus.BAD_REQUEST)
                    .send(createGenericError('Provide email id'))
            if (!req.body.password)
                return res
                    .status(httpStatus.BAD_REQUEST)
                    .send(createGenericError('Provide password'))
            const user = await new User(req.body).save()
            const token = await user.generateAuthToken()
            res.send({ user, token })
        } catch (error) {
            if (error.name === 'ValidationError') {
                if (error.errors.name) {
                    return res
                        .status(httpStatus.BAD_REQUEST)
                        .send(createGenericError(error.errors.name.message))
                }
                if (error.errors.email) {
                    return res
                        .status(httpStatus.BAD_REQUEST)
                        .send(createGenericError(error.errors.email.message))
                }
                if (error.errors.password) {
                    return res
                        .status(httpStatus.BAD_REQUEST)
                        .send(createGenericError(error.errors.password.message))
                }
            }
            if (error.code === 11000)
                return res
                    .status(httpStatus.BAD_REQUEST)
                    .send(createGenericError('User with same email already exist.'))
            res
                .status(httpStatus.BAD_REQUEST)
                .send(error)
        }
    }
)

router.post(
    '/login',
    async (req, res) => {
        try {
            if (!req.body.email || !req.body.password || !validator.isEmail(req.body.email))
                return res
                    .status(httpStatus.BAD_REQUEST)
                    .send({ error: 'email and password required.' })

            const user = await User.findOne({ email: req.body.email })
            if (!user)
                return res
                    .status(httpStatus.UNAUTHORIZED)
                    .send(createGenericError('authentication failure'))

            const passwordMatched = await user.isPassword(req.body.password)
            if (!passwordMatched)
                return res
                    .status(httpStatus.UNAUTHORIZED)
                    .send(createGenericError('authentication failure'))

            const token = await user.generateAuthToken()
            res.send({ user, token })
        } catch (err) {
            console.log(err)
            res
                .status(httpStatus.BAD_REQUEST)
                .send(createGenericError('Getting error, please contact support'))
        }
    }
)

router.post(
    '/logout',
    auth,
    async (req, res) => {
        try {
            const user = req.user
            user.tokens = user.tokens.filter(
                (token) => {
                    return token.token !== req.token
                }
            )

            await user.save()

            res.send()
        } catch (error) {
            console.log(error)
            res
                .status(httpStatus.BAD_REQUEST)
                .send(error)
        }
    }
)

module.exports = router