const models = require("../models");
const fs = require('fs');

exports.createPost = (req, res, next) => {
    console.log(req.body.content);
    if(req.file){ // Verifier si y a un content
        models.Posts.create({
            creator: req.body.userId,
            files: `${req.protocol}://${req.get('host')}/images/posts/${req.file.filename}`,
            content: req.body.content
        })
        .then(() => res.status(201).json({ message : 'Post créé !'}))
        .catch(err => res.status(500).json({ err }))    
    } else {
        models.Posts.create({
            creator: req.body.userId,
            content: req.body.content
        })
        .then(() => res.status(201).json({ message : 'Post créé !'}))
        .catch(err => res.status(500).json({ err }))    
    }
};

exports.getAllPosts = (req, res, next) => {
    models.Posts.findAll({
        attributes : [['id','postId'],['creator','userId'],'files','content','createdAt','updatedAt'],
        order: [["createdAt", "DESC"]],
        include : [{ 
            model : models.users,
            attributes : ['name','lastname' , 'profile_picture'],
        },
        {
            model : models.likes,
        },
        {
            model : models.comments,
        }
        ],
    })
    .then(posts => {
        res.status(200).json(posts)
    })
    .catch(err => res.status(500).json({ err }))
};

exports.getOnePosts = (req, res, next) => {
    console.log(req.body);
    models.Posts.findOne({
        where : {id: req.body.postId},
        attributes : [['id','postId'],['creator','userId'],'files','content','createdAt','updatedAt'],
        include : [
            { 
            model : models.users,
            attributes : ['name','lastname' , 'profile_picture', 'account_type'],
            },
            {
                model : models.likes,
            },
            {
                model : models.comments,
                attributes : ['id', 'user_id' , 'post_id', 'content'],
                include : [{ model: models.users, attributes: ['lastname', 'profile_picture', 'name'] }]
            },
        ],
    })
    .then(posts => {
        res.status(200).json(posts)
    })
    .catch(err => res.status(500).json({ err }))
};


exports.deleteOnePost = (req, res, next) => { // TODO : Supprimer fichier du post s'il y en a un
    models.Likes.destroy({where: {post_id: req.body.postId}})
    models.Comments.destroy({where: {post_id: req.body.postId}})
    models.Posts.destroy({
        where: { id : req.body.postId}
    })
    .then(() => {
        res.status(200).json({message : 'Post supprimé !'})
    })
    .catch(err => res.status(500).json({ err }))
};
