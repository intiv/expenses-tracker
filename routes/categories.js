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
    
})

module.exports = router;