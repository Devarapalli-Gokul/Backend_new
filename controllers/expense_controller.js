const express = require('express');

const router = express.Router();
const ExpenseService = require('../services/expense_service');
const AuthService = require('../services/auth_service');


router.post("/getExpenses", new AuthService().verifyAccessToken, async (req,res,next)=>{
    try{
        const expenseServiceObj = new ExpenseService();
        const data = await expenseServiceObj.getExpenseByCategory({
            ...req.body,
            "user_id":parseInt(req.payload)
        });

        res.send({
            "status":"200",
            "message":"Data fetched successfully",
            "data":data
        })
    }
    catch(err){
        next(err);
    }
})

router.post("/addExpense", new AuthService().verifyAccessToken, async (req,res,next)=>{
    try{
        const expenseServiceObj = new ExpenseService();
        const data = await expenseServiceObj.addExpense({
            ...req.body,
            "user_id":parseInt(req.payload)
        });

        res.send({
            "message":"Expense added successfully",
            "status":200,
            "data":data
        })
        
    }
    catch(err){
        next(err);
    }
});


router.post("/deleteExpense", new AuthService().verifyAccessToken, async(req,res,next)=>{
    try{
        const expenseServiceObj = new ExpenseService();

        await expenseServiceObj.deleteExpense({
            ...req.body,
            "user_id":parseInt(req.payload)
        });
        
        res.send({
            "message":"Expense deleted successfully",
            "status":200
        })
    }
    catch(err){
        next(err);
    }
})

router.get('/getAllExpenses', new AuthService().verifyAccessToken, async(req,res,next)=>{
    try{
        const expenseServiceObj = new ExpenseService();
        const data =  await expenseServiceObj.getAllExpenses(parseInt(req.payload));

        res.send({
            "message":"Data Fetched SuccessFully",
            "status":200,
            "data":data
        })
    }   
    catch(err){
        next(err);
    }
})

router.post("/getExpenseByMonthAndYear", new AuthService().verifyAccessToken, async(req,res,next)=>{
    try{
        const expenseServiceObj = new ExpenseService();
        const data = await expenseServiceObj.getExpenseByMonthAndYear({
            ...req.body,
            "user_id":parseInt(req.payload)
        });

        res.send({
            "message":"Data Fetched Successfully",
            "status":200,
            "data":data
        })
    }
    catch(err){
        next(err);
    }
})

router.post('/addBudget', new AuthService().verifyAccessToken, async(req,res,next)=>{
    try{
        const expenseServiceObj = new ExpenseService();

        const data = await expenseServiceObj.addBudget({
            ...req.body,
            "user_id":parseInt(req.payload)
        });

        res.send({
            "message":"Budget added successfully",
            "status":200,
            "data":data
        })
    }
    catch(err){
        next(err);
    }
})

router.post('/editBudget', new AuthService().verifyAccessToken, async (req,res,next)=>{
    try{
        const expenseServiceObj = new ExpenseService();

        const data = await expenseServiceObj.editBudget({
            ...req.body,
            "user_id":parseInt(req.payload)
        });

        res.send({
            "message":"Budget Updated successfully",
            "status":200,
            "data":data
        }) 
    }
    catch(err){
        next(err);
    }
});

router.post("/getExpenseByYear", new AuthService().verifyAccessToken, async(req,res,next)=>{
    try{
        const expenseServiceObj = new ExpenseService();
        const data = await expenseServiceObj.getExpenseByYear({
            ...req.body,
            "user_id":parseInt(req.payload)
        });

        res.send({
            "message":"Data fetched successfully",
            "status":200,
            "data":data
        }) 
    }
    catch(err){
        next(err);
    }
});

router.post("/getBudgetDetails", new AuthService().verifyAccessToken, async (req,res,next)=>{
    try{
        const expenseServiceObj = new ExpenseService();

        const data = await expenseServiceObj.getBudgetDetails({
            ...req.body,
            "user_id":parseInt(req.payload)
        })

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

module.exports = router;