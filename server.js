//Server - Express
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

//Database - PostgreSQL
const db = require('./db/db');

const Category = require('./api/Category');


db.authenticate()
    .then(() => console.log('Database connected succesfully'))
    .catch((err) => console.log('Error connecting to database:', err));
    db.sync();

//Express config    
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

//Routes
app.use('/categories', require('./routes/categories'));

app.listen(port, (req, res) => {
    console.log(`App listening on port ${port}`);
});