const db = require('../db/db');
const Sequelize = require('sequelize');

const User = require('./User');

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

Category.belongsTo(User);

async () => Category.sync({force: true});
module.exports = Category;
