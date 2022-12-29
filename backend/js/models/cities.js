const {DataTypes} = require("sequelize");
const sequelize = require("../config/connection");

const Cities = sequelize.define('cities',{
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    countries_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
},{
    tableName: "cities",
    underscored: true,
    timestamps: false,
});


module.exports = Cities;
