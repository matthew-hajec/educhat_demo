const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Session = sequelize.define('Session', {
    sessionID: {
        type: DataTypes.STRING,
        allowNull: false
    },
    openAIThreadID: {
        type: DataTypes.STRING,
        allowNull: false
    }
});