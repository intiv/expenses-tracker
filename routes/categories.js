const express = require('express');
const router = express.Router();
const db = require('../db/db');
const Category = require('../models/Category');

router.get('/', async (req, res, next) =>  {
    try{
        let categories = await Category.findAll({});
        res.status(200).json(categories);
    }catch(err){
        next(err);
    }
});

router.post('/create/:name', async (req, res, next) => {
    const newCategory = {
        name: req.params.name
    }
    console.log(newCategory);
    let transaction;
    try{
        transaction = await db.transaction();
        await Category.create(newCategory, {transaction});
        await transaction.commit();
        let categories = await Category.findAll({});
        res.status(200).json(categories);
    }catch(err){
        if(err){
            await transaction.rollback();
            next(err);
        }
    }
});

module.exports = router;