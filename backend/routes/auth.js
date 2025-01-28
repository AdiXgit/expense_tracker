const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = require('express').Router();

router.post("/register",async(req,res) => {
    const{name,email,password} = req.body;
    try{
        const user_exists = await User.findOne({email});
        if(user_exists) return res.status(400).json({message : "USER IS ALREADY REGISTERED"});
        const user = new User({name,email,password});
        await user.save();
        res.status(201).json({message : "USER REGISTERED"});
    } catch(err){
        res.status(500).json({message : "INTERNAL SERVER ERROR"});

    }
});

router.post("/login", async (req,res) => {
    const {email,password} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({message : "NOT VALID"});

        const is_match = await bcrypt.compare(password,user.password);
        if(!is_match) return res.status(400).json({message : "NOT VALID"});
        const token  = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"1h"});
        res.json({token,user:{id:user._id,name:user.name,email:user.email}});
    } catch(err){
        res.status(500).json({message : "INTERNAL SERVER ERROR"});
    }
});

module.exports = router;
