const express = require('express');
const router = express.Router();

const likeCtrl = require('../controllers/likes');
const auth = require('../middleware/auth');


// Create like
router.post('/post/:id', auth, likeCtrl.createLike);

// Get all likes from one post
router.get('/post/:id', auth, likeCtrl.getAllLikesFromOnePost); 

// Gett all likes from one comment
router.get('/comment/:id', auth, likeCtrl.getAllLikesFromOneComment);

module.exports = router;
