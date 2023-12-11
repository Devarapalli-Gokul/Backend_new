const Sequelize = require('sequelize')

const CategoryModel = global.DATA.CONNECTION.mysql.define("categories", {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    name: {
        type: Sequelize.DataTypes.STRING(1000),
        allowNull: false
    },
    name_identifier:{
        type:Sequelize.DataTypes.STRING(1000),
        allowNull:true
    },
    user_id:{
        type:Sequelize.DataTypes.INTEGER,
        allowNull:false
    }
}, {
    tableName: "categories"
});

module.exports = CategoryModel;