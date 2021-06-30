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
    let saveUser = null
    let token = null

    const data = await UserModel.findOne({
        where: { email: req.body.emailFromFront }
    })

    console.log('data', data)

    if (data != null) {
        error.push('utilisateur déjà présent')
    }

    if (req.body.emailFromFront === '' || req.body.password === '' || req.body.nameFromFront === '' || req.body.firstNameFromFront === '') {
        error.push('champs vides')
    }

    if (error.length===0) {
        const hash = bcrypt.hashSync(req.body.passwordFromFront, 10);

        let newAccount = UserModel.build({
            nom: req.body.nameFromFront,
            prenom: req.body.firstNameFromFront,
            email: req.body.emailFromFront,
            password : hash,
            token : uid2(32)
        })

        saveNewAccount = await newAccount.save()
        console.log('saveAccount', saveNewAccount)

        if(saveNewAccount) {
            result = true
            token = saveNewAccount.dataValues.token
        }

        console.log('token', token)
    }

    res.json({token, result, error, saveNewAccount})
});

router.post('/signin', async (req, res, next) => {
    // console.log(req.body)
})

module.exports = router;