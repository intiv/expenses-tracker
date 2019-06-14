const db = require('../db/db');
const Sequelize = require('sequelize');

const Category = db.define('category', {
    type: {
        type: Sequelize.STRING,
        defaultValue: 'Expense',
        validate: {
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
            len: {
                args: 3,
                msg: 'Name must be at least 3 characters long'
            }
        }    
    }
});


async () => await Category.sync({force: true});

module.exports = Category;
