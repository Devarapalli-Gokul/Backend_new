const createError = require('http-errors');
const ExpensesModel = require('../models/ExpensesModel')
const Sequelize = require('sequelize');
const BudgetModel = require('../models/BudgetModel')

class ExpenseService{
    constructor(){

    }

    async getExpenseByCategory(payload){
        try{
            const {category_id,user_id} = payload;
            if(!category_id){
                throw createError.BadRequest("Category id cannot be null");
            }
            if(!user_id){
                throw createError.BadRequest("user id cannot be null");
            }
            
            const data = await ExpensesModel.findAll({
                where:{
                    category_id:category_id,
                    user_id:user_id
                }
            }).catch(err=>{
                console.log("Error while fetching expense data",err);
                throw createError.InternalServerError("Error while fetching expense data");
            });

            return data;
        }
        catch(err){
            throw err;
        }
    }

    async addExpense(payload){
        try{
            const {description,category_id,amount,user_id, date} = payload;

            if(!category_id){
                throw createError.BadRequest("Category Id cannot be empty");
            }

            if(!amount){
                throw createError.BadRequest("Amount cannot be empty");
            }

            if(!user_id){
                throw createError.BadRequest("User Id cannot be empty");
            }

            if(!date){
                throw createError.BadRequest("Date cannot be empty");
            }

            const data = await ExpensesModel.create({
                description:description,
                category_id:category_id,
                amount:amount,
                user_id:user_id,
                date:date
            }).catch(err=>{
                console.log("Error during expense creation",err);
                throw createError.InternalServerError("Error during Expense Creation");
            })

            return data;
        }
        catch(err){
            throw err;
        }
    }


    async deleteExpense(payload){
        try{
            const {id,user_id} = payload;
            if(!id){
                throw createError.BadRequest("Expense id cannot be null");
            }

            await ExpensesModel.destroy({
                where:{
                    id:id,
                    user_id:user_id
                }
            }).catch(err=>{
                console.log("Error during expense deletion",err);
                throw createError.InternalServerError("Error during expense deletion");
            })
        }
        catch(err){
            throw err;
        }
    }

    async getAllExpenses(user_id){
        try{
            const query = `select e.*, c.name as category_name from expense e JOIN categories c ON e.category_id = c.id 
            and e.user_id = c.user_id where e.user_id = ${user_id};`
            
            const data = await DATA.CONNECTION.mysql.query(query,{
                type: Sequelize.QueryTypes.SELECT
            }).catch(err=>{
                console.log("Error during get all expenses",err);
                throw createError.InternalServerError("Error during expense fetching");
            });

            return data;
        }
        catch(err){
            throw err;
        }
    }

    async getExpenseByMonthAndYear(payload){
        try{
            const {month, year, user_id} = payload;
            if(!month || !year){
                throw createError.InternalServerError("year/month cannot be empty");
            }
            const query = `select e.* , c.name as category_name from expense e JOIN categories c ON 
            e.category_id = c.id and e.user_id = c.user_id where e.user_id = ${user_id} and SUBSTRING_INDEX(SUBSTRING_INDEX(e.date, '-', 2),'-',-1) = '${month}'
                        AND SUBSTRING_INDEX(SUBSTRING_INDEX(e.date, '-', 3),'-',-1) = '${year}';`;
            console.log(query);

            const data = await DATA.CONNECTION.mysql.query(query,{
                type: Sequelize.QueryTypes.SELECT
            }).catch(err=>{
                console.log("Error while fetching data from Expenses table",err);
                throw createError.InternalServerError("Error during Expense fetching");
            });

            return data;
        }
        catch(err){
            throw err;
        }
    }

    async addBudget(payload){
        try{
            const {user_id, amount, month, year} = payload;

            const data = await BudgetModel.findOne({
                where:{
                    user_id:user_id,
                    month:month,
                    year:year
                }
            }).catch(err=>{
                console.log("Error while fetching budget details",err);
                throw createError.InternalServerError("Error while fetching budget details");
            })

            console.log(data);

            if(data){
                throw createError.BadRequest({
                    "error":"Budget Already Exists for given month",
                    "id":data.id
                });
            }

            const newData = await BudgetModel.create({
                user_id,
                month,
                year,
                amount
            }).catch(err=>{
                console.log("Error while adding budget",err);
                throw createError.InternalServerError("Error while Budget creation");
            });

            return newData;
        }
        catch(err){
            throw err;
        }
    }

    async getBudgetDetails(payload){
        try{
            const {user_id,month,year} = payload;
            const data = await BudgetModel.findAll({
                where:{
                    user_id:user_id,
                    month:month,
                    year:year
                }
            }).catch(err=>{
                console.log("Error while fetching budget details",err);
                throw createError.InternalServerError("Error while fetching budget details");
            });
            
            return data;
        }   
        catch(err){
            throw err;
        }
    }

    async editBudget(payload){
        try{
            const {id,user_id, month, year, amount} = payload;

            if(!id){
                throw createError.BadRequest("Id cannot be empty");
            }

            await BudgetModel.update({
                amount, year, month
            },{
                where:{
                    id:id,
                    user_id:user_id
                }
            }).catch(err=>{
                console.log("Error while updating budget details",err);
                throw err;
            });

            return "Budget Updated Successfully";
        }
        catch(err){

        }
    }

    async getExpenseByYear(payload){
        try{
            const {year,user_id} = payload;
            if(!year){
                throw createError.BadRequest("Year cannot be empty");
            }

            const allMonths = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

            let query = `
            WITH teby AS (
                SELECT
                    COALESCE(SUM(amount),0) AS total_expenses,
                    SUBSTRING_INDEX(SUBSTRING_INDEX(date, '-', 2), '-', -1) AS month,
                    SUBSTRING_INDEX(SUBSTRING_INDEX(date, '-', 3), '-', -1) AS year,
                    user_id
                FROM
                    expense
                WHERE
                    user_id = ${user_id} AND
                    SUBSTRING_INDEX(SUBSTRING_INDEX(date, '-', 3), '-', -1) = ${year}
                GROUP BY
                    SUBSTRING_INDEX(SUBSTRING_INDEX(date, '-', 3), '-', -1),
                    SUBSTRING_INDEX(SUBSTRING_INDEX(date, '-', 2), '-', -1)
            )
            select t.month, t.year, t.total_expenses,  coalesce(b.amount,0) as budget from teby t LEFT JOIN budget b 
            on t.month = b.month and t.year = b.year
            and t.user_id = b.user_id
            UNION 
            select b.month, b.year, coalesce(sum(e.total_expenses),0) as total_expenses, b.amount as budget 
            from budget b LEFT join teby e 
            ON b.month = e.month
             and b.year = e.year
            and b.user_id = e.user_id where b.user_id = ${user_id} and b.year = ${year} group by b.month, b.year, b.amount;
            `;
            const data = await DATA.CONNECTION.mysql.query(query,{
                type: Sequelize.QueryTypes.SELECT
            }).catch(err=>{
                console.log("Error while fetching data from expenses table",err);
                throw createError.InternalServerError("Error while fetching expenses data");
            })

            const result = allMonths.map(month => {
                const matchingData = data.find(d => d.month === month);
                return matchingData || {
                    month: month,
                    year: year,
                    user_id: user_id,
                    total_expenses: 0,
                    budget: 0
                };
            });
            return result;
        }   
        catch(err){
            throw err;
        }
    }
}

module.exports = ExpenseService;