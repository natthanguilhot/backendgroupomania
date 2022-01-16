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

const sequelize = new Sequelize(process.env.NAME_DATABASE, process.env.USER_DATABASE, process.env.PASSWORD_DATABASE, {
    host: process.env.HOST,
    dialect: 'mysql'
});

sequelize.authenticate()
.then(() => console.log('Connexion à MySQL réussie !'))
.catch((err) => {
    console.log(err);
    console.log('Connexion à MySQL échoué !');
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