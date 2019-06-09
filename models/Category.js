const db = require('../db/db');
const Sequelize = require('sequelize');

const Category = db.define('category', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    }
});

//Category.sync({force: true}).then()

module.exports = Category;
