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

// User Account Updation

exports.updateProfile = asyncErrors(async (req,res,next)=>{
    const newUserData = {
        username:req.body.name,
        email: req.body.email,
    }

    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{new:true})
        res.status(200).json({
            success: true,
            message: "User Updated Successfully",
            user
        })
})

// User Password Updation

exports.updatePassword = asyncErrors(async (req,res,next)=>{
    const user = await User.findById(req.user.id).select("+password");
    const {oldPassword, newPassword} = req.body;
    if(!oldPassword || !newPassword) {
        return next( new ErrorHandler("You Must Provide old and new Passwords",401))
    }

    const isSamePassword = await user.comparePassword(oldPassword);
    if(!isSamePassword) {
        return next(new ErrorHandler("Incorrect Old Password",403))
    }

    user.password = newPassword;
    await user.save()
    res.status(200).json({
        success: true,
        message: "Your Password Successfully updated"
    });
})

// Follow and Unfollow Users 

exports.followUnfollowUsers = asyncErrors(async (req,res,next)=>{
    const userToFollow = await User.findById(req.params.id);
    const me = await User.findById(req.user.id)
    if(!userToFollow){
        return next(new ErrorHandler("User Not Found",404))
    }
    if(userToFollow._id.toString() === me._id.toString()){
        return next(new ErrorHandler("You can't Follow Yourself",403))
    }
    
    if(me.followings.includes(userToFollow._id)){
        await me.updateOne({$pull:{followings:userToFollow._id}})
        await userToFollow.updateOne({$pull:{followers:me._id}});

        return res.status(200).json({
            success: true,
            message: "User Unfollowed Successfully"
        })
    }

    await me.updateOne({$push:{followings:userToFollow._id}})
        await userToFollow.updateOne({$push:{followers:me._id}});

        res.status(200).json({
            success: true,
            message: "User Followed Successfully"
        })
})
// Get Followers 
exports.getAllFollowers = asyncErrors(async (req,res,next)=>{
    const currentUser = await User.findById(req.user.id)
    const myFollowers = await User.find({
        followings:{
            $in: currentUser._id
        }
    })
    res.status(200).json({
        success: true,
        myFollowers
    })
})
// Get All Followings 
exports.getAllFollowings = asyncErrors(async (req,res,next)=>{
    const currentUser = await User.findById(req.user.id)
    const myFollowings = await User.find({
        followers:{
            $in: currentUser._id
        }
    })
    res.status(200).json({
        success: true,
        myFollowings
    })
})