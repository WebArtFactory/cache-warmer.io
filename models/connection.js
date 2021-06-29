//Quand on utilise mysql2 il n'y a pas besoin d'utiliser mysql ? 

// const mysql2 = require('mysql2');

// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'cachewarmer',
//     password: 'J53wwebart535', 
//     database : 'users'
// });

// connection.connect(function(err) {
//     if (err) throw err;
//     console.log("Connecté à la base de données MySQL!");
//   });

// connection.query(
//     'SELECT * FROM cachewarmer',
//     function(err, results, fields) {
//         if(err) {
//             console.log(err)
//         } else {
//             console.log('_____________________BDD OKAY_______________________')
//             console.log('results', results)
//             console.log('fields', fields)
//         }
//     }
// )