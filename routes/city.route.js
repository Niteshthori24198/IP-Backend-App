
const { Router } = require('express')

const cityRouter = Router()

const { CityModel } = require('../model/city.model')

const { UserModel } = require('../model/user.model')

const Redis = require('ioredis')

const redis = new Redis()


cityRouter.get("/location/:IP", async (req, res) => {

    const { IP } = req.params;

    const {userId} = req.body;

    let isvalid = checkingvalidIP(IP)

    console.log(isvalid)


    if (isvalid) {

        redis.get("IP", async (err, result) => {

            if (!result) {

                let IPlocation = await fetch(`https://ipapi.co/${IP}/json/`)

                IPlocation = await IPlocation.json()

                redis.set("IP",IPlocation.city, "EX",21600)


                await CityModel.findOneAndUpdate({userId},{userId, $push:{previousSearches:IPlocation.city}},{new:true, upsert:true, setDefaultsOnInsert:true})

                return res.status(200).send({"location":IPlocation.city})


            }
            else{
                return res.status(200).send({"location":result})
            }

        })

    }

    else {

        return res.status(400).send({ "msg": "kindly provide valid IP address" })
    }


})



function checkingvalidIP(ip) {

    let re = /^(\d{1,3}\.){3}\d{1,3}$/

    return re.test(ip)


}



module.exports = { cityRouter }