const { Likes } = require("../models");

exports.createLike = (req, res, next) => { // 0 dislike || 1 like
    console.log(req.body);
    Likes.findOne({where:{user_id: req.body.userId, post_id: req.body.postId}})
    .then(result =>{ 
        if(!result){
            Likes.create({
                where:{user_id: req.body.userId, post_id: req.body.postId},
                user_id: req.body.userId,
                post_id: req.body.postId,
                comment_id: req.body.commentId,
            })
            .then(() => res.status(201).json({ message : 'Votre vote a bien été ajouté !'}))
            .catch(err => res.status(500).json({ err }))
        } else {
            Likes.destroy({where:{user_id: req.body.userId, post_id: req.body.postId}})
                .then(() => res.status(201).json({ message : 'Votre vote a bien été enlevé !'}))
                .catch(err => res.status(500).json({ err }))
        }
    })
    .catch(() => res.status(500).json({ error : 'user not found' }))
};

exports.getAllLikesFromOnePost = (req, res, next) => {
    Likes.findAll({
        where: {post_id: req.body.postId},
        attributes : [['id','likeId'],'user_id','post_id','comment_id','is_liked','createdAt','updatedAt'],
    })
    .then(likes => res.status(200).json(likes))
    .catch(err => res.status(500).json({ err }))
};

exports.getAllLikesFromOneComment = (req, res, next) => {
    Likes.findAll({
        where: {comment_id: req.body.commentId},
        attributes : [['id','likeId'],'user_id','post_id','comment_id','is_liked','createdAt','updatedAt'],
    })
    .then(likes => res.status(200).json(likes))
    .catch(err => res.status(500).json({ err }))
};