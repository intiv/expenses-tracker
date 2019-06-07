const express = require('express');
const router = express.Router();
const db = require('../db/db');
const Category = require('../api/Category');

router.get('/', async (req, res, next) =>  {
    try{
        let categories = await Category.findAll({});
        res.send(categories).status(200);
    }catch(err){
        next(err);
    }
    
});

router.post('/create', async (req, res, next) => {

    const newCategory = req.body.category;
    console.log(newCategory);
    Category.create(newCategory)
        .then(category => res.status(200).redirect('/categories'))
        .catch(err => next(err));

});

module.exports = router;