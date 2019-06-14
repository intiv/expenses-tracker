const Sequelize = require('sequelize');

const dbConnectionString; 
    if(process.env.NODE_ENV === 'production'){
        dbConnectionString = 'postgres://zuicwmykvaczmu:0cb287119efcf4e3d44406d4a4e43c0d98e95392b5db8a29c183561958538aa2@ec2-54-83-192-245.compute-1.amazonaws.com:5432/dfprhgki3as7cn?ssl=true'
    }else if(process.env.NODE_ENV === 'development'){
        dbConnectionString = 'postgres://oeqvthgy:vsAGvqs2IFBw_aoQTIbZ6WqyRPB4hNSt@raja.db.elephantsql.com:5432/oeqvthgy'
    }else if(process.env.NODE_ENV === 'test'){
        dbConnectionString = 'postgres://root@localhost:5432/db_test';
    }
const db = new Sequelize(dbConnectionString, {
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    });

module.exports = db;
