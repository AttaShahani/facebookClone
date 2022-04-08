const asyncErrors = require("../middlewares/asyncErrors");
const ErrorHandler = require("../utils/errorhandler");
const User = require("../models/User");
const post = require("../models/Post")
const sendJWTToken = require("../utils/token");
const Post = require("../models/Post");

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


// Get User Details (For Profile) 
exports.myProfile = asyncErrors( async (req,res,next)=>{
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user
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

// User Account Delete 
exports.deleteAccount = asyncErrors(async (req,res,next)=>{
    const me = await User.findById(req.user.id)
   const myFollowers = me.followers;
   const myFollowings = me.followings;
   const myPosts = me.posts;
   const allPosts = await Post.find()


//    Remiving User from followers' followings 

   myFollowers.forEach(async(follower) => {
       const myFollower = await User.findById(follower);
       myFollower.followings.forEach(async(following,index)=>{
           if(following.toString()===me._id.toString()){
                myFollower.followings.splice(index,1)
                await myFollower.save()
           }
       })

   });

//    Remiving User from followings' followers

   myFollowings.forEach(async(following) => {
       const myFollowing = await User.findById(following);

       myFollowing.followers.forEach(async(follower,index)=>{
        if(follower.toString()===me._id.toString()){
            myFollowing.followers.splice(index,1)
             await myFollowing.save()
        }
    })
   });

//    Removing User Posts 

   myPosts.forEach(async(postId)=>{
       const myPost = await Post.findById(postId);
       if(myPost){
           await myPost.remove()
       }
   })

//    Remiving User Likes from All Posts
    allPosts.forEach(async(item)=>{
        const post = await Post.findById(item._id);
        post.likes.forEach(async(likedUser,index)=>{
            if(likedUser.toString()===me._id.toString()){
                post.likes.splice(index,1)
                await post.save()
            }
        })
    })

//    Remiving User Comments from All Posts

    allPosts.forEach(async(item)=>{
        const commentedPost = await Post.findById(item._id);
        commentedPost.comments.forEach(async(commentUser,index)=>{
            if(commentUser.user.toString()===me._id.toString()){
                commentedPost.comments.splice(index,1)
                await commentedPost.save()
            }
        })
    })

    // Logging Out User 

    res.cookie("token",null,{expires:new Date(Date.now()),httpOnly:true});

    // Removing User 
    await me.remove()

   res.status(200).json({
      success:true,
      message:"Your Account Deleted Successfully"
   })
   
})
