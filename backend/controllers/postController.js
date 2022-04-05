const Post = require("../models/Post")
const ErrorHandler = require("../utils/errorhandler");
const asyncErrors = require("../middlewares/asyncErrors")
const User = require("../models/User")

// Create Post 
exports.createPost = asyncErrors(async (req,res,next)=>{
    const newPostData = {
        caption:req.body.caption,
        image:{
            public_id: "Sample id",
            url:"sample Url"
        },
        owner: req.user.id
    }
    const newPost = await Post.create(newPostData);
    const postOwner = await User.findById(req.user.id);
    postOwner.posts.push(newPost._id);
    await postOwner.save()

    res.status(201).json({
        success: true,
        newPost,
    })
})