
const { Router } = require('express')

const userRouter = Router()

require('dotenv')

const { UserModel } = require('../model/user.model')

const jwt = require('jsonwebtoken')

const bcrypt = require('bcrypt')

const Redis = require('ioredis')

const redis = new Redis()




userRouter.post("/register", async (req, res) => {

    const { email, pass, city } = req.body;

    if (!email || !pass || !city) {
        return res.status(400).send({ "error": "kindly enter required details !!" })
    }

    try {

        const isPresent = await UserModel.findOne({ email })

        if (isPresent) {
            return res.status(400).send({ "msg": "User Already present !!", "user": isPresent })
        }


        bcrypt.hash(pass, 5, async (err, hash) => {

            if (err) {
                return res.status(400).send({ "msg": "Something went wrong. Try again" })
            }

            else {

                const user = new UserModel({ email, pass: hash, city })

                await user.save()

                return res.status(200).send({ "msg": "registration done successfully", "User": user })

            }

        })


    }

    catch (error) {

        return res.status(400).send({ "error": error.message })
    }

})




userRouter.post("/login", async (req, res) => {

    const { email, pass } = req.body;

    if (!email || !pass) {
        return res.status(400).send({ "msg": "Kindly enter required crendentials for login" })
    }


    try {

        const isPresent = await UserModel.findOne({ email })

        if (!isPresent) {
            return res.status(400).send({ "msg": "User isn't present !!" })
        }

        bcrypt.compare(pass, isPresent.pass, async (err, result) => {

            if (!result) {
                return res.status(400).send({ "msg": "Invalid Password detected !!" })
            }

            else {

                const token = jwt.sign({ userId: email }, "NiteshJWT", { expiresIn: '60m' })

                redis.set(email, token, "EX", 3600)

                return res.status(200).send({ "msg": "Login Done Successfully" })

            }

        })


    }

    catch (error) {
        return res.status(400), send({ "error": error.message })

    }


})



userRouter.get("/logout", (req, res) => {

    const { email } = req.body;

    redis.get(email, (err, data) => {

        if (data) {

            redis.get("BlacklistedToken", (err, result) => {

                if (result) {

                    result=JSON.parse(result)

                    if (result.includes(data)) {
                        return res.status(400).send({ "msg": "token is blacklisted !!" })
                    }

                    else {

                        result.push(data)

                        redis.set("BlacklistedToken", JSON.stringify(result), "EX", 21600)

                        return res.status(200).send({"msg":"Logout done Successfully"})
                    }
                }

                else {

                    result = []

                    result.push(data)

                    redis.set("BlacklistedToken", JSON.stringify(result), "EX", 21600)

                    return res.status(200).send({"msg":"Logout done Successfully"})

                }

            })


        }
        else {
            return res.status(400).send({ "msg": "Invalid token found !" })
        }

    })

})


module.exports = {userRouter}