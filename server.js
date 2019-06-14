const app = require('./app/app');
const port = process.env.PORT || 5000;
const path = require('path');
const express = require('express');

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

db.authenticate()
    .then(() => console.log('Database connected succesfully'))
    .catch((err) => console.log('Error connecting to database:', err));
db.sync();


app.listen(port, (req, res) => {
    console.log(`App listening on port ${port}`);
});