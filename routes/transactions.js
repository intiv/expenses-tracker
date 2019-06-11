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
        res.status(500).json({transactions: [], });
        next(err);
    }
});

router.post('/create/', async (req, res, next) => {
    let dbTransaction;
    try{
        dbTransaction = await db.transaction();
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

module.exports = router;
// router.get('/create/')