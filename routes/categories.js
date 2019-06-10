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

router.post('/create/', async (req, res, next) => {
    // const newCategory = {
    //     name: req.params.name
    // }
    let transaction;
    try{
        transaction = await db.transaction();
        await Category.create({name: req.body.category.name}, {transaction});
        await transaction.commit();
        let categories = await Category.findAll({});
        res.status(200).json(categories);
    }catch(err){
        if(err){
            await transaction.rollback();
            let categories = await Category.findAll({});
            res.status(500).json(categories);
            next(err);
        }
    }
});

router.delete('/delete/', async (req, res, next) => {
    let transaction;
    try{
        transaction = await db.transaction();
        let rows = await Category.destroy({where: {
            name: req.body.category.name
        }});
        let categories = await Category.findAll({});
        await console.log('Rows:', rows);
        if(rows === 1){
            await transaction.commit();
        }
        res.status(rows === 1 ? 200 : 500).json(categories);
    }catch(err){
        if(err){
            await transaction.rollback();
            let categories = await Category.findAll({});
            res.status(500).json(categories);
            next(err);
        }
    }
});

module.exports = router;