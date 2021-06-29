const Sequelize = require('sequelize');


const sequelize = new Sequelize(
    // "database",
    // "user_id",
    // "prenom",
    // "nom",
    // "email",
    // "password",
    // "token",
    process.env.MYSQL_DATABASE,
    process.env.MYSQL_USERNAME,
    process.env.MYSQL_PASSWORD,

    // 'DATABASE_USER_ID',
    // 'DATABASE_PRENOM',
    // 'DATABASE_NOM',
    // 'DATABASE_EMAIL',
    // 'DATABASE_PASSWORD',
    // 'DATABASE_TOKEN',
    {
        dialect: 'mysql',
        host: 'localhost'
    }
);

module.exports.sequelize = sequelize;