const Sequelize = require('sequelize');
const db = require('../db/db');
const Category = require('./Category');

const moment = require('moment');

const Transaction = db.define('transaction', {
    quantity: {
        type: Sequelize.DECIMAL(8,2),
        allowNull: false,
        validate: {
            min: {
                args: [0.01],
                msg: 'Must be greater than 0'
            }
        }
    },
    createdAt:  Sequelize.DATEONLY,
    updatedAt: Sequelize.DATEONLY
});

Transaction.belongsTo(Category);

async () => await Transaction.sync({force: true});

module.exports = Transaction;