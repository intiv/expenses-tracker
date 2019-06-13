const express = require('express');
const router = express.Router();

const db = require('../db/db');
const Category = require('../models/Category');

router.get('/', async (req, res, next) =>  {
    try{
        let categories = await Category.findAll({});
        console.log(categories)
        res.status(200).json({categories});
    }catch(err){
        res.status(500).json({categories: [], errorMessage: err});
        next(err);
    }
});

router.post('/find/id/', async (req, res, next) => {
    try{
        let category = await Category.findByPk(req.body.categoryId);
        if(!category){
            throw new Error('Transaction category not found');
        }
        res.status(200).json({category});
    }catch(err){
        res.status(500).json({errorMessage: err});
        next(err);
    }
});

router.post('/find/ids', async (req, res, next) => {
    try{
        //req.body.
    }catch(err){
        res.status(500).json({errorMessage: err});
        next(err);
    }
});

router.post('/create/', async (req, res, next) => {
    // const newCategory = {
    //     name: req.params.name
    // }
    let dbTransaction;
    dbTransaction = await db.transaction();
    try{
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

//Dev purposes only
//Deleting category on production would imply removing all of its transactions
router.delete('/delete/', async (req, res, next) => {
    let dbTransaction;
    dbTransaction = await db.transaction();
    try{
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