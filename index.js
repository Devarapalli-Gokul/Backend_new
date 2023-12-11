const express = require('express');
const createError = require('http-errors')
require('dotenv').config()
const cors = require('cors');
const bodyParser = require('body-parser')
const MySQLConnection = require('./connections/mysql_connection')

global.DATA = {
    CONNECTION: {
        mysql: undefined
    }
}

class AppInitialize{
    constructor(){
        this.app = express();
    }

    async intializeConnection(){
        const connectionObj = new MySQLConnection();
        await connectionObj.initialize();
    }
    
    async initializeProject(){
        const AuthController = require('./controllers/auth_controller');
        const CategoryController = require('./controllers/category_controller')
        const ExpenseController = require('./controllers/expense_controller')

        const PORT = process.env.PORT || 4200;
        this.app.use(cors({
            origin: '*'
        }))
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));

        this.app.get("/", async (req,res,next)=>{
            res.send("Welcome to the Application");
        })

        this.app.use('/auth', AuthController);
        this.app.use('/category',CategoryController);
        this.app.use('/expenses',ExpenseController);


        // Handling Undefined route
        this.app.use(async (req, res, next) => {
            next(createError.NotFound("URL not found. Please enter valid URL"))
        })

        // Error Handler
        this.app.use((err, req, res, next) => {
            res.status(err.status || 500)
            res.send({
                "status": err.status || 500,
                "message": err.message
            })
        })

        this.app.listen(PORT,(err)=>{
            if(err){
                console.log("Error while running application");
                return;
            }
            console.log(`Express running on port ${PORT}`);
            })
        }
}


(async function () {
    const startApp = new AppInitialize();
    await startApp.intializeConnection();
    await startApp.initializeProject();
})();

