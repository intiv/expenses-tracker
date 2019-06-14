//Server - Express
const express = require('express');
const app = express();
const path = require('path');
const db = require('../db/db');


//Express config    
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});

app.use(express.json());

//Routes
app.use('/api/categories', require('../routes/categories'));
app.use('/api/transactions', require('../routes/transactions'));
app.use('/api/users', require('../routes/users'));

module.exports = app;