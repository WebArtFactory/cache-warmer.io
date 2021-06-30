const Sequelize = require('sequelize');
const sequelize = require('./connection');

const User = sequelize.define("user",{
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
    }, {
      timestamps : false
    })


module.exports = User;

// module.exports = (sequelize, Sequelize) => {
//     const User = sequelize.define("user",{
//         user_id: {
//             type: Sequelize.INTEGER,
//             autoIncrement: true,
//             allowNull: false,
//             primaryKey: true
//         },
//         prenom : { type: Sequelize.STRING, allowNull: false },
//         nom: { type: Sequelize.STRING, allowNull: false },
//         email: { type: Sequelize.STRING, allowNull: false },
//         password: { type: Sequelize.STRING, allowNull: false },
//         token: { type: Sequelize.STRING, allowNull: false }
//     })
//     try {
//         sequelize.authenticate();
//         console.log('Connecté à la base de données MySQL!');
//       } catch (error) {
//         console.error('Impossible de se connecter, erreur suivante :', error);
//       }
//     return User
// }



