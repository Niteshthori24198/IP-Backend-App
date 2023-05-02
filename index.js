
const express = require('express')

const app = express()

app.use(express.json())


const { connection } = require('./db')

const { userRouter } = require('./routes/user.route')

const { auth } = require('./middleware/auth')

const { logger } = require('./logger/logger')

const {cityRouter} = require('./routes/city.route')



require('dotenv')




app.use("/user", userRouter)


app.use(auth)

app.use("/city",cityRouter)





app.all("*" , (req,res)=>{
    return res.status(404).send({"error":"Invalid URL !! "})
})



app.listen(3000, async () => {

    try {

        await connection

        console.log("connected to DB")

        logger.log("info", "Database connected")

    }

    catch (error) {

        logger.log("error", "Database connected")

        console.log(error)
    }


})