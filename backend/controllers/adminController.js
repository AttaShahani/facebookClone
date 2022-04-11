const asyncErrors = require("../middlewares/asyncErrors");
const ErrorHandler = require("../utils/errorhandler");
const User = require("../models/User");
const Post = require("../models/Post");

// get single user
exports.getSingleUser = asyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler("User Not Found", 404));
  }
  res.status(200).json({
    success: true,
    user,
  });
});
// get all users
exports.getAllUsers = asyncErrors(async (req, res, next) => {
  const users = await User.find();
  if (users.length < 0) {
    return next(new ErrorHandler("Currently No User Registered", 400));
  }
  res.status(200).json({
    success: true,
    users,
  });
});
// update user
exports.updateUserRole = asyncErrors(async (req, res, next) => {
  const newUserData = {
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
  });
  res.status(200).json({
    success: true,
    message: "User Updated Successfully",
    user,
  });
});

// delete user
exports.deleteUserAccount = asyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  const userFollowers = user.followers;
  const userFollowings = user.followings;
  const userPosts = user.posts;
  const allPosts = await Post.find();

  //    Remiving User from followers' followings

  userFollowers.forEach(async (follower) => {
    const userFollower = await User.findById(follower);
    userFollower.followings.forEach(async (following, index) => {
      if (following.toString() === user._id.toString()) {
        userFollower.followings.splice(index, 1);
        await userFollower.save();
      }
    });
  });

  //    Remiving User from followings' followers

  userFollowings.forEach(async (following) => {
    const userFollowing = await User.findById(following);

    userFollowing.followers.forEach(async (follower, index) => {
      if (follower.toString() === user._id.toString()) {
        userFollowing.followers.splice(index, 1);
        await userFollowing.save();
      }
    });
  });

  //    Removing User Posts

  userPosts.forEach(async (postId) => {
    const userPost = await Post.findById(postId);
    if (userPost) {
      await userPost.remove();
    }
  });

  //    Remiving User Likes from All Posts
  allPosts.forEach(async (item) => {
    const post = await Post.findById(item._id);
    post.likes.forEach(async (likedUser, index) => {
      if (likedUser.toString() === user._id.toString()) {
        post.likes.splice(index, 1);
        await post.save();
      }
    });
  });

  //    Remiving User Comments from All Posts

  allPosts.forEach(async (item) => {
    const commentedPost = await Post.findById(item._id);
    commentedPost.comments.forEach(async (commentUser, index) => {
      if (commentUser.user.toString() === user._id.toString()) {
        commentedPost.comments.splice(index, 1);
        await commentedPost.save();
      }
    });
  });

  // Removing User
  await user.remove();

  res.status(200).json({
    success: true,
    message: "User Account Deleted Successfully",
  });
});
// get single post
exports.getOnePost = asyncErrors(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return next(new ErrorHandler("No Such a Post Found", 404));
  }
  res.status(200).json({
    success: true,
    post,
  });
});
// get all posts
exports.getAllPosts = asyncErrors(async (req, res, next) => {
  const posts = await Post.find();
  if (posts.length < 0) {
    return next(new ErrorHandler("No Posts Available righ now", 400));
  }
  res.status(200).json({
    success: true,
    posts,
  });
});
// update post
exports.updatePost = asyncErrors(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  const updatePostData = {
    caption: req.body.caption,
  };
  if (!post) {
    return next(new ErrorHandler("Post Not Found", 404));
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
  if (!post) {
    return next(new ErrorHandler("Post Not Found", 404));
  }
  await post.remove();

  res.status(200).json({
    success: true,
    message: "Post remove Successfully",
  });
});

// delete comment on post

exports.deleteComment = asyncErrors(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorHandler("Post Not Found", 404));
  }

  if (req.body.commentId === undefined) {
    return next(new ErrorHandler("Please Provide Comment ID", 400));
  }
  post.comments.forEach((item, indx) => {
    if (item._id.toString() === req.body.commentId.toString()) {
      return post.comments.splice(indx, 1);
    } else {
      return next(new ErrorHandler("No Such a Comment Found", 404));
    }
  });
  await post.save();
  res.status(200).json({
    success: true,
    message: "Selected Comment Deleted Successfully",
  });
});
