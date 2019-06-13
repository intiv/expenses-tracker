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

router.post('/monthly/', async (req, res, next) => {
    try{
        let transactions = await Transaction.findAll({
            where: {
                createdAt: {
                    [Op.gte]: req.body.beginDate,
                    [Op.lte]: req.body.endDate
                }
            }
        });
        if(!transactions){
            throw new Error('No transactions found');
        }
        
        //console.log(`Begin date: ${req.body.date}, End date: ${req.body.date}`);
        console.log('Transactions: ', transactions);
        
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
            throw new Error('Transaction can\'t belong to non-existent category');
        }
        await Transaction.create({...req.body.transaction}, {dbTransaction});
        await dbTransaction.commit();
        const transactions = await Transaction.findAll({});
        res.status(200).json({transactions});
    }catch(err){
        if(err){
            console.log(err);
            await dbTransaction.rollback();
            let transactions = await Transaction.findAll({});
            res.status(500).json({transactions, errorMessage: err.message});
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