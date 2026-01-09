// database.js
const mysql = require('mysql2');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',        // your MySQL username
    password: 'Mysql123',        // your MySQL password
    database: 'myapp'    // make sure this database exists
});

db.getConnection((err, connection) => {
    if (err) console.error('Database connection failed:', err);
    else {
        console.log('Connected to MySQL database!');
        connection.release();
    }
});

module.exports = db;
