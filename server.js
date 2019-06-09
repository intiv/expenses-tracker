const app = require('./app/app');
const port = process.env.PORT || 5000;

app.listen(port, (req, res) => {
    console.log(`App listening on port ${port}`);
});