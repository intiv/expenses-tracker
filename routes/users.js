const express = require('express');
const router = express.Router();

const db = require('../db/db');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

router.post('/', async (req, res, next) => {
    try{
        let user = await User.findOne({
            where: {
                username: req.body.username
            }
        });
        if(!user){
            
            throw new Error('No user found');
        }
        res.status(200).json({user});
    }catch(err){
        res.status(500).json({errorMessage: err.message});
        next(err);
    }
});

router.post('/create', async (req, res, next) => {
    let dbTransaction = await db.transaction();
    try{
        let user = await User.create({username: req.body.username}, {dbTransaction});
        await dbTransaction.commit();
        res.status(200).json({user});
    }catch(err){
        res.status(500).json({errorMessage: err.message});
        next(err);
    }
});