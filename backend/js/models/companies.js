const {DataTypes} = require("sequelize");
const sequelize = require("../config/connection");


const Companies = sequelize.define('companies',{
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isActive: {
        field:"isActive",
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    cities_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
},{
    tableName: "companies",
    underscored: true,
});



module.exports = Companies;