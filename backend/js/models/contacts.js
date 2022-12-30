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
    address: {
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
    interest: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
},{
    tableName: "contacts",
    underscored: true,
    timestamps: false,
})


module.exports = Contacts;