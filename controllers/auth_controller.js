const express = require('express');

const router = express.Router();
const AuthService = require('../services/auth_service')

router.post("/register", async(req,res,next)=>{
    try{
        const authObj = new AuthService();
        const payload = req.body;
        const data = await authObj.registerUser(payload);
        res.send({
            "message":"User Registration Done",
            "status":200,
            "data":data
        })
    }
    catch(err){
        console.log(err);
        next(err);
    }
})

router.post('/login', async(req,res,next)=>{
    try{
        const authObj = new AuthService();

        const data = await authObj.login(req.body)
            .catch(err => {
                throw err;
            });

        res.send({
            "status": 200,
            "message": "Logged in successfully",
            "data": data
        })
    }
    catch(err){
        next(err);
    }
});

router.post("/generateNewAccessToken", async(req,res,next)=>{
    try{
        const authObj = new AuthService();

        const data = await authObj.generateNewAccessToken(req.body);
        res.send({
            "message":"Token generation success",
            "status":200,
            "data":data
        })
    }
    catch(err){
        next(err);
    }
})

router.get('/getRemainingTime', new AuthService().verifyAccessToken, async (req,res,next)=>{
    try{
        const authObj = new AuthService();
        const data = await authObj.getRemainingTokenTime(req.expireTime);

        res.send({
            "message":"Data Fetched Successfully",
            "data":data,
            "status":200
        })
    }   
    catch(err){
        next(err);
    }
})
module.exports = router;