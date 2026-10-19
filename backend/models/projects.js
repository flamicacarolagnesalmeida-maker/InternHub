const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Project = sequelize.define("projects", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    project_name: {
        type: DataTypes.STRING(150),
        allowNull: false
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    start_date: {
        type: DataTypes.DATE,
        allowNull: true
    },

    end_date: {
        type: DataTypes.DATE,
        allowNull: true
    },

    status: {
        type: DataTypes.STRING(50),
        defaultValue: "Ongoing"
    }
});

module.exports = Project;