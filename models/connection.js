const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'test'
});

connection.query(
    'SELECT * FROM cachewarmer',
    function(err, results, fields) {
        if(err) {
            console.log(err)
        } else {
            console.log('_____________________BDD OKAY_______________________')
            console.log('results', results)
            console.log('fields', fields)
        }
    }
)