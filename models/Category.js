const db = require('../db/db');
const Sequelize = require('sequelize');

const Category = db.define('category', {
    name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: {
            len: 1
        }
        
    }
});


Category.sync().then();

module.exports = Category;
