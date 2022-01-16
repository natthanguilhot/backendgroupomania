const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/users');
const multer = require('../middleware/multer-users-config');
const auth = require('../middleware/auth');

// CREATE USER
router.post('/signup', userCtrl.signup);

// LOGIN USER
router.post('/login', userCtrl.login);

// GET ONE USER
router.post('/user/:id', auth, userCtrl.getOneUser);

// GET ONE USER PROFILE
router.post('/userprofil/:id', auth, userCtrl.getOneUserProfil)

//MODIFY USER
router.put('/user/:id', auth, multer, userCtrl.userUpdate);

// DELETE USER
router.delete('/user/:id', auth, userCtrl.userDelete);


module.exports = router;