const asyncErrors = require("../middlewares/asyncErrors");
const ErrorHandler = require("../utils/errorhandler");
const User = require("../models/User")

exports.userRegister = asyncErrors( async (req,res,next)=>{
    const {username,email,password} = req.body;
    const user = await User.create({
        username,email,password,
        avatar:{
            public_id:"Sample ID",
            url:"sample URL"
        },
        coverPic:{
            public_id:"Sample ID",
            url:"sample URL"
        }
    })

    res.status(201).json({
        success:true,
        user
    })
})