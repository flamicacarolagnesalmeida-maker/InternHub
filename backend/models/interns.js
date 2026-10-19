const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Intern = sequelize.define("interns", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },

    email: {
        type: DataTypes.STRING(100),
        allowNull: false
    },

    phone: {
        type: DataTypes.STRING(20),
        allowNull: false
    },

    course: {
        type: DataTypes.STRING(100),
        allowNull: false
    },

    department: {
        type: DataTypes.STRING(100),
        allowNull: false
    },

    joining_date: {
        type: DataTypes.DATE,
        allowNull: false
    }
});

module.exports = Intern;