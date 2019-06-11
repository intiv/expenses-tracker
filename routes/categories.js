const express = require('express');
const router = express.Router();

const db = require('../db/db');
const Category = require('../models/Category');

router.get('/', async (req, res, next) =>  {
    try{
        let categories = await Category.findAll({});
        res.status(200).json({categories});
    }catch(err){
        res.status(500).json({categories: [], errorMessage: err});
        next(err);
    }
});

router.post('/create/', async (req, res, next) => {
    // const newCategory = {
    //     name: req.params.name
    // }
    let dbTransaction;
    try{
        dbTransaction = await db.transaction();
        await Category.create({...req.body.category}, {dbTransaction});
        await dbTransaction.commit();
        let categories = await Category.findAll({});
        res.status(200).json({categories});
    }catch(err){
        if(err){
            await dbTransaction.rollback();
            let categories = await Category.findAll({});
            res.status(500).send({categories, errorMessage: err});
            next(err);
        }
    }
});

router.delete('/delete/', async (req, res, next) => {
    let dbTransaction;
    try{
        dbTransaction = await db.transaction();
        let rows = await Category.destroy({where: {
            name: req.body.category.name
        }});
        let categories = await Category.findAll({});
        if(rows === 1){
            await dbTransaction.commit();
        }else{
            throw new Error();
        }
        res.status(rows === 1 ? 200 : 500).json({categories});
    }catch(err){
        if(err){
            await dbTransaction.rollback();
            let categories = await Category.findAll({});
            res.status(500).json({categories, errorMessage: err});
            next(err);
        }
    }
});

module.exports = router;