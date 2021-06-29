var express = require('express');
var router = express.Router();

const sequelize = require('../utils/database')
const User = require('../models/users')
sequelize.sync()

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
