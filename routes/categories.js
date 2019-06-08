const express = require('express');
const router = express.Router();
const db = require('../db/db');
const Category = require('../api/Category');

router.get('/', async (req, res, next) =>  {
    try{
        let categories = await Category.findAll({});
        res.json(categories);
    }catch(err){
        next(err);
    }
});

router.post('/create', async (req, res, next) => {
    const newCategory = req.body.category;
    console.log(newCategory);
    let transaction;
    try{
        transaction = await db.transaction();
        await Category.create(newCategory, {transaction});
        await transaction.commit();
        res.status(200).redirect('/categories');
    }catch(err){
        if(err){
            await transaction.rollback();
            next(err);
        }
    }
});

module.exports = router;