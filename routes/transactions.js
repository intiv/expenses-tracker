const express = require('express');
const router = express.Router();

const db = require('../db/db');
const { Op } = require('sequelize');
const Transaction = require('../models/Transaction');
const Category = require('../models/Category');

router.get('/', async (req, res, next) => {
    try{
        let transactions = await Transaction.findAll({
            where: {
                userId: req.query.userId
            },
            order: [
                ['createdAt', 'DESC']
            ]
        });
        
        res.status(200).json({transactions});
    }catch(err){
        res.status(500).json({transactions: [], errorMessage: err});
        next(err);
    }
});

router.get('/monthly/', async (req, res, next) => {
    try{
        let transactions = await Transaction.findAll({
            where: {
                userId: req.query.userId,
                createdAt: {
                    [Op.gte]: req.query.beginDate,
                    [Op.lte]: req.query.endDate
                }
            },
            order: [
                ['createdAt', 'DESC']
            ]
        });
        if(!transactions){
            throw new Error('Coulnd\'t find transactions');
        }
        res.status(200).json({transactions});
    }catch(err){
        res.status(500).json({transactions: [], errorMessage: err});
        next(err);
    }
});

router.post('/create/', async (req, res, next) => {
    let dbTransaction = await db.transaction();

    try{
        if(!req.body.transaction.categoryId){
            throw new Error('Transaction must belong to a category');
        }
        if(!req.body.transaction.userId){
            throw new Error('Transaction must belong to a user');
        }
        const category = await Category.findOne({
            where: {
                id: req.body.transaction.categoryId,
                userId: req.body.transaction.userId
            }
        });
        if(!category){
            throw new Error('Transaction can\'t belong to non-existent category');
        }
        await Transaction.create({...req.body.transaction}, {dbTransaction});
        await dbTransaction.commit();
        const transactions = await Transaction.findAll({});
        res.status(200).json({transactions});
    }catch(err){
        if(err){
            //console.log('ERROR: ', err);
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
        if(!req.body.transaction || !req.body.transaction.id){
            throw new Error('Need a transaction\'s id to delete it');
        }
        let rows = await Transaction.destroy({where: {id: req.body.transaction.id}}, {dbTransaction});
        if(!rows){
            throw new Error(`No such transaction was found`);
        }
        dbTransaction.commit();
        const transactions = await Transaction.findAll({
            where: {
                userId: req.body.transaction.userId
            }
        });
        res.status(200).json({transactions});
    }catch(err){
        if(err){
            await dbTransaction.rollback();
            let transactions = await Transaction.findAll({
                where: {
                    userId: req.body.transaction.userId
                }
            });
            res.status(500).json({transactions, errorMessage: err});
            next(err);
        }
    }
});

module.exports = router;
// router.get('/create/')