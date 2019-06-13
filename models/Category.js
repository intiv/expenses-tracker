const db = require('../db/db');
const Sequelize = require('sequelize');

const Category = db.define('category', {
    type: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Expense',
        validate: {
            notEmpty: true,
            isIn: {
                args: [['Expense', 'Income']],
                msg: 'Category must be either an Expense or an Income'
            }
        }
    },
    name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: {
            len: 1
        }    
    }
});


async () => await Category.sync({force: true});

module.exports = Category;
