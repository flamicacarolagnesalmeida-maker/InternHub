
const {sequelize}=require('sequelize');
const sequelize = new Sequelize(
    "internhub",
    "root",
    "",
    {
        host: "localhost",
        dialect: "mysql"
    }
);

module.exports = sequelize;

