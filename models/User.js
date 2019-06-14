const Sequelize = require('sequelize');
const db = require('../db/db');
const Transaction = require('./Transaction');

const User = db.define('user', {
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: [1, 12],
            msg: 'Username must be 1 to 12 characters long.'
        }
    },
    createdAt: {
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    updatedAt: {
        type: Sequelize.DATEONLY,
        allowNull: false
    }

});

User.hasMany(Transaction);

async () => await User.sync({force: true});

module.exports = User;

