const {DataTypes} = require("sequelize");
const sequelize = require("../config/connection");

const Countries = sequelize.define('countries',{
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    region_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
},{
    tableName: "countries",
    underscored: true,
    timestamps: false,
});

module.exports = Countries;
