const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const WorkReport = sequelize.define("work_reports", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    intern_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    report_title: {
        type: DataTypes.STRING(150),
        allowNull: false
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    report_date: {
        type: DataTypes.DATE,
        allowNull: true
    }
});

module.exports = WorkReport;