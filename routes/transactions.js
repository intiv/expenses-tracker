const express = require('express');
const router = express.Router();

const db = require('../db/db');
const { Op } = require('sequelize');
const Transaction = require('../models/Transaction');
const Category = require('../models/Category');

const moment = require('moment');

router.get('/', async (req, res, next) => {
    try{
        let transactions = await Transaction.findAll({});
        res.status(200).json({transactions});
    }catch(err){
        res.status(500).json({transactions: [], errorMessage: err});
        next(err);
    }
});

router.get('/monthly/', async (req, res, next) => {
    try{
        let dateBegin = moment([2019, 5, 1]).format('YYYY-MM-DD');
        let dateEnd = moment([2019, 6, 1]).format('YYYY-MM-DD');
        let transactions = await Transaction.findAll({
            where: {
                createdAt: {
                    [Op.gte]: dateBegin,
                    [Op.lte]: dateEnd
                }
            }
        });
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
        const category = await Category.findByPk(req.body.transaction.categoryId);
        if(!category){
            throw new Error('Transaction belongs to non-existent category');
        }
        await Transaction.create({...req.body.transaction}, {dbTransaction});
        await dbTransaction.commit();
        const transactions = await Transaction.findAll({});
        res.status(200).json({transactions});
    }catch(err){
        if(err){
            await dbTransaction.rollback();
            let transactions = await Transaction.findAll({});
            res.status(500).json({transactions, errorMessage: err});
            next(err);
        }
    }
});

router.delete('/delete/', async (req, res, next) => {
    let dbTransaction;
    dbTransaction = await db.transaction();

    try{
        let rows = await Transaction.destroy({where: {id: req.body.transaction.id}}, {dbTransaction});
        if(!rows){
            throw new Error(`No transaction with id ${req.body.transaction.id} was found to delete`);
        }
        dbTransaction.commit();
        const transactions = await Transaction.findAll({});
        res.status(200).json({transactions});
    }catch(err){
        if(err){
            await dbTransaction.rollback();
            let transactions = await Transaction.findAll({});
            res.status(500).json({transactions, errorMessage: err});
            next(err);
        }
    }
});

module.exports = router;
// router.get('/create/')