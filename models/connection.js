const Sequelize = require('sequelize');


const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE,
    process.env.MYSQL_USERNAME,
    process.env.MYSQL_PASSWORD,
    {
        dialect: 'mysql',
        host: '51.210.100.11'
    }
);

try {
    sequelize.authenticate();  
    console.log('Connecté à la base de données MySQL!');
  } catch (error) {
    console.error('Impossible de se connecter, erreur suivante :', error);
  }

module.exports = sequelize;