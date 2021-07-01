var express = require('express');
var router = express.Router();

//pourquoi pas de require sur mysql sur ce fichier ??? car nous allons en avoir besoin 
// const sequelize = require('../utils/database')
const UserModel = require('../models/users');

const uid2 = require("uid2");
const bcrypt = require("bcrypt");
// sequelize.sync()



router.post('/signup', async (req, res, next) => {
    console.log('reqbody signup', req.body)
    // SELECT * FROM `login`
    let error = []
    let result = false
    // let saveUser = null
    let token = null

    //on recherche par l'adresse mail si l'utilisateur existe en BDD
    const data = await UserModel.findOne({
        where: { email: req.body.emailFromFront }
    })

    console.log('data', data)

    //si l'utilisateur existe en bdd on renvoit une erreur
    if (data != null) {
        error.push('utilisateur déjà présent')
    }

    //si l'un des champs est vide on renvoit une erreur
    if (req.body.emailFromFront === '' || req.body.password === '' || req.body.nameFromFront === '' || req.body.firstNameFromFront === '') {
        error.push('Merci de remplir tous les champs!')
    }

    //si il n'y a aucunes erreurs on créer un nouvel utilisateur 
    if (error.length === 0) {
        const hash = bcrypt.hashSync(req.body.passwordFromFront, 10);

        let newAccount = UserModel.build({
            nom: req.body.nameFromFront,
            prenom: req.body.firstNameFromFront,
            email: req.body.emailFromFront,
            password: hash,
            token: uid2(32)
        })

        saveNewAccount = await newAccount.save()
        console.log('saveAccount', saveNewAccount)

        if (saveNewAccount) {
            result = true
            token = saveNewAccount.dataValues.token
        }

        console.log('token', token)
    }

    res.json({ token, result, error })
});

router.post('/signin', async (req, res, next) => {
    console.log(req.body)

    let error = []
    let result = false
    let token = null
    let user = null

    //on renvoit une erreur si l'un des champs est vide
    if (req.body.emailFromFront === '' || req.body.passwordFromFront === '') {
        error.push('Merci de remplir tous les champs!')
    }

    //si il n'y a pas d'erreur on cherche l'utilisateur en BDD avec son email
    if (error.length === 0) {
        user = await UserModel.findOne({
            where: { email: req.body.emailFromFront }
        })
    }

    //si on trouve un utilisateur en bdd on compare son mdp si celui-ci est faux on renvoit une erreur
    if (user) {
        if (bcrypt.compareSync(req.body.passwordFromFront, user.password)) {
            result = true
            token = user.token
        } else {
            result = false
            error.push('mot de passe incorrect')
        }
    } else {
        error.push('email incorrect')
    }

    res.json({token, result, error})
});

module.exports = router;