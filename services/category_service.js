const createError = require('http-errors');
const CategoryModel = require('../models/CategoryModel')
const ExpensesModel = require('../models/ExpensesModel');
const { Sequelize } = require('sequelize');

class CategoryService{
    constructor(){

    }

    async getAllCategories(user_id){
        try{    
            const query = `select c.*, COALESCE(SUM(e.amount), 0) AS total_expenses from categories c LEFT JOIN expense e on c.id = e.category_id
            and c.user_id = e.user_id where c.user_id = ${user_id} group by c.id;`
            const data = await DATA.CONNECTION.mysql.query(query,{
                type: Sequelize.QueryTypes.SELECT
            }).catch(err=>{
                console.log("Error while fetching category data",err);
                throw createError.InternalServerError("Error while fetching category data");
            });

            return data;
        }
        catch(err){
            throw err;
        }
    }

    async addCategory(payload){
        try{
            const {name, user_id} = payload;
            if(!name){
                throw createError.BadRequest("Category Name cannot be empty");
            }

            if(!user_id){
                throw createError.BadRequest("User Id cannot be empty");
            }

            const nameIdentifier = name.toLowerCase().split(' ').join('_');
            const data = await CategoryModel.findOne({
                where:{
                    name_identifier:nameIdentifier,
                    user_id:user_id
                }
            }).catch(err => {
                console.log("Error during checking category", err.message)
                throw createError.InternalServerError("Error during category finding")
            })


            if(data){
                throw createError.Conflict("Category Name already exists");
            }

            const createData = await CategoryModel.create({
                name:name,
                name_identifier:nameIdentifier,
                user_id:user_id
            }).catch(err=>{
                console.log("Error during category creation",err);
                throw createError.InternalServerError("Error during Category Creation");
            });

            return createData;

        }
        catch(err){
            throw err;
        }
    }

    async deleteCategory(payload){
        try{
            const {id, user_id} = payload;

            await global.DATA.CONNECTION.mysql.transaction(async (t) => {
                await ExpensesModel.destroy({
                    where:{
                        category_id:id,
                        user_id:user_id
                    },
                    transaction:t
                }).catch(err=>{
                    console.log("Error while deleting expenses",err);
                    throw createError.InternalServerError("Error during expense deletion");
                });

                await CategoryModel.destroy({
                    where:{
                        id:id,
                        user_id:user_id
                    },
                    transaction:t
                }).catch(err=>{
                    console.log("Error while deleting category",err);
                    throw createError.InternalServerError("Error during category deletion");
                });
            });
        }   
        catch(err){
            throw err;
        }
    }
}

module.exports = CategoryService;