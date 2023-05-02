
require('dotenv')

const mongoose = require('mongoose')

const connection = mongoose.connect('mongodb+srv://nitesh:nitesh@cluster0.piwmalq.mongodb.net/IPDB?retryWrites=true&w=majority')

module.exports = {connection}