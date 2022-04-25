const express = require("express");
const router = express.Router();

const postCtrl = require("../controllers/posts");
const multer = require("../middleware/multer-posts-config");
const auth = require("../middleware/auth");

// Create post
router.post("/", multer, postCtrl.createPost);

// Get all posts
router.get("/", postCtrl.getAllPosts);

// Get one post
router.post("/:id", postCtrl.getOnePosts);

// Delete post
router.delete("/:id", auth, postCtrl.deleteOnePost);

module.exports = router;
