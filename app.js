const express = require('express');
const app = express();
const { Sequelize } = require('sequelize');
const userRoutes = require('./routes/user');
const postsRoutes = require('./routes/post');
const commentsRoutes = require('./routes/comment');
const likesRoutes = require('./routes/like');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize('mysql://ncuser_3495:0jnbzuLpBwI0A7spE9jivAGWKWbTuM@mysql-groupomania-17379.nodechef.com:2495/groupomania');

sequelize.authenticate()
.then(() => console.log('Connection to MySQL successed !'))
.catch((err) => {
    console.log(err);
    console.log('Connection to MySQL failed !');
});

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
}); 

app.use('/images/posts', express.static(path.join(__dirname, 'images/posts')));
app.use('/images/users', express.static(path.join(__dirname, 'images/users')))


app.use('/api/auth', userRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/likes', likesRoutes);

module.exports = app;