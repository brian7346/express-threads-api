const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user-controller");
const PostController = require("../controllers/post-controller");
const FollowController = require("../controllers/follow-controller");
const LikeController = require("../controllers/like-controller");
const CommentController = require("../controllers/comment-controller");

// User routes
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/users", UserController.getAllUsers);
router.get("/users/:id", UserController.getUserById);
router.put("/users/:id", UserController.updateUser);

// Post routes
router.post("/posts", PostController.createPost);
router.get("/posts", PostController.getAllPosts);
router.get("/posts/:id", PostController.getPostById);
router.delete("/posts/:id", PostController.deletePost);

// Follow routes
router.post("/follow", FollowController.followUser);
router.delete("/unfollow", FollowController.unfollowUser);

// Like routes
router.post("/likes", LikeController.likePost);
router.delete("/likes", LikeController.unlikePost);

// Comment routes
router.post("/comments", CommentController.createComment);
router.get("/comments", CommentController.getAllComments);
router.delete("/comments/:id", CommentController.deleteComment);

module.exports = router;
