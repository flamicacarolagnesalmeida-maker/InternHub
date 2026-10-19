const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Attendance = sequelize.define("attendance", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    intern_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    attendance_date: {
        type: DataTypes.DATE,
        allowNull: false
    },

    status: {
        type: DataTypes.STRING(20),
        allowNull: false
    }
});

module.exports = Attendance;