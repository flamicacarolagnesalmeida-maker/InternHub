const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Feedback = sequelize.define("feedback", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    intern_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    feedback_text: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    rating: {
        type: DataTypes.INTEGER,
        allowNull: true
    },

    feedback_date: {
        type: DataTypes.DATE,
        allowNull: true
    }
});

module.exports = Feedback;