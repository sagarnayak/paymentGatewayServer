const express = require('express')
const app = express()

const defaultRouter = require('./route/default')

app.use(express.json())
app.use(defaultRouter)

const http = require('http')
const server = http.createServer(app)

module.exports = {
    server
}