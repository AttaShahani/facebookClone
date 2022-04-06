const Post = require("../models/Post");
const ErrorHandler = require("../utils/errorhandler");
const asyncErrors = require("../middlewares/asyncErrors");
const User = require("../models/User");

// Create Post
exports.createPost = asyncErrors(async (req, res, next) => {
  const newPostData = {
    caption: req.body.caption,
    image: {
      public_id: "Sample id",
      url: "sample Url",
    },
    owner: req.user.id,
  };
  const newPost = await Post.create(newPostData);
  const postOwner = await User.findById(req.user.id);
  postOwner.posts.push(newPost._id);
  await postOwner.save();

  res.status(201).json({
    success: true,
    newPost,
  });
});
// Update Post
exports.updatePost = asyncErrors(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  const updatePostData = {
    caption: req.body.caption,
  };
  if (!post) {
    return next(new ErrorHandler("Post Not Found", 404));
  }
  if (post.owner.toString() !== req.user.id.toString()) {
    return next(
      new ErrorHandler("You are not allowed to update this post", 401)
    );
  }

  const updatedPost = await post.updateOne(updatePostData, { new: true });
  res.status(200).json({
    success: true,
    message: "Post Updated Successfully",
    updatedPost,
  });
});
// Delete Post
exports.deletePost = asyncErrors(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  const postOwner = await User.findById(req.user.id);
  if (!post) {
    return next(new ErrorHandler("Post Not Found", 404));
  }
  if (post.owner.toString() !== req.user.id.toString()) {
    return next(
      new ErrorHandler("You are not allowed to delete this post", 401)
    );
  }

  if (postOwner.posts.includes(post._id)) {
    await postOwner.updateOne({ $pull: { posts: post._id } });
  }
  await post.remove();

  res.status(200).json({
    success: true,
    message: "Post remove Successfully",
  });
});

// Like and Unlike Post
exports.likeUnlikePost = asyncErrors(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorHandler("Post Not Found", 404));
  }
  if (post.likes.includes(req.user.id)) {
    await post.updateOne({ $pull: { likes: req.user.id } });
    return res.status(200).json({
      success: true,
      message: "Post Unliked Successfully",
    });
  }
  await post.updateOne({ $push: { likes: req.user.id } });
  res.status(200).json({
    success: true,
    message: "Post Liked Successfully",
  });
});
// Add Update Comments on Post
exports.addUpdateComment = asyncErrors(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorHandler("Post Not Found", 404));
  }
  let commentIndex = -1;
  post.comments.forEach((ele, indx) => {
    if (ele.user.toString() === req.user.id.toString()) {
      commentIndex = indx;
    }
  });
  if (commentIndex !== -1) {
    post.comments[commentIndex].comment = req.body.comment;
    await post.save();
    return res.status(200).json({
      success: true,
      message: "Comment Updated Successfully",
    });
  }
  post.comments.push({
    user: req.user.id,
    comment: req.body.comment,
  });
  await post.save();
  res.status(200).json({
    success: true,
    message: "Comment Added Successfully",
  });
});

// Delete Comment 

exports.deleteComment = asyncErrors(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return next(new ErrorHandler("Post Not Found", 404));
  }
  if (post.owner.toString() === req.user.id.toString()) {
    if(req.body.commentId === undefined){
      return next (new ErrorHandler("Please Provide Comment ID",400))
    }
    post.comments.forEach((item,indx)=>{
      if(item._id.toString()===req.body.commentId.toString()){
        return post.comments.splice(indx,1)
      } else {
        return next(new ErrorHandler("No Such a Comment Found",404))
      }
    })
    await post.save()
    res.status(200).json({
      success: true,
      message:"Selected Comment Deleted Successfully"
    })
  } else {
    post.comments.forEach((item,index)=>{
      if(item.user.toString()===req.user.id.toString()){
        return post.comments.splice(index,1)
      } else {
        return next(new ErrorHandler("You have not Commented Yet",404))
      }
    })
    await post.save()
    return res.status(200).json({
      success: true,
      message:"Your Comment Deleted"
    })
  }
});

// Feed Posts 
exports.getFeedPosts = asyncErrors(async(req,res,next)=>{
  const me = await User.findById(req.user.id);
  const myPosts = await Post.find({owner:{$in:me._id}})
  const myFollowingPosts = await Post.find({owner:{$in:me.followings}})
  const myFeed = myPosts.concat(myFollowingPosts);
  res.status(200).json({
    success: true,
    myFeed,
  })
})
// Get My Own Posts 
exports.getMyPosts = asyncErrors(async(req,res,next)=>{
  const myPosts = await Post.find({owner:{$in:req.user.id}})
  const total = myPosts.length;
  res.status(200).json({
    success:true,
    myPosts,
    total
  })
})
// Get Single Post 
exports.getSinglePost = asyncErrors(async (req,res,next)=>{
  const post = await Post.findById(req.params.id);
  if(!post){
    return next (new ErrorHandler("No Such a Post Found",404))
  }
  res.status(200).json({
    success: true,
    post
  })
})