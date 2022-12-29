const Users = require("./users");
const Regions = require("./regions");
const Countries = require("./countries");
const Cities = require("./cities");
const Companies = require("./companies");
const Contacts = require("./contacts");

Regions.hasMany(Countries, {
    foreignKey: "region_id"
});
Countries.belongsTo(Regions, {
    foreignKey: "region_id",
});

Countries.hasMany(Cities, {
    foreignKey: "countries_id"
});
Cities.belongsTo(Countries, {
    foreignKey: "countries_id",
});

module.exports = {
    Users,
    Regions,
    Countries,
    Cities,
    Companies,
    Contacts,
};
