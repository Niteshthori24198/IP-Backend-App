
const winston = require('winston')

const {MongoDB} = require('winston-mongodb')

require('dotenv')

const logger = winston.createLogger({

    level:"info",
    format:winston.format.json(),
    transports:[
        new MongoDB({
            db:'mongodb+srv://nitesh:nitesh@cluster0.piwmalq.mongodb.net/IPDB?retryWrites=true&w=majority',
            collection:"logs",
            options:{
                useUnifiedTopology: true
            }
        })

    ]

})

module.exports = {logger}