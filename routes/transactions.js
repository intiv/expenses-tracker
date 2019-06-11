const express = require('express');
const router = express.Router();

const db = require('../db/db');
const Transaction = require('../models/Transaction');
const Category = require('../models/Category');

router.get('/', async (req, res, next) => {
    try{
        let transactions = await Transaction.findAll({});
        res.status(200).json({transactions});
    }catch(err){
        res.status(500).json({transactions: [], errorMessage: err});
        next(err);
    }
});

router.post('/create/', async (req, res, next) => {
    let dbTransaction;
    dbTransaction = await db.transaction();

    try{
        if(!req.body.transaction.categoryId){
            throw new Error('Transaction must belong to a category');
        }
        let category = await Category.findByPk(req.body.transaction.categoryId);
        if(!category){
            throw new Error('Transaction belongs to non-existent category');
        }
        await Transaction.create({...req.body.transaction}, {dbTransaction});
        await dbTransaction.commit();
        let transactions = await Transaction.findAll({});
        res.status(200).json({transactions});
    }catch(err){
        if(err){
            await dbTransaction.rollback();
            let transactions = await Transaction.findAll({});
            res.status(500).send({transactions, errorMessage: err});
            next(err);
        }
    }
});

router.delete('/delete/', async (req, res, next) => {
    let dbTransaction;
    try{

    }catch(err){
        if(err){
            await
        }
    }
});

module.exports = router;
// router.get('/create/')