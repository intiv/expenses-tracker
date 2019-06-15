const express = require('express');
const router = express.Router();

const db = require('../db/db');
const User = require('../models/User');

router.get('/', async (req, res, next) => {
    try{
        let user = await User.findOne({
            where: {
                username: req.query.username
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
        let user = await User.create({...req.body.user}, {dbTransaction});
        console.log('USER INSERTED IN DB: ', user);
        await dbTransaction.commit();
        res.status(200).json({user});
    }catch(err){
        res.status(500).json({errorMessage: err.message});
        next(err);
    }
});

module.exports = router;