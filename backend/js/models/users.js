const {DataTypes} = require("sequelize");
const sequelize = require("../config/connection");


const Users = sequelize.define('users',{
    firstname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    isAdmin: {
        field:"isAdmin",
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isActive: {
        field:"isActive",
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    }
    
},{
    tableName:"users",
    underscored: true,
});

module.exports = Users;