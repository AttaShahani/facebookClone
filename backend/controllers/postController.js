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
// Update Post 
exports.updatePost = asyncErrors(async (req,res,next)=>{
    const post = await Post.findById(req.params.id);
    const updatePostData = {
        caption: req.body.caption
    }
    if(!post){
        return next(new ErrorHandler("Post Not Found",404))
    }
    if(post.owner.toString() !== req.user.id.toString()){
        return next(new ErrorHandler("You are not allowed to update this post",401))
    }

    const updatedPost = await post.updateOne(updatePostData,{new:true})
    res.status(200).json({
        success: true,
        message: "Post Updated Successfully",
        updatedPost
    })

})
// Delete Post 
exports.deletePost = asyncErrors(async (req,res,next)=>{
    const post = await Post.findById(req.params.id);
    const postOwner = await User.findById(req.user.id)
    if(!post){
        return next(new ErrorHandler("Post Not Found",404))
    }
    if(post.owner.toString() !== req.user.id.toString()){
        return next(new ErrorHandler("You are not allowed to delete this post",401))
    }

    if(postOwner.posts.includes(post._id)){
        await postOwner.updateOne({$pull:{posts: post._id}})
    }
    await post.remove()

    res.status(200).json({
        success : true,
        message: "Post remove Successfully"
    })
})

// Like and Unlike Post 
exports.likeUnlikePost = asyncErrors(async (req,res,next)=>{
    const post = await Post.findById(req.params.id);

    if(!post){
        return next(new ErrorHandler("Post Not Found",404))
    }
    if(post.likes.includes(req.user.id)){
        await post.updateOne({$pull:{likes:req.user.id}})
        return res.status(200).json({
            success: true,
            message: "Post Unliked Successfully"
        })
    }
    await post.updateOne({$push:{likes:req.user.id}})
    res.status(200).json({
        success: true,
        message: "Post Liked Successfully"
    })
})