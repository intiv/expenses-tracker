const app = require('./app/app');
const port = process.env.PORT || 5000;

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, 'client/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname + 'client/build/index.html'));
    });
}

app.listen(port, (req, res) => {
    console.log(`App listening on port ${port}`);
});