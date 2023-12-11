const Sequelize = require('sequelize')

const ExpensesModel = global.DATA.CONNECTION.mysql.define("expense", {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    category_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false
    },
    description:{
        type:Sequelize.DataTypes.STRING(1000),
        allowNull:true
    },
    amount:{
        type:Sequelize.DataTypes.FLOAT,
        allowNull:false
    },
    user_id:{
        type:Sequelize.DataTypes.INTEGER,
        allowNull:false
    },
    date:{
        type:Sequelize.STRING(100),
        allowNull:false
    }
}, {
    tableName: "expense"
});

module.exports = ExpensesModel;