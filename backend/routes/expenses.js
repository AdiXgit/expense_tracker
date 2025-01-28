const express = require('express');
const Expense = require('../models/Expense');
const router = express.Router();

router.post("/",async(req,res) => {
    const{user,amount,category,description,date} = req.body;
    try{
        const expense = new Expense({user,amount,category,description,date});
        await expense.save();
        res.status(201).json(expense);
    } catch(err){
        res.status(500).json({message:"INTERNAL SERVER ERROR"});
    }
});

router.get('/:userId',async(req,res) => {
    try{
        const expenses = await Expense.find({user:req.params.userId});
        res.json(expenses);
    }catch(err){
        res.status(500).json({message:"INTERNAL SERVER ERROR"});
    }
});

module.exports = router;
