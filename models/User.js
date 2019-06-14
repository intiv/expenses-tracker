const Sequelize = require('sequelize');
const db = require('../db/db');

const User = db.define('user', {
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: {
                args: [3, 12],
                msg: 'Username must be 3 to 12 characters long.'
            }
        }
    },
    phone: {
        type: Sequelize.STRING
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

//User.hasMany(Transaction);
async () => User.sync({force: true});
module.exports = User;

