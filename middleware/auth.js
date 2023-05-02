
const jwt = require('jsonwebtoken')

const Redis = require('ioredis')

const redis = new Redis()

const {UserModel} = require('../model/user.model')


const auth = async (req,res,next)=>{

    const {email} = req.body;


    try {
        
        const isPresent = await UserModel.findOne({email})

        if(!isPresent){
            return res.status(400).send({"msg":"User isn't present. "})
        }

    } 
    
    catch (error) {
        return res.status(400).send({"error":error.message})
    }



    redis.get(email , (err,token)=>{

        if(token){

            redis.get("BlacklistedToken", (err, result) => {

                if(!result){

                    // check token expire or not

                    const decoded = jwt.verify(result,"NiteshJWT")

                    if(decoded){

                        req.body.userId = decoded.userId

                        next()

                    }
                    else{
                        return res.status(400).send({"msg":"token is expired !!"})
                    }

                }


                else{

                    result=JSON.parse(result)

                    if (result.includes(token)) {
                        return res.status(400).send({ "msg": "token is blacklisted !!" })
                    }

                    next()
                }

            })


        }
        else{
            return res.status(400).send({"error":"Unauthorize access. Login first"})
        }

    })

}


module.exports = {auth}