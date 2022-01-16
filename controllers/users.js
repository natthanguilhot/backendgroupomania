const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Users, Posts, Comments, Likes } = require("../models");
const models = require("../models");
const fs = require('fs');

exports.signup = (req,res,next) => {
    Users.findOne({ where: { email: req.body.email }})
    .then(newUser => {
        if (newUser == null) { // Si l'email n'est pas présente dans la BDD
            const REGEX_EMAIL = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!REGEX_EMAIL.test(req.body.email)){
                res.status(403).json({ error : 'Email non conforme !'});
            }else if(req.body.lastname.length < 3 ){
                res.status(403).json({ error : 'Le nom de famille doit contenir au moins 3 caractères !'});
            } else if (req.body.name.length < 3){
                res.status(403).json({ error : 'Le prénom doit contenir au moins 3 caractères !'});
            } else {
                console.log('Email non trouvé => Création d\' un nouvel utilisateur !')
                bcrypt.genSalt(8, function(err, salt) {
                    bcrypt.hash(req.body.password, salt, function(err, hash) {
                        const user = Users.create({
                            email: req.body.email,
                            password: hash,
                            account_type:0, // 0 pour normal, 1 pour admin
                            lastname:req.body.lastname, 
                            name:req.body.name,
                            job:req.body.job,
                            profile_picture: 'http://localhost:3000/images/users/default_PP.jpg'
                        });
                        res.status(200).json({message : 'Utilisateur créé !'});
                    });
                });        
            }
        } else { // Si l'email est déjà présente dans la BDD
            console.log('Email trouvé => Abandon de création d\'un nouvel utilisateur !')
            res.status(403).json({ error : 'Un compte est déjà associé à cet adresse mail !'})
        }    
    })
    .catch(error => res.status(500).json({ error }))
};

exports.login = (req,res,next) => {
    Users.findOne({ where : {email: req.body.email}})
    .then(user => {
        if (!user) {
            return res.status(401).json({ error : 'Aucun compte utilisant cet email a été trouvé !'});
        }
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if(!valid) {
                return res.status(401).json({ error : 'Mot de passe incorrect'});
            }
            res.status(200).json({
                userId: user.id,
                token: jwt.sign(
                    { userId: user.id },
                    `${process.env.TOKEN}`
                ),
                message: "Utilisateur connecté !"
            });
        })
        .catch(error => res.status(500).json({ error : 'Bcrypt' }));
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getOneUser = (req,res,next) => { 
    Users.findOne({ where : {id: req.body.userId},
        attributes : ['id','name','lastname','job','profile_picture', 'account_type'],
    })
    .then(user => {
        res.status(200).json(user);
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getOneUserProfil = (req,res,next) => {
    Users.findOne({ where : {id: req.body.getUserId},
        attributes : ['id','name','lastname','job','profile_picture'],
        include : [
            { model : models.posts,
                include : [{ model: models.likes}]
            }
        ]
    })
    .then(user => {
        res.status(200).json(user);
    })
    .catch(error => res.status(500).json({ error }));
};

exports.userUpdate = (req,res,next) => {
    Users.findOne({where: {id: req.body.userId}})
    .then(user => {
        if(req.body.lastname.length < 3 ){
            res.status(403).json({ error : 'Le nom de famille doit contenir au moins 3 caractères !'});
        } else if (req.body.name.length < 3){
            res.status(403).json({ error : 'Le prénom doit contenir au moins 3 caractères !'});
        } else if (req.file) { // Si un fichier est présent
            const filename = user.profile_picture.split('/images/users/')[1];
            if(filename !== 'default_PP.jpg'){ // et si l'utilisateur a déjà une PP alors on remplace l'ancienne par le nouveau fichier
                fs.unlink(`images/users/${filename}`, () => {
                    Users.update({ 
                        ...req.body, 
                        profile_picture: `${req.protocol}://${req.get('host')}/images/users/${req.file.filename}` },
                        { where : {id: req.params.id}})
                    .then(()=>{
                        res.status(200).json({message : 'PP et/ou données utilisateur modifié !'});
                    })
                    .catch(error => res.status(500).json({ error }));    
                })        
            } else { // Sinon si l'utilisateur n'a pas de PP mais qu'il y a un fichier, on ajoute le fichier en tant que PP
            Users.update({ 
                ...req.body, 
                profile_picture: `${req.protocol}://${req.get('host')}/images/users/${req.file.filename}` },
                { where : {id: req.params.id}})
            .then(()=>{
                res.status(200).json({message : 'Donneés utilisateur modifié et/ou une PP à été ajouté !'});
            })
            .catch(error => res.status(500).json({ error }));   
            }
        } else { // S'il n'y a pas de ficher, on met juste a jour les données
            Users.update({ 
                ...req.body
            },
                { where : {id: req.params.id}})
            .then(()=>{
                res.status(200).json({message : 'Données utilisateur modifié !'});
            })
            .catch(error => res.status(500).json({ error }));  
        }
    });
};

exports.userDelete = (req,res,next) => {
    console.log(req.body);
    Users.findOne({where: {id: req.body.userId}})
    .then(user=>{
        const filename = user.profile_picture.split('/images/users/')[1];
        if(filename !== 'default_PP.jpg') { // Si l'utilisateur a une PP autre que celle par défaut, supprimer d'abord la PP puis supprimer l'utilisateur
            fs.unlink(`images/users/${filename}`, () => {
                Likes.destroy({where: {user_id: req.body.userId}})
                Comments.destroy({where: {user_id: req.body.userId}})
                Posts.destroy({where: {creator: req.body.userId}})
                Users.destroy({where: {id: req.body.userId}})
                .then(()=> {
                    res.status(200).json({message : 'Utilisateur supprimé !'});
                })
                .catch(error => res.status(500).json({ error }))
            })
        }else { // Sinon supprimer l'utilisateur directement
            Likes.destroy({where: {user_id: req.body.userId}})
            Comments.destroy({where: {user_id: req.body.userId}})
            Posts.destroy({where: {creator: req.body.userId}})
            Users.destroy({where: {id: req.body.userId}})
            .then(()=> {
                res.status(200).json({message : 'Utilisateur supprimé !'});
            })
            .catch(error => res.status(500).json({ error }))
        }
    })
    .catch(error => res.status(500).json({ error }))
};
