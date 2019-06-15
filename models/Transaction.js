const Sequelize = require('sequelize');
const db = require('../db/db');
const Category = require('./Category');
const User = require('./User');

const Transaction = db.define('transaction', {
    quantity: {
        type: Sequelize.DECIMAL(8,2),
        allowNull: false,
        validate: {
            min: {
                args: [0.01],
                msg: 'Quantity must be greater than 0'
            }
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


Transaction.belongsTo(Category);
Transaction.belongsTo(User);

module.exports = Transaction;