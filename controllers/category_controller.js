const express = require('express');

const router = express.Router();
const CategoryService = require('../services/category_service');
const AuthService = require('../services/auth_service');


router.get("/getAllCategories", new AuthService().verifyAccessToken, async (req,res,next)=>{
    try{
        const categoryServiceObj = new CategoryService();

        const data = await categoryServiceObj.getAllCategories(parseInt(req.payload));
        res.send({
            "message":"Data fetched successfully",
            "status":200,
            "data":data
        })
    }
    catch(err){
        next(err);
    }
})
router.post("/addCategory", new AuthService().verifyAccessToken, async (req,res,next)=>{
    try{
        const categoryServiceObj = new CategoryService();
        const data = await categoryServiceObj.addCategory({
            ...req.body,
            "user_id":parseInt(req.payload)
        });

        res.send({
            "message":"Category added successfully",
            "status":200,
            "data":data
        })
    }
    catch(err){
        next(err);
    }
});

router.post("/deleteCategory", new AuthService().verifyAccessToken, async (req,res,next)=>{
    try{
        const categoryServiceObj = new CategoryService();

        await categoryServiceObj.deleteCategory({
            ...req.body,
            "user_id":parseInt(req.payload)
        });
        res.send({
            "message":"Category deleted successfully",
            "status":200
        })
    }
    catch(err){
        next(err);
    }
})

module.exports = router;