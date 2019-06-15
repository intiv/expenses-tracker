const app = require('./app/app');
const port = process.env.PORT || 5000;
const path = require('path');
const express = require('express');

const db = require('./db/db');

const User = require('./models/User');
const Category = require('./models/Category');
const Transaction = require('./models/Transaction');

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

// async () => {
//     await User.sync({force: true});
//     await db.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE');
//     await Category.sync({force: true});
//     await Transaction.sync({force: true});
// }

db.authenticate()
    .then(() => console.log('Database connected succesfully'))
    .catch((err) => console.log('Error connecting to database:', err));
db.sync();

// try{
//     await db.authenticate();
//     console.log('Database connected succesfully');
// }catch(err){
//     console.log('Error connecting to database:', err);
// }

app.listen(port, (req, res) => {
    console.log(`App listening on port ${port}`);
});