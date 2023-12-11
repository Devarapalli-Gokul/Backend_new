const Sequelize = require('sequelize')
const BudgetModel = global.DATA.CONNECTION.mysql.define("categories",{
    id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    month:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    year:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    amount:{
        type:Sequelize.FLOAT,
        allowNull:false
    },
    user_id:{
        type:Sequelize.INTEGER,
        allowNull:false
    }
},{
    tableName:"budget"
});

module.exports = BudgetModel;