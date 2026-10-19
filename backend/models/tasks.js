const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Task = sequelize.define("tasks", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    title: {
        type: DataTypes.STRING(100),
        allowNull: false
    },

    description: {
        type: DataTypes.STRING(100),
        allowNull: false
    },

    status: {
        type: DataTypes.STRING(100),
        allowNull: true
    },

    due_date: {
        type: DataTypes.DATE,
        allowNull: false
    },

    intern_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    project_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = Task;