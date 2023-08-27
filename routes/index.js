const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user-controller");
const PostController = require("../controllers/post-controller");
const FollowController = require("../controllers/follow-controller");
const LikeController = require("../controllers/like-controller");
const CommentController = require("../controllers/comment-controller");
const { authenticateToken } = require("../middleware/auth");
const multer = require('multer');

const uploadDestination = 'uploads';

// Показываем, где хранить загружаемые файлы
const storage = multer.diskStorage({
  destination: uploadDestination,
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });
// User routes
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/users", authenticateToken, UserController.getAllUsers);
router.get("/users/:id", authenticateToken, UserController.getUserById);
router.put("/users/:id", authenticateToken, upload.single('avatar'), UserController.updateUser);

// Post routes
router.post("/posts", authenticateToken, PostController.createPost);
router.get("/posts", authenticateToken, PostController.getAllPosts);
router.get("/posts/:id", authenticateToken, PostController.getPostById);
router.delete("/posts/:id", authenticateToken, PostController.deletePost);

// Follow routes
router.post("/follow", authenticateToken, FollowController.followUser);
router.delete("/unfollow", FollowController.unfollowUser);

// Like routes
router.post("/likes", authenticateToken, LikeController.likePost);
router.delete("/likes", authenticateToken, LikeController.unlikePost);

// Comment routes
router.post("/comments", authenticateToken, CommentController.createComment);
router.get("/comments", authenticateToken, CommentController.getAllComments);
router.delete(
  "/comments/:id",
  authenticateToken,
  CommentController.deleteComment
);

module.exports = router;
