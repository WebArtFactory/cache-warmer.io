var express = require('express');
var router = express.Router();

//pourquoi pas de require sur mysql sur ce fichier ??? car nous allons en avoir besoin 
// const sequelize = require('../utils/database')
const User = require('../models/users')
// sequelize.sync()

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// router.post('/signup', async (req, res, next) => {
// console.log(req.body)
// // SELECT * FROM `login`
// });

// router.get('/signin', async (req, res, next) => {
// console.log(req.query)
// })

module.exports = router;
