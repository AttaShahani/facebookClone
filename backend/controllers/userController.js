const asyncErrors = require("../middlewares/asyncErrors");
const ErrorHandler = require("../utils/errorhandler");
const User = require("../models/User");
const sendJWTToken = require("../utils/token")

// User Registration 
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

   sendJWTToken(user,201,res)
});

// User Login 

exports.userLogin = asyncErrors( async (req,res,next)=>{
    const {email, password} = req.body;
    if(!email || !password){
        return next(new ErrorHandler("Enter Email and Password for login",400))
    }
    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("User not found",404))
    }
    const isSamePassword = await user.comparePassword(password);
    if(!isSamePassword) {
        return next(new ErrorHandler("Incorrect Password",403))
    }
    sendJWTToken(user,200,res)
})

// User Logout 
exports.userLogout = asyncErrors(async (req,res,next)=>{
    res.cookie("token",null,{expires:new Date(Date.now()),httpOnly:true});

    res.status(200).json({
        success:true,
        message:"User Logged Out"
    })
})