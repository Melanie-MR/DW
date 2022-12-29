const {DataTypes} = require("sequelize");
const sequelize = require("../config/connection");


const Contacts = sequelize.define('contacts', {
    firstname: {
        field:"firstname",
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastname: {
        field:"lastname",
        type: DataTypes.STRING,
        allowNull: false,
    },
    position: { //no hace falta creo
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    company: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cities_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    companies_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    isActive: {
        field:"isActive",
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    interest: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
},{
    tableName: "contacts",
    underscored: true,
})


module.exports = Contacts;