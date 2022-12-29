const {DataTypes} = require("sequelize");
const sequelize = require("../config/connection");

const Regions = sequelize.define('regions',{
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    }
},{
    tableName: "regions",
    underscored: true,
    timestamps: false,
});

module.exports = Regions;
