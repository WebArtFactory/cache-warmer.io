const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const User = sequelize.define('user',{
        user_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        prenom : { type: Sequelize.STRING, allowNull: false },
        nom: { type: Sequelize.STRING, allowNull: false },
        email: { type: Sequelize.STRING, allowNull: false },
        password: { type: Sequelize.STRING, allowNull: false },
        token: { type: Sequelize.STRING, allowNull: false }
    })


module.exports = User;