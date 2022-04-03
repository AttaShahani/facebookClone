const ErrorHandler = require("../utils/errorhandler");
const asyncErrors = require("./asyncErrors");
const User = require("../models/User")
const jwt = require("jsonwebtoken");

exports.isAuthenticatedUser = asyncErrors(async (req,res,next)=>{
    const {token} = req.cookies;
    if(!token){
        return next( new ErrorHandler("Please Login to access",401))
    }
    const {tokenData} = jwt.verify(token,process.env.JWT_SECRET);
    req.user = await User.findById(tokenData.id);
    next();
})