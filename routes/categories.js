const express = require('express');
const router = express.Router();

const db = require('../db/db');
const { Op } = require('sequelize');
const Category = require('../models/Category');

router.get('/', async (req, res, next) =>  {
    try{
        let categories = await Category.findAll({
            where: {
                userId: req.query.userId
            }
        });
        // console.log(categories)
        res.status(200).json({categories});
    }catch(err){
        res.status(500).json({categories: [], errorMessage: err.message});
        next(err);
    }
});

router.get('/find/id/', async (req, res, next) => {
    try{
        let category = await Category.findByPk(req.query.id);
        if(!category){
            throw new Error('Transaction category not found');
        }
        res.status(200).json({category});
    }catch(err){
        res.status(500).json({errorMessage: err.message});
        next(err);
    }
});

router.get('/find/name', async (req, res, next) => {
    try{
        const category = await Category.findOne({
            where: {
                name: {
                    [Op.iLike]: req.query.name
                },
                userId: req.query.userId
            }
        });
        if(!category){
            throw new Error(`Category with name ${req.query.name} for this user`);
        }
        res.status(200).json({category});
    }catch(err){
        res.status(500).json({errorMessage: err.message});
    }
});

router.post('/create/', async (req, res, next) => {
    // const newCategory = {
    //     name: req.params.name
    // }
    let dbTransaction;
    dbTransaction = await db.transaction();
    try{
        if(!req.body.category || !req.body.category.userId){
            throw new Error('Can\'t create category');
        }
        let category = await Category.findOne({
            where: {
                userId: req.body.category.userId,
                name: req.body.category.name
            }
        });
        if(category){
            throw new Error('Category already exists');
        }
        await Category.create({...req.body.category}, {dbTransaction});
        await dbTransaction.commit();
        let categories = await Category.findAll({
            where: {
                userId: req.body.category.userId
            }
        });
        res.status(200).json({categories});
    }catch(err){
        if(err){
            await dbTransaction.rollback();
            let categories = await Category.findAll({
                where: {
                    userId: req.body.category.userId
                }
            });
            res.status(500).send({categories, errorMessage: err.message});
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
        const rows = await Category.destroy({where: {
            userId: req.body.category.userId,
            name: req.body.category.name
        }});
        if(rows === 1){
            await dbTransaction.commit();
        }else{
            throw new Error('No categories were deleted');
        }
        const categories = await Category.findAll({
            where: {
                userId: req.body.category.userId
            }
        });
        res.status(rows === 1 ? 200 : 500).json({categories});
    }catch(err){
        if(err){
            await dbTransaction.rollback();
            const categories = await Category.findAll({
                where: {
                    userId: req.body.category.userId
                }
            });
            res.status(500).json({categories, errorMessage: err.message});
            next(err);
        }
    }
});

module.exports = router;