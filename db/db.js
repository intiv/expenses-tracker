const Sequelize = require('sequelize');
const config = require('../config/config');
const credentials = config[process.env.NODE_ENV];
// console.log('CONFIG: ', config);
// console.log('ENV: ', process.env.NODE_ENV);
// console.log('CREDENTIALS: ', credentials);

const db = new Sequelize(credentials.database, credentials.username, credentials.password, {
        host: credentials.host,
        dialect: credentials.dialect,
        logging: false,
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    });



// db.sync({
//     force: process.env.NODE_ENV === 'test'
// });

module.exports = db;
