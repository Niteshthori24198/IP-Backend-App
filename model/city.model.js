
const mongoose = require('mongoose')

const { UserModel } = require('./user.model')

const citySchema = mongoose.Schema({

    userId:{type:mongoose.Schema.Types.ObjectId, ref:UserModel , required:true},

    previousSearches:[{type:String,required:true}]

},

    {versionKey:false}

)


const CityModel = mongoose.model("city",citySchema)

module.exports = {CityModel}