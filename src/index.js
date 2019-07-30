const { server } = require('../src/express/init')
const chalk = require('chalk')
require('./mongoose/connect')

const port = process.env.PORT || 3000

server.listen(
    port,
    () => {
        console.log(chalk.green.inverse('express') + chalk.green(' up on ') + chalk.green.inverse(port));
    }
)