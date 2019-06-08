//Server - Express
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const path = require('path');

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
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});

app.use(express.json());

//Routes
app.use('/api/categories', require('./routes/categories'));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/public/index.html'));
})

app.listen(port, (req, res) => {
    console.log(`App listening on port ${port}`);
});