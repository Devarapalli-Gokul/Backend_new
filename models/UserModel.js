const Sequelize = require('sequelize')

const UserModel = global.DATA.CONNECTION.mysql.define("users", {
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
    password: {
        type: Sequelize.STRING(1000),
        allowNull: false
    },
    email: {
        type: Sequelize.DataTypes.STRING(1000),
        allowNull: false
    },
    phone_number: {
        type: Sequelize.DataTypes.STRING(100),
        allowNull: false
    },
    is_verified:{
        type:Sequelize.STRING(1),
        allowNull:false
    }
}, {
    tableName: "users"
});

module.exports = UserModel;