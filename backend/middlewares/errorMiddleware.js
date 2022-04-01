const ErrorHandler = require("../utils/errorhandler");

module.exports = (err,req,res,next)=>{
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500

    // Wrong Mongodb ID Error 

    if(err.name === 'CastError'){
        const message = `Resource not found. Invalid: ${err.path}`
        err = new ErrorHandler(message,400)
    }

    // Wrong JSON Web Token Error 

    if(err.name === 'JsonWebTokenError'){
        const message = `Invalid JSON Web Token, Try Again`
        err = new ErrorHandler(message,400)
    }

    // Wrong JSON Web Token Error 

    if(err.name === 'TokenExpireError'){
        const message = `Invalid JSON Web Expired, Try Again`
        err = new ErrorHandler(message,400)
    }

    // DB Duplicate key error
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`
        err = new ErrorHandler(message,400)
    }

    res.status(err.statusCode).json({
        success: false,
        // error : err,
        message: err.message,
        // stack: err.stack
    })
}