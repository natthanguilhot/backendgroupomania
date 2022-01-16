const { Comments } = require("../models");

exports.createComment = (req, res, next) => {
    Comments.create({
        content: req.body.content,
        user_id: req.body.userId,
        post_id: req.body.postId,
    })
    .then(() => res.status(201).json({ message : 'Commentaire ajouté !'}))
    .catch(err => res.status(500).json({ err }))
};

exports.deleteComment = (req, res, next) => {
    Comments.destroy({ where: {id : req.body.commentId},
    })
    .then(() => res.status(201).json({ message : 'Commentaire supprimé !'}))
    .catch(err => res.status(500).json({ err }))
};


exports.getAllCommentsFromOnePost = (req, res, next) => {
    Comments.findAll({
        where: {post_id: req.body.postId},
        attributes : [['id','commentId'],'user_id','post_id','content','createdAt','updatedAt'],
    })
    .then(comments => res.status(200).json(comments))
    .catch(err => res.status(500).json({ err }))
};