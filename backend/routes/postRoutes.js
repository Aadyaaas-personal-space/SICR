
const express = require("express");

const {
    createPost,
    getPosts,
    getPostById,
    editPost,
    deletePost,
    toggleLike,
    addComment,
} = require("../controllers/postController");

const universalConnectionAuth = require("../middleware/universalConnectionAuth");

const router = express.Router();

router.post("/", universalConnectionAuth, createPost);
router.get("/", universalConnectionAuth, getPosts);
router.get("/:postId", universalConnectionAuth, getPostById);

router.patch("/:postId", universalConnectionAuth, editPost);
router.delete("/:postId", universalConnectionAuth, deletePost);

router.patch("/:postId/like", universalConnectionAuth, toggleLike);
router.post("/:postId/comments", universalConnectionAuth, addComment);

module.exports = router;
