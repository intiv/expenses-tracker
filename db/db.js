const Sequelize = require('sequelize');

const dbConnectionString = 'postgres://zuicwmykvaczmu:0cb287119efcf4e3d44406d4a4e43c0d98e95392b5db8a29c183561958538aa2@ec2-54-83-192-245.compute-1.amazonaws.com:5432/dfprhgki3as7cn?ssl=true';

const db = new Sequelize(dbConnectionString, {
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});


module.exports = db;